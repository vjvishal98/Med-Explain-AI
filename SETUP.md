# MedExplain AI - Setup Instructions

## Prerequisites

1. **MySQL Database**: Ensure MySQL is running and create the `medical_ai` database
2. **Node.js**: Version 16+ for frontend development
3. **Python**: Version 3.8+ for backend development

## Setup Instructions

### 1. Database Setup

```sql
CREATE DATABASE medical_ai;
USE medical_ai;
```

### 2. Backend Setup

Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` to your
MySQL connection string and `SECRET_KEY` to a unique, randomly generated value.
Do not commit `backend/.env`.

```bash
cd backend
pip install -r requirements.txt
python init_db.py  # Initialize database tables
python -m uvicorn main:app --reload --port 8001
```

The backend API will be available at: http://localhost:8001

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend application will be available at: http://localhost:3000

## Features

### Authentication
- **Sign Up**: [POST] `/api/auth/signup`
- **Sign In**: [POST] `/api/auth/signin`

### Medical Reports
- **Upload Report**: [POST] `/api/reports/upload`
- **Get Reports**: [GET] `/api/reports`

### Patient History
- **Get History**: [GET] `/api/history`

### User Profile
- **Get Profile**: [GET] `/api/user/profile`

## Usage

1. **Register**: Create a new account with email, username, full name, and preferred language
2. **Upload**: Upload medical reports (PDF, DOC, DOCX, or images)
3. **Analyze**: Get AI-powered explanations of medical terms and values
4. **History**: View your medical report history and health recommendations

## Project Structure

```
MedicalAI/
├── backend/               # FastAPI backend
│   ├── main.py           # Main application file
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── auth.py           # Authentication logic
│   ├── utils.py          # Utility functions
│   ├── database.py       # Database configuration
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   └── ...
│   └── package.json      # Node.js dependencies
└── README.md
```

## Development

- Backend runs on port 8001
- Frontend runs on port 3000
- Database: MySQL on default port 3306

## Troubleshooting

1. **Port Issues**: If port 8000 is in use, the backend uses port 8001
2. **Database Connection**: Ensure MySQL is running and credentials are correct
3. **Frontend Build Issues**: Try deleting node_modules and running `npm install` again