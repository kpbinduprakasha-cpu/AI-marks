from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.models import Candidate, Assessment, Attempt, User
from app.schemas.schemas import AnalyticsOut
from app.auth.security import get_current_user

router = APIRouter()

@router.get("/admin", response_model=AnalyticsOut)
def get_admin_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_candidates = db.query(Candidate).count()
    total_assessments = db.query(Assessment).count()
    total_attempts = db.query(Attempt).filter(Attempt.status == "COMPLETED").count()
    
    # Mock average score for MVP
    average_score = 75.5 
    
    return AnalyticsOut(
        total_candidates=total_candidates,
        total_assessments=total_assessments,
        average_score=average_score
    )
