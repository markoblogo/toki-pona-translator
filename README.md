# Toki Pona Translator

A simple web app that translates text into Toki Pona using Gemini 3.

## Features
- **Translate**: Converts text from any language to Toki Pona.
- **Display Modes**:
    - **Latin**: Standard Toki Pona text.
    - **sitelen pona**: Visual script using a custom font mapping.
    - **sitelen emoji**: Emoji representation of Toki Pona words.
- **Learn**: Resources for learning Toki Pona.

## Project Structure
- `/frontend`: React + Vite + TypeScript application.
- `/backend`: Node.js + Express API.

## Setup & Running

### Prerequisites
- Node.js installed.
- A Google Gemini API Key.

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   PORT=3000
   ```
4. Start the server:
   ```bash
   node server.js
   ```

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Mappings
- **sitelen pona**: Uses a font mapping where specific Latin characters or combinations render as logograms.
- **sitelen emoji**: Uses a JSON dictionary to map Toki Pona words to emojis.
