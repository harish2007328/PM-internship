# 🚀 Team Setup Guide

If you have just cloned this repository, follow these steps to get everything running perfectly.

## 1. Frontend (React)
The frontend is already pre-configured with the cloud database.
```bash
cd frontend
npm install
npm run dev
```

## 2. Backend (Python)
The backend handles local data processing and CSV syncing.
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
python main.py
```

## 3. Troubleshooting
- **Match Scores at 0%?** Ensure you are on the latest code.
- **Vite Error?** Run `npm run dev -- --force`.
- **Database Connection?** The API keys are already in `insforge.js`, so it should work automatically!
