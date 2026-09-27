# MedExplain AI Healthcare Platform

MedExplain AI is an AI-powered healthcare assistance platform that helps patients understand their medical and blood test reports in a simple and user-friendly way.

## Features

- **Medical Report Upload**: Users can upload their hospital reports
- **Multi-language Support**: Select preferred language for explanations
- **Medical Terms Explanation**: Clear explanations of medical terms, values, and abnormalities
- **Patient History**: Maintains comprehensive patient history
- **Health Recommendations**: General health and lifestyle suggestions based on reports
- **Authentication**: Secure signup and signin functionality

## Tech Stack

- **Frontend**: React.js
- **Backend**: FastAPI
- **Database**: MySQL
- **Authentication**: JWT tokens

## Project Structure

```
MedicalAI/
├── frontend/          # React.js application
├── backend/           # FastAPI application
├── database/          # Database scripts and migrations
├── docs/              # Documentation
└── README.md
```

## Quick Start

1. **Database Setup**: Configure MySQL database
2. **Backend Setup**: Start FastAPI server
3. **Frontend Setup**: Launch React development server

## Configuration

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` and a
unique, randomly generated `SECRET_KEY`. Keep `backend/.env` private; it is
ignored by Git.

## Development

See individual README files in `frontend/` and `backend/` directories for detailed setup instructions.