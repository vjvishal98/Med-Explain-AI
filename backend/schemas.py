from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    password: str
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name: str
    preferred_language: str
    access_token: Optional[str] = None
    
    class Config:
        from_attributes = True

class ReportResponse(BaseModel):
    id: int
    filename: str
    analysis_result: Dict[str, Any]
    recommendations: Dict[str, Any]
    upload_date: datetime
    language: str
    
    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    id: int
    summary: str
    key_findings: List[str]
    date_recorded: datetime
    
    class Config:
        from_attributes = True