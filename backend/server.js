require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const crypto = require('crypto');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Security headers (safe defaults)
app.use(
  helmet({
    // Keep CSP off for now to avoid accidental blocking in various hosts
    contentSecurityPolicy: false,
  })
);

// Basic request id for correlation
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);
  next();
});

// Access logs
app.use(
  morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms rid=:req[x-request-id]', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);

app.use(cors());
app.use(express.json({ limit: '32kb' }));

// Simple rate limit (override via env if needed)
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  max: Number(process.env.RATE_LIMIT_MAX || 30),
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Initialize providers
const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
if (!OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY is not set. OpenAI translation is disabled.');
}

const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
const OPENAI_MODELS = (
  process.env.OPENAI_MODELS ||
  process.env.OPENAI_MODEL ||
  'gpt-4o-mini,gpt-4.1-mini'
)
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
if (!GEMINI_API_KEY) {
  console.warn('⚠️ GEMINI_API_KEY is not set. Gemini fallback is disabled.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const MODEL_CANDIDATES = (process.env.GEMINI_MODELS || 'gemini-2.0-flash,gemini-1.5-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Upstream timeout after ${ms}ms`)), ms);
    promise
      .then((v) => {
        clearTimeout(t);
        resolve(v);
      })
      .catch((e) => {
        clearTimeout(t);
        reject(e);
      });
  });
}

function extractJsonObject(text) {
  const trimmed = String(text || '').trim();
  if (!trimmed) return null;

  const direct = trimmed.match(/^\{[\s\S]*\}$/);
  if (direct) return direct[0];

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced && fenced[1]) {
    const inFence = fenced[1].match(/\{[\s\S]*\}/);
    if (inFence) return inFence[0];
  }

  const any = trimmed.match(/\{[\s\S]*\}/);
  return any ? any[0] : null;
}

async function generateWithFallback(prompt, timeoutMs) {
  const providerErrors = [];

  if (openai) {
    for (const modelName of OPENAI_MODELS) {
      try {
        const completion = await withTimeout(
          openai.chat.completions.create({
            model: modelName,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: 'You are a precise Toki Pona translation assistant. Return only valid JSON.' },
              { role: 'user', content: prompt },
            ],
          }),
          timeoutMs
        );
        const text = completion?.choices?.[0]?.message?.content;
        if (typeof text === 'string' && text.trim()) {
          return text;
        }
        providerErrors.push(`openai:${modelName}: empty response`);
      } catch (e) {
        providerErrors.push(`openai:${modelName}: ${e?.message || String(e)}`);
      }
    }
  }

  if (genAI) {
    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
          },
        });
        const result = await withTimeout(model.generateContent(prompt), timeoutMs);
        const response = await result.response;
        return response.text();
      } catch (e) {
        providerErrors.push(`gemini:${modelName}: ${e?.message || String(e)}`);
      }
    }
  }

  const err = new Error(
    providerErrors.length
      ? `All translation provider attempts failed (${providerErrors.join(' | ')})`
      : 'No translation provider is configured (OPENAI_API_KEY or GEMINI_API_KEY required)'
  );
  err.statusCode = providerErrors.length ? 502 : 503;
  throw err;
}

app.post('/api/translate', async (req, res) => {
  const startedAt = Date.now();

  try {
    const { text } = req.body || {};

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required', requestId: req.requestId });
    }

    if (text.length > 500) {
      return res.status(413).json({ error: 'Text is too long (max 500 chars)', requestId: req.requestId });
    }

    const prompt = `You are a Toki Pona translator. Detect the input language and translate the meaning into Toki Pona.
Output ONLY valid Toki Pona words as a space-separated list. Return a JSON object with:
- sourceLang: language code (e.g., 'en', 'es'),
- tokiPonaWords: array of strings (the translated words),
- explanation: 1–2 sentences in English describing the Toki Pona translation.

Input text: "${text}"

Response format:
{
  "sourceLang": "...",
  "tokiPonaWords": ["...", "..."],
  "explanation": "..."
}`;

    const timeoutMs = Number(
      process.env.TRANSLATION_TIMEOUT_MS || process.env.OPENAI_TIMEOUT_MS || process.env.GEMINI_TIMEOUT_MS || 12_000
    );

    const textResponse = await generateWithFallback(prompt, timeoutMs);

    // Extract JSON object safely
    const jsonRaw = extractJsonObject(textResponse);
    if (!jsonRaw) {
      throw new Error('Failed to parse JSON from provider response');
    }

    const jsonResponse = JSON.parse(jsonRaw);

    // Basic shape validation
    if (!jsonResponse || !Array.isArray(jsonResponse.tokiPonaWords) || typeof jsonResponse.sourceLang !== 'string') {
      throw new Error('Invalid JSON shape from Gemini');
    }

    res.json({
      ...jsonResponse,
      requestId: req.requestId,
      elapsedMs: Date.now() - startedAt,
    });
  } catch (error) {
    console.error('Translation error:', {
      requestId: req.requestId,
      message: error?.message,
      stack: error?.stack,
    });

    res.status(error?.statusCode || 500).json({
      error: error?.statusCode === 503 ? 'Translation service is not configured' : 'Failed to translate text',
      requestId: req.requestId,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
