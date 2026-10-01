from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Question, QuestionOption, User
from app.schemas.schemas import QuestionCreate, QuestionOut
from app.auth.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[QuestionOut])
def get_questions(db: Session = Depends(get_db)):
    return db.query(Question).all()

@router.post("", response_model=QuestionOut)
def create_question(question_in: QuestionCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    question_data = question_in.dict(exclude={"options"})
    question = Question(**question_data, created_by=current_user.id)
    db.add(question)
    db.commit()
    db.refresh(question)
    
    for opt in question_in.options:
        option = QuestionOption(**opt.dict(), question_id=question.id)
        db.add(option)
    db.commit()
    db.refresh(question)
    return question
