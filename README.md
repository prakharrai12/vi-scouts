# AI Interview Simulator

A polished full-stack interview practice app.

## Overview

This project includes:
- `frontend/` — React + Vite + Tailwind UI for submitting interview answers and reviewing AI feedback.
- `backend/` — FastAPI service that evaluates answers using Google Gemini AI.

## Features

- Modern React UI with Tailwind styling
- Backend API for answer evaluation
- `npm` frontend workflow with Vite proxy support
- `.env`-based backend configuration

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (recommended 3.11+)
- Google Gemini API key

## Setup

### Backend

1. Open a terminal and change to `backend/`
2. Create a virtual environment:
   ```powershell
   python -m venv venv
   ```
3. Activate it:
   ```powershell
   .\venv\Scripts\Activate
   ```
4. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
5. Copy the example env file:
   ```powershell
   copy .env.example .env
   ```
6. Add your API key to `.env`:
   ```text
   GOOGLE_API_KEY=your_google_api_key
   ```

### Frontend

1. Open a terminal and change to `frontend/`
2. Install dependencies:
   ```powershell
   npm install
   ```

## Running Locally

Start the backend first:

```powershell
cd backend
.\venv\Scripts\Activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Then start the frontend:

```powershell
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173/`.

## Production Build

Build the frontend:

```powershell
cd frontend
npm run build
```

Serve the backend with `uvicorn main:app --host 0.0.0.0 --port 8000` and host the built frontend assets on a static server.
