import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Volume2, Mic } from 'lucide-react';

export default function AssessmentPlatform() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Mock fetch questions for assessment
    setQuestions([
      {
        id: 1,
        type: 'MCQ',
        text: 'What is a loop in Python?',
        options: [
          { id: 1, text: 'A control flow statement for iterating' },
          { id: 2, text: 'A data type' },
          { id: 3, text: 'A function definition' },
          { id: 4, text: 'None of the above' }
        ]
      },
      {
        id: 2,
        type: 'DESCRIPTIVE',
        text: 'Explain inheritance in Python.'
      },
      {
        id: 3,
        type: 'PRACTICAL',
        text: 'Write a Python program to check whether a number is prime.'
      }
    ]);

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [id]);

  const handleOptionSelect = (questionId, optionId) => {
    setAnswers(prev => ({ ...prev, [questionId]: { optionId } }));
  };

  const handleTextAnswer = (questionId, text) => {
    setAnswers(prev => ({ ...prev, [questionId]: { text } }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Real implementation would submit to backend
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Assessment Submitted</h2>
          <p className="text-gray-600 mb-6">Your answers have been saved and sent for AI Evaluation.</p>
          <button onClick={() => navigate('/candidate')} className="px-6 py-2 text-white bg-blue-600 rounded">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return <div className="p-8">Loading...</div>;

  const q = questions[currentIndex];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div>
          <h1 className="text-xl font-bold">SkillAssess AI - Python Basics</h1>
          <p className="text-sm text-gray-500">Question {currentIndex + 1} of {questions.length}</p>
        </div>
        <div className="text-xl font-mono font-bold text-red-600">
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </header>

      <main className="flex-1 p-8 overflow-y-auto max-w-4xl mx-auto w-full">
        <div className="p-8 bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex items-start justify-between mb-6">
            <h2 className="text-xl">{q.text}</h2>
            <button 
              onClick={() => speakText(q.text)}
              className="p-2 text-blue-600 rounded-full hover:bg-blue-50"
              title="Listen to question"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          {q.type === 'MCQ' && (
            <div className="space-y-3">
              {q.options.map(opt => (
                <label key={opt.id} className="flex items-center p-4 border rounded cursor-pointer hover:bg-gray-50">
                  <input 
                    type="radio" 
                    name={`q-${q.id}`} 
                    checked={answers[q.id]?.optionId === opt.id}
                    onChange={() => handleOptionSelect(q.id, opt.id)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3">{opt.text}</span>
                </label>
              ))}
            </div>
          )}

          {q.type === 'DESCRIPTIVE' && (
            <div>
              <textarea 
                className="w-full p-4 border rounded focus:ring-2 focus:ring-blue-500"
                rows="6"
                placeholder="Type your answer here..."
                value={answers[q.id]?.text || ''}
                onChange={(e) => handleTextAnswer(q.id, e.target.value)}
              />
              <div className="mt-2 text-right">
                <button className="flex items-center text-sm text-blue-600 hover:text-blue-800 ml-auto">
                  <Mic className="w-4 h-4 mr-1" /> Answer by Voice
                </button>
              </div>
            </div>
          )}

          {q.type === 'PRACTICAL' && (
            <div>
              <textarea 
                className="w-full p-4 font-mono border rounded bg-gray-900 text-green-400 focus:ring-2 focus:ring-blue-500"
                rows="10"
                placeholder="# Write your python code here"
                value={answers[q.id]?.text || ''}
                onChange={(e) => handleTextAnswer(q.id, e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button 
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="px-6 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button 
              onClick={handleSubmit}
              className="px-6 py-2 font-bold text-white bg-green-600 rounded hover:bg-green-700"
            >
              Submit Assessment
            </button>
          ) : (
            <button 
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
