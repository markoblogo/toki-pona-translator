# Toki Pona Translator

A minimalist web app that translates text from any language into **Toki Pona** using **Gemini 3**.

🔗 **Live demo:** https://toki.abvx.xyz

---

## Features

- **Auto language detection**  
  Enter text in almost any language – the app detects it and translates the meaning into Toki Pona.

- **Three display modes**
  - **Latin** – standard Toki Pona text.
  - **sitelen pona** – logographic script rendered via a custom sitelen pona font.
  - **sitelen emoji** – emoji representation of Toki Pona words via a dictionary-based mapping.

- **Learn page**
  - Curated resources for learning Toki Pona.
  - Links about sitelen pona and sitelen emoji / sitelen pilin.
  - Toki Pona book translations by the author.

---

## Project structure

```text
toki-pona-translator/
  backend/   # Node.js + Express API (Gemini 3)
  frontend/  # React + Vite + TypeScript app
````

- **backend/** – Express server with a /api/translate endpoint that calls Gemini 3.
    
- **frontend/** – SPA with the translator UI, display modes and Learn page.
    

---

## **Local setup**

  

### **Prerequisites**

- Node.js
    
- A Google Gemini API key (from Google AI Studio)
    

  

### **Backend**

```
cd backend
npm install
```

Create .env:

```
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

Run:

```
node server.js
```

By default the API runs on http://localhost:3000.

  

### **Frontend**

```
cd frontend
npm install
```

Optionally create frontend/.env:

```
VITE_API_BASE_URL=http://localhost:3000
```

If VITE_API_BASE_URL is not set, the app falls back to http://localhost:3000.

  

Run dev server:

```
npm run dev
```

The UI will be available at http://localhost:5173.

---

## **Deployment**

- **Backend**
    
    Deployed as a Node/Express service (e.g. Render) with:
    
    - GEMINI_API_KEY – your Gemini API key
        
    - PORT – provided by the platform or default 3000
        
    
- **Frontend**
    
    Deployed from /frontend (e.g. Vercel) with:
    

```
VITE_API_BASE_URL=https://your-backend-url.example.com
```

  

  

In production this project is available at:

- App: https://toki.abvx.xyz
    

---

## **Tech stack**

- **Frontend:** React, Vite, TypeScript
    
- **Backend:** Node.js, Express
    
- **AI:** Google Gemini 3 (via @google/generative-ai)
    
- **Styling:** minimal custom CSS
    

---

## **Author**

  

Created by **Anton Biletskyi-Volokh**

- Website: https://abvx.xyz
    
- GitHub: https://github.com/markoblogo
    
- Toki Pona books:
    
    - [Meditations of Marcus Aurelius — in Toki Pona](https://www.amazon.com/dp/B0FV3F1RC5)![Attachment.tiff](file:///Attachment.tiff)
        
    - [A Christmas Carol — in Toki Pona](https://www.amazon.com/dp/B0G1N2YHD8)![Attachment.tiff](file:///Attachment.tiff)
        
