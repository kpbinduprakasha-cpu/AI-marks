from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Assessment, User
from app.schemas.schemas import AssessmentCreate, AssessmentOut
from app.auth.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[AssessmentOut])
def get_assessments(db: Session = Depends(get_db)):
    return db.query(Assessment).all()

@router.get("/{id}", response_model=AssessmentOut)
def get_assessment(id: int, db: Session = Depends(get_db)):
    assessment = db.query(Assessment).filter(Assessment.id == id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment

@router.post("", response_model=AssessmentOut)
def create_assessment(assessment_in: AssessmentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    assessment = Assessment(**assessment_in.dict(), created_by=current_user.id)
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment
