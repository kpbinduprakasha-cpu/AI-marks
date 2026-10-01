from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.database import get_db
from app.models.models import Course, User
from app.schemas.schemas import CourseCreate, CourseOut
from app.auth.security import get_current_user

router = APIRouter()

@router.get("", response_model=List[CourseOut])
def get_courses(db: Session = Depends(get_db)):
    return db.query(Course).all()

@router.post("", response_model=CourseOut)
def create_course(course_in: CourseCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    course = Course(**course_in.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course
