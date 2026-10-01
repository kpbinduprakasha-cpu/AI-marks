from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, Float, JSON, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database.database import Base

class RoleEnum(str, enum.Enum):
    CANDIDATE = "CANDIDATE"
    EVALUATOR = "EVALUATOR"
    ADMIN = "ADMIN"

class DifficultyEnum(str, enum.Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"

class QuestionTypeEnum(str, enum.Enum):
    MCQ = "MCQ"
    DESCRIPTIVE = "DESCRIPTIVE"
    PRACTICAL = "PRACTICAL"
    VIVA = "VIVA"

class AssessmentTypeEnum(str, enum.Enum):
    MCQ = "MCQ"
    DESCRIPTIVE = "DESCRIPTIVE"
    PRACTICAL = "PRACTICAL"
    VIVA = "VIVA"
    MIXED = "MIXED"

class AssessmentModeEnum(str, enum.Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"
    BLENDED = "BLENDED"

class QuestionStatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    PENDING_REVIEW = "PENDING_REVIEW"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(SQLEnum(RoleEnum), default=RoleEnum.CANDIDATE)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Candidate(Base):
    __tablename__ = "candidates"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"), nullable=True)
    qualification_level = Column(String, nullable=True)
    user = relationship("User", backref="candidate_profile")

class AccessibilitySettings(Base):
    __tablename__ = "accessibility_settings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text_to_speech = Column(Boolean, default=False)
    speech_to_text = Column(Boolean, default=False)
    font_size = Column(String, default="Medium")
    high_contrast = Column(Boolean, default=False)
    extra_time_multiplier = Column(Float, default=1.0)

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    parent_skill_id = Column(Integer, ForeignKey("skills.id"), nullable=True)

class Assessment(Base):
    __tablename__ = "assessments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    type = Column(SQLEnum(AssessmentTypeEnum), default=AssessmentTypeEnum.MIXED)
    mode = Column(SQLEnum(AssessmentModeEnum), default=AssessmentModeEnum.ONLINE)
    duration = Column(Integer, default=60) # minutes
    total_marks = Column(Float, default=100.0)
    created_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text)
    type = Column(SQLEnum(QuestionTypeEnum))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    difficulty = Column(SQLEnum(DifficultyEnum))
    marks = Column(Float, default=1.0)
    expected_answer = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    status = Column(SQLEnum(QuestionStatusEnum), default=QuestionStatusEnum.DRAFT)
    created_by = Column(Integer, ForeignKey("users.id"))
    options = relationship("QuestionOption", backref="question", cascade="all, delete-orphan")

class QuestionOption(Base):
    __tablename__ = "question_options"
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"))
    text = Column(Text)
    is_correct = Column(Boolean, default=False)

class AssessmentQuestion(Base):
    __tablename__ = "assessment_questions"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))

class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True, index=True)
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    candidate_id = Column(Integer, ForeignKey("candidates.id"))
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=True)
    status = Column(String, default="IN_PROGRESS") # IN_PROGRESS, COMPLETED
    total_score = Column(Float, nullable=True)

class Answer(Base):
    __tablename__ = "answers"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    selected_option_id = Column(Integer, ForeignKey("question_options.id"), nullable=True)
    text_answer = Column(Text, nullable=True)
    score = Column(Float, nullable=True)
    ai_evaluation = Column(JSON, nullable=True)

class PracticalSubmission(Base):
    __tablename__ = "practical_submissions"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    code = Column(Text, nullable=True)
    output = Column(Text, nullable=True)
    score = Column(Float, nullable=True)

class VivaSession(Base):
    __tablename__ = "viva_sessions"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    transcript = Column(JSON, nullable=True)
    score = Column(Float, nullable=True)

class SkillScore(Base):
    __tablename__ = "skill_scores"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    skill_id = Column(Integer, ForeignKey("skills.id"))
    score_percentage = Column(Float)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("attempts.id"))
    overall_score = Column(Float)
    strengths = Column(Text)
    improvements = Column(Text)
    recommended_topics = Column(Text)
