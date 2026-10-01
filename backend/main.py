from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine, Base
from app.routes import auth, courses, skills, assessments, questions, attempts, analytics

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SkillAssess AI API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(courses.router, prefix="/api/courses", tags=["Courses"])
app.include_router(skills.router, prefix="/api/skills", tags=["Skills"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["Assessments"])
app.include_router(questions.router, prefix="/api/questions", tags=["Questions"])
app.include_router(attempts.router, prefix="/api/attempts", tags=["Attempts"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["Analytics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to SkillAssess AI API"}
