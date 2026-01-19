# Toki Pona Translator

[![License](https://img.shields.io/github/license/markoblogo/toki-pona-translator)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/markoblogo/toki-pona-translator)](https://github.com/markoblogo/toki-pona-translator/commits/main)
[![Stars](https://img.shields.io/github/stars/markoblogo/toki-pona-translator?style=social)](https://github.com/markoblogo/toki-pona-translator)

A minimalist web app that translates text from many languages into **Toki Pona** using **Gemini**.

Live demo: https://toki.abvx.xyz

## Demo
[![Toki Pona Translator demo](https://img.youtube.com/vi/lCAFiDnP2NQ/maxresdefault.jpg)](https://youtu.be/lCAFiDnP2NQ)

## Features

- Automatic language detection (input in most languages)
- Multiple display modes:
  - **Latin** (standard Toki Pona)
  - **sitelen pona** (logographic script via custom font)
  - **sitelen emoji** (emoji-based representation)
- Learn page with curated resources (sitelen pona / sitelen emosi / sitelen pilin)

## Screenshots

(Add 1–3 images here. Recommended: main translator UI + sitelen pona mode + learn page.)

## Project structure
toki-pona-translator/
backend/   Node.js + Express API (Gemini)
frontend/  React + Vite + TypeScript app

## Local setup

### Prerequisites

- Node.js (LTS recommended)
- A Gemini API key (Google AI Studio)

### Backend

```bash
cd backend
npm install

Create backend/.env:
GEMINI_API_KEY=your_key_here
PORT=3000

Run the API:
node server.js
By default the API runs at http://localhost:3000.

Frontend
cd frontend
npm install
npm run dev

The UI will be available at http://localhost:5173.
Optional frontend/.env (only needed if your backend is not localhost:3000):
VITE_API_BASE_URL=http://localhost:3000

Deployment notes
	•	Backend: deploy as a Node/Express service (Render / Railway / Fly.io / etc.)
	•	Required env vars: GEMINI_API_KEY, PORT
	•	Frontend: deploy from /frontend (Vercel recommended)
	•	Set VITE_API_BASE_URL to your backend URL

Privacy and costs
	•	Your Gemini API key is required for local development and must be stored in environment variables (.env).
	•	API usage may incur costs depending on your Gemini plan and traffic.
	•	Do not commit keys to the repository.

License

MIT. See LICENSE.

Author

Anton Biletskiy-Volokh
Website: https://abvx.xyz
GitHub: https://github.com/markoblogo
