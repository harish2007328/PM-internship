# 🚀 Hackathon Demo Guide

This project is now ready for your hackathon demo! It uses **InsForge Cloud** for a shared database, meaning your teammates can see the same data as you, and judges can see the live results.

## 1. Prerequisites
- **Python 3.10+** (for Matching Engine)
- **Node.js 18+** (for React Frontend)

## 2. Shared Cloud Setup
The project is pre-configured with InsForge Cloud. All data (Users, Jobs, Applications) is synced between your local machine and the cloud database automatically on startup.

### Credentials (in `backend/.env`)
- **API Base URL**: `https://74jktci8.us-east.insforge.app`
- **Tables**: `pm_users`, `pm_jobs`, `pm_applications`, `pm_selections`

## 3. How to Run the Demo

### Backend (Python/FastAPI)
1. Navigate to the `backend` folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the server:
   ```bash
   python main.py
   ```
   *Note: On startup, it will sync the latest data from the cloud.*

### Frontend (React/Vite)
1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open the URL shown in your terminal (usually `http://localhost:5173`).

## 4. Demo Flow
1. **Student Registration**: Register a new student. Notice it saves to the cloud!
2. **Matching Engine**: Open the Student Feed. The system uses a high-performance TF-IDF vectorizer to find the best jobs instantly.
3. **Manual Selection**: Use the Company Dashboard to manually select candidates for interview. This status updates in real-time for the student.
4. **Cloud Persistence**: Stop the server and restart it. Notice your registration and applications are still there—they were fetched from the cloud!

## 5. Sharing with Teammates
Just zip this folder and send it to them. As long as they have the `.env` file, they will be connecting to the **same database**. If they apply for a job on their machine, you will see it on yours!

Good luck with the judges! 🏆
