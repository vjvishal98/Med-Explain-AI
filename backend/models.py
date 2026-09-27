from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(200), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    preferred_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    medical_reports = relationship("MedicalReport", back_populates="user")
    patient_history = relationship("PatientHistory", back_populates="user")

class MedicalReport(Base):
    __tablename__ = "medical_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    analysis_result = Column(JSON)
    recommendations = Column(JSON)
    language = Column(String(10), default="en")
    upload_date = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="medical_reports")
    history_entries = relationship("PatientHistory", back_populates="report")

class PatientHistory(Base):
    __tablename__ = "patient_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    report_id = Column(Integer, ForeignKey("medical_reports.id"), nullable=True)
    summary = Column(Text)
    key_findings = Column(JSON)
    date_recorded = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="patient_history")
    report = relationship("MedicalReport", back_populates="history_entries")