from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Skill, User
from app.schemas.schemas import SkillCreate, SkillOut
from app.auth.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db)):
    return db.query(Skill).all()

@router.post("", response_model=SkillOut)
def create_skill(skill_in: SkillCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    skill = Skill(**skill_in.dict())
    db.add(skill)
    db.commit()
    db.refresh(skill)
    return skill
