const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const crypto = require('crypto');

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Upstream timeout after ${ms}ms`)), ms);
    promise
      .then((v) => { clearTimeout(t); resolve(v); })
      .catch((e) => { clearTimeout(t); reject(e); });
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

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('x-request-id', requestId);
  const startedAt = Date.now();

  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required', requestId });
    }
    if (text.length > 500) {
      return res.status(413).json({ error: 'Text is too long (max 500 chars)', requestId });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim();
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
    const openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
    const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
    const OPENAI_MODELS = (process.env.OPENAI_MODELS || process.env.OPENAI_MODEL || 'gpt-4o-mini,gpt-4.1-mini')
      .split(',').map((m) => m.trim()).filter(Boolean);
    const MODEL_CANDIDATES = (
      process.env.GEMINI_MODELS ||
      'gemini-2.0-flash,gemini-2.0-flash-exp,gemini-1.5-flash-latest,gemini-1.5-flash'
    )
      .split(',').map((m) => m.trim()).filter(Boolean);

    const prompt = `You are a Toki Pona translator. Detect the input language and translate the meaning into Toki Pona. Output ONLY valid Toki Pona words as a space-separated list. Return a JSON object with: - sourceLang: language code (e.g., 'en', 'es'), - tokiPonaWords: array of strings (the translated words), - explanation: 1-2 sentences in English describing the Toki Pona translation. Input text: "${text}" Response format: { "sourceLang": "...", "tokiPonaWords": ["...", "..."], "explanation": "..." }`;

    const timeoutMs = Number(process.env.TRANSLATION_TIMEOUT_MS || 12000);
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
            const jsonRaw = extractJsonObject(text);
            if (!jsonRaw) throw new Error('Failed to parse JSON from provider response');
            const jsonResponse = JSON.parse(jsonRaw);
            if (!jsonResponse || !Array.isArray(jsonResponse.tokiPonaWords) || typeof jsonResponse.sourceLang !== 'string') {
              throw new Error('Invalid JSON shape from OpenAI');
            }
            return res.json({ ...jsonResponse, requestId, elapsedMs: Date.now() - startedAt });
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
          const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: 'application/json' } });
          const result = await withTimeout(model.generateContent(prompt), timeoutMs);
          const response = await result.response;
          const rawText = response.text();
          const jsonRaw = extractJsonObject(rawText);
          if (!jsonRaw) throw new Error('Failed to parse JSON from Gemini response');
          const jsonResponse = JSON.parse(jsonRaw);
          if (!jsonResponse || !Array.isArray(jsonResponse.tokiPonaWords) || typeof jsonResponse.sourceLang !== 'string') {
            throw new Error('Invalid JSON shape from Gemini');
          }
          return res.json({ ...jsonResponse, requestId, elapsedMs: Date.now() - startedAt });
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

  } catch (error) {
    console.error('Translation error:', { requestId, message: error?.message });
    const payload = {
      error:
        error?.statusCode === 503
          ? 'Translation service is not configured'
          : 'Failed to translate text',
      requestId,
    };

    if (process.env.TRANSLATION_DEBUG === '1' && typeof error?.message === 'string') {
      payload.details = error.message.slice(0, 1200);
    }

    res.status(error?.statusCode || 500).json(payload);
  }
};
