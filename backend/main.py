from fastapi import FastAPI, HTTPException, Depends, status, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional, List
import os
from datetime import datetime

from database import get_db
from models import User, MedicalReport, PatientHistory
from schemas import UserCreate, UserLogin, UserResponse, ReportResponse, HistoryResponse
from auth import create_access_token, verify_token, get_password_hash, verify_password
from utils import analyze_medical_report, generate_health_recommendations

app = FastAPI(
    title="MedExplain AI API",
    description="AI-powered healthcare assistance platform API",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:4000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4000",
        "http://77.37.45.138:4000",
        "http://77.37.45.138:3000",
        "http://77.37.45.138:8005",
        "http://localhost:8005"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    payload = verify_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

@app.post("/api/auth/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    try:
        # Check if user already exists
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Check if username already exists
        db_username = db.query(User).filter(User.username == user.username).first()
        if db_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken"
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            hashed_password=hashed_password,
            preferred_language=user.preferred_language or "en"
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        # Generate access token
        access_token = create_access_token(data={"sub": str(db_user.id)})
        
        return UserResponse(
            id=db_user.id,
            email=db_user.email,
            username=db_user.username,
            full_name=db_user.full_name,
            preferred_language=db_user.preferred_language,
            access_token=access_token
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@app.post("/api/auth/signin", response_model=UserResponse)
def signin(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Generate access token
    access_token = create_access_token(data={"sub": str(db_user.id)})
    
    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        username=db_user.username,
        full_name=db_user.full_name,
        preferred_language=db_user.preferred_language,
        access_token=access_token
    )

@app.post("/api/reports/upload", response_model=ReportResponse)
async def upload_report(
    file: UploadFile = File(...),
    language: str = Form(default="en"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Save uploaded file
    file_path = f"uploads/{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
    
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Analyze the medical report
    analysis = analyze_medical_report(file_path, language)
    recommendations = generate_health_recommendations(analysis)
    
    # Save to database
    db_report = MedicalReport(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        analysis_result=analysis,
        recommendations=recommendations,
        language=language
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    # Update patient history
    history_entry = PatientHistory(
        user_id=current_user.id,
        report_id=db_report.id,
        summary=analysis.get("summary", "Medical report uploaded"),
        key_findings=analysis.get("key_findings", [])
    )
    db.add(history_entry)
    db.commit()
    
    return ReportResponse(
        id=db_report.id,
        filename=db_report.filename,
        analysis_result=db_report.analysis_result,
        recommendations=db_report.recommendations,
        upload_date=db_report.upload_date,
        language=db_report.language
    )

@app.get("/api/reports", response_model=List[ReportResponse])
def get_user_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reports = db.query(MedicalReport).filter(MedicalReport.user_id == current_user.id).all()
    return reports

@app.get("/api/history", response_model=List[HistoryResponse])
def get_patient_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    history = db.query(PatientHistory).filter(PatientHistory.user_id == current_user.id).all()
    return history

@app.get("/api/user/profile", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        preferred_language=current_user.preferred_language
    )

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "MedExplain AI API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005)
@app.get("/")
def read_root():
    return {"message": "MedicalAI API is running!"}