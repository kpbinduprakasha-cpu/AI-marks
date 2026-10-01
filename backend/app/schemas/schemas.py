from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from app.models.models import RoleEnum, DifficultyEnum, QuestionTypeEnum, AssessmentTypeEnum, AssessmentModeEnum, QuestionStatusEnum

# Base Schemas
class UserBase(BaseModel):
    name: str
    email: str
    role: RoleEnum
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str

# Course
class CourseBase(BaseModel):
    name: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseOut(CourseBase):
    id: int
    class Config:
        orm_mode = True

# Skill
class SkillBase(BaseModel):
    name: str
    description: Optional[str] = None
    parent_skill_id: Optional[int] = None

class SkillCreate(SkillBase):
    pass

class SkillOut(SkillBase):
    id: int
    class Config:
        orm_mode = True

# Question
class QuestionOptionBase(BaseModel):
    text: str
    is_correct: bool

class QuestionOptionCreate(QuestionOptionBase):
    pass

class QuestionOptionOut(QuestionOptionBase):
    id: int
    class Config:
        orm_mode = True

class QuestionBase(BaseModel):
    text: str
    type: QuestionTypeEnum
    skill_id: int
    difficulty: DifficultyEnum
    marks: float = 1.0
    expected_answer: Optional[str] = None
    explanation: Optional[str] = None
    status: QuestionStatusEnum = QuestionStatusEnum.DRAFT

class QuestionCreate(QuestionBase):
    options: Optional[List[QuestionOptionCreate]] = []

class QuestionOut(QuestionBase):
    id: int
    created_by: int
    options: List[QuestionOptionOut] = []
    class Config:
        orm_mode = True

# Assessment
class AssessmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    course_id: int
    type: AssessmentTypeEnum
    mode: AssessmentModeEnum
    duration: int
    total_marks: float

class AssessmentCreate(AssessmentBase):
    pass

class AssessmentOut(AssessmentBase):
    id: int
    created_by: int
    status: str
    created_at: datetime
    class Config:
        orm_mode = True

# Attempts & Answers
class AnswerCreate(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    text_answer: Optional[str] = None

class AttemptCreate(BaseModel):
    assessment_id: int

class AttemptOut(BaseModel):
    id: int
    assessment_id: int
    candidate_id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    status: str
    total_score: Optional[float] = None
    class Config:
        orm_mode = True

class AnalyticsOut(BaseModel):
    total_candidates: int
    total_assessments: int
    average_score: float
