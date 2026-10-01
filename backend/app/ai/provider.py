import requests
from typing import Dict, Any, List
import json
import logging

logger = logging.getLogger(__name__)

class AIProvider:
    def __init__(self, model: str = "llama3.1", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url

    def _generate(self, prompt: str, format="json") -> Dict[str, Any]:
        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "format": format,
                    "stream": False
                },
                timeout=30
            )
            response.raise_for_status()
            data = response.json()
            return json.loads(data.get("response", "{}"))
        except Exception as e:
            logger.error(f"AI Generation Error: {e}")
            return {"error": "AI unavailable", "details": str(e)}

    def evaluate_descriptive_answer(self, question: str, expected: str, answer: str) -> Dict[str, Any]:
        prompt = f"""
        You are an expert evaluator. Evaluate the student's answer based on the expected concepts.
        Question: {question}
        Expected concepts: {expected}
        Student answer: {answer}
        
        Provide the evaluation in JSON format with the following keys:
        - score: float (0 to 10)
        - concept_coverage: string describing what was covered
        - missing_concepts: list of strings
        - feedback: constructive feedback string
        - confidence: string ("HIGH", "MEDIUM", "LOW")
        
        Ensure output is strictly JSON.
        """
        return self._generate(prompt)

    def generate_question(self, course: str, skill: str, difficulty: str) -> Dict[str, Any]:
        prompt = f"""
        Generate a multiple choice question.
        Course: {course}
        Skill: {skill}
        Difficulty: {difficulty}
        
        Provide the output in JSON format:
        - text: the question text
        - options: list of 4 strings
        - correct_option_index: integer (0-3)
        - explanation: string explaining the answer
        
        Strictly JSON only.
        """
        return self._generate(prompt)
