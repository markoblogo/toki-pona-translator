# Toki Pona Translator

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/markoblogo/toki-pona-translator)](https://github.com/markoblogo/toki-pona-translator/commits/main)
[![Stars](https://img.shields.io/github/stars/markoblogo/toki-pona-translator?style=social)](https://github.com/markoblogo/toki-pona-translator)

A minimalist web app that translates text from many languages into **Toki Pona** using **OpenAI** (with optional Gemini fallback).

**Live demo:** https://toki.abvx.xyz

**License:** MIT. See [LICENSE](LICENSE).

## Demo

<a href="https://youtu.be/lCAFiDnP2NQ">
  <img src="https://img.youtube.com/vi/lCAFiDnP2NQ/hqdefault.jpg" alt="Toki Pona Translator demo" width="860">
</a>

## Features

- Automatic language detection (input in most languages)
- Multiple output modes:
  - **Latin** (standard Toki Pona)
  - **sitelen pona** (logographic script via a custom font)
  - **sitelen emoji** (emoji-based representation)
- Learn page with curated resources (sitelen pona / sitelen emosi / sitelen pilin)

## Project structure

toki-pona-translator/
backend/   Node.js + Express API (OpenAI + optional Gemini fallback)
frontend/  React + Vite + TypeScript app

## Local setup

### Prerequisites

- Node.js (LTS recommended)
- An OpenAI API key

### Backend

Install dependencies:

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
# Optional fallback:
# GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Run the API:

```bash
node server.js
```

By default, the API runs at:

- http://localhost:3000

### Frontend

Install dependencies and start the dev server:

```bash
cd frontend
npm install
npm run dev
```

The UI will be available at:

- http://localhost:5173

Optional `frontend/.env` (only needed if your backend is not `http://localhost:3000`):

```env
VITE_API_BASE_URL=http://localhost:3000
```

### Deployment

- Backend: deploy as a Node/Express service (Render / Railway / Fly.io, etc.)
  - Required env vars: `OPENAI_API_KEY`, `PORT`
- Frontend: deploy from `/frontend` (Vercel recommended)
  - Set `VITE_API_BASE_URL` to your backend URL (production)

### Privacy and cost notes

- Your API keys must be stored in environment variables (`backend/.env`) and must not be committed.
- OpenAI/Gemini usage may incur costs depending on your plan and traffic.

## Free Toki Pona Reader’s Kit
If you’re learning toki pona: open the free beginner-friendly Reader’s Kit landing page (includes *The Golden Verses of Pythagoras* full text).
- Landing: https://toki-free.abvx.xyz/en

## ASCII theme

Experimental ASCII theme mode (toggle in header) powered by [AsciiTheme](https://github.com/markoblogo/AsciiTheme).
