from app.database.database import SessionLocal, engine, Base
from app.models.models import User, Candidate, RoleEnum, Course, Skill, Question, QuestionOption, QuestionTypeEnum, DifficultyEnum, Assessment, AssessmentTypeEnum, AssessmentModeEnum
from app.auth.security import get_password_hash

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin exists
    if db.query(User).filter(User.email == "admin@skillassess.local").first():
        print("Data already seeded.")
        return

    print("Seeding initial data...")
    
    # Users
    admin = User(name="Admin User", email="admin@skillassess.local", hashed_password=get_password_hash("password"), role=RoleEnum.ADMIN)
    evaluator = User(name="Evaluator User", email="evaluator@skillassess.local", hashed_password=get_password_hash("password"), role=RoleEnum.EVALUATOR)
    candidate_user = User(name="Candidate User", email="candidate@skillassess.local", hashed_password=get_password_hash("password"), role=RoleEnum.CANDIDATE)
    
    db.add_all([admin, evaluator, candidate_user])
    db.commit()
    
    candidate = Candidate(user_id=candidate_user.id)
    db.add(candidate)
    db.commit()
    
    # Course
    course = Course(name="Python Programming", description="Learn Python from scratch")
    db.add(course)
    db.commit()
    
    # Skills
    skills = ["Variables", "Conditions", "Loops", "Functions", "OOP", "File Handling"]
    skill_objs = []
    for s in skills:
        skill = Skill(name=s, description=f"{s} concepts")
        db.add(skill)
        skill_objs.append(skill)
    db.commit()
    
    # Questions
    q1 = Question(text="What is a loop in Python?", type=QuestionTypeEnum.MCQ, skill_id=skill_objs[2].id, difficulty=DifficultyEnum.EASY, created_by=evaluator.id)
    db.add(q1)
    db.commit()
    
    qo1 = QuestionOption(question_id=q1.id, text="A control flow statement for iterating", is_correct=True)
    qo2 = QuestionOption(question_id=q1.id, text="A data type", is_correct=False)
    db.add_all([qo1, qo2])
    db.commit()

    # Descriptive question
    q2 = Question(text="Explain inheritance in Python.", type=QuestionTypeEnum.DESCRIPTIVE, skill_id=skill_objs[4].id, difficulty=DifficultyEnum.MEDIUM, created_by=evaluator.id, expected_answer="Parent class, Child class, Reuse, Inheritance relationship, Example")
    db.add(q2)
    db.commit()
    
    # Assessment
    assessment = Assessment(title="Python Basics", description="Test your python basics", course_id=course.id, type=AssessmentTypeEnum.MIXED, mode=AssessmentModeEnum.ONLINE, created_by=evaluator.id)
    db.add(assessment)
    db.commit()
    
    print("Seeding completed successfully.")
    
if __name__ == "__main__":
    seed_data()
