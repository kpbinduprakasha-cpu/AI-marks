from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.database import get_db
from app.models.models import Attempt, Answer, User, Candidate
from app.schemas.schemas import AttemptCreate, AttemptOut, AnswerCreate
from app.auth.security import get_current_user

router = APIRouter()

@router.post("", response_model=AttemptOut)
def start_attempt(attempt_in: AttemptCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    candidate = db.query(Candidate).filter(Candidate.user_id == current_user.id).first()
    if not candidate:
        raise HTTPException(status_code=400, detail="Only candidates can start attempts")
        
    attempt = Attempt(assessment_id=attempt_in.assessment_id, candidate_id=candidate.id)
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

@router.post("/{id}/answer")
def submit_answer(id: int, answer_in: AnswerCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attempt = db.query(Attempt).filter(Attempt.id == id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    answer = Answer(
        attempt_id=attempt.id,
        question_id=answer_in.question_id,
        selected_option_id=answer_in.selected_option_id,
        text_answer=answer_in.text_answer
    )
    db.add(answer)
    db.commit()
    return {"message": "Answer saved"}

@router.post("/{id}/submit")
def submit_attempt(id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    attempt = db.query(Attempt).filter(Attempt.id == id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="Attempt not found")
        
    attempt.status = "COMPLETED"
    attempt.end_time = datetime.utcnow()
    # Simple scoring logic for MVP
    attempt.total_score = 0.0 # calculate based on answers
    db.commit()
    return {"message": "Attempt submitted successfully", "score": attempt.total_score}
