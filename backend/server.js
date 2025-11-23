require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.post('/api/translate', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const textResponse = response.text();

        // Clean up the response to ensure it's valid JSON
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Failed to parse JSON from Gemini response');
        }

        const jsonResponse = JSON.parse(jsonMatch[0]);
        res.json(jsonResponse);

    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Failed to translate text', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
