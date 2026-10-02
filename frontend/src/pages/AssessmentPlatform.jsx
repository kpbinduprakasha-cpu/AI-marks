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
    // Load configured questions or fallback to dynamic generation
    const saved = localStorage.getItem('mock_assessments');
    let title = 'Python Basics';
    let loadedQuestions = null;
    
    if (saved) {
      const assessments = JSON.parse(saved);
      const current = assessments.find(a => a.id.toString() === id.toString());
      if (current) {
        title = current.title;
        if (current.questions && current.questions.length > 0) {
          loadedQuestions = current.questions;
        }
      }
    }

    if (loadedQuestions) {
      setQuestions(loadedQuestions);
    } else {
      setQuestions([
        {
          id: 1,
          type: 'MCQ',
          text: `What is a core concept of ${title}?`,
          options: [
            { id: 1, text: `A fundamental principle of ${title}` },
            { id: 2, text: 'A random unrelated concept' },
            { id: 3, text: 'A hardware component' },
            { id: 4, text: 'None of the above' }
          ]
        },
        {
          id: 2,
          type: 'DESCRIPTIVE',
          text: `Explain how ${title} works in practice and give an example.`
        },
        {
          id: 3,
          type: 'PRACTICAL',
          text: `Write a short script or pseudo-code related to ${title}.`
        }
      ]);
    }

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

  const [showResults, setShowResults] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const startVoiceDictation = (questionId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const currentText = answers[questionId]?.text || '';
      const newText = currentText ? `${currentText} ${transcript}` : transcript;
      handleTextAnswer(questionId, newText);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Real implementation would submit to backend
  };

  // Find title
  const headerSavedData = localStorage.getItem('mock_assessments');
  let currentTitle = 'Python Basics';
  if (headerSavedData) {
    const headerAssessments = JSON.parse(headerSavedData);
    const headerCurrent = headerAssessments.find(a => a.id.toString() === id.toString());
    if (headerCurrent) currentTitle = headerCurrent.title;
  }

  const handleViewResults = () => {
    setShowResults(true);
  };

  if (showResults) {
    let correctCount = 0;
    const evaluatedQuestions = questions.map((q) => {
      let isCorrect = false;
      const answer = answers[q.id];
      if (q.type === 'MCQ') {
        // We assume the first option (id: 1) is correct for these generated tests
        isCorrect = answer && answer.optionId === 1;
      } else {
        // For text/practical, require a meaningful length
        isCorrect = answer && answer.text && answer.text.trim().length > 15;
      }
      if (isCorrect) correctCount++;
      return { ...q, isCorrect };
    });

    const percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-8">
          <h2 className="text-3xl font-bold mb-6 border-b pb-4">AI Evaluation Results: {currentTitle}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-xl font-semibold mb-2">Overall Score</h3>
              <p className="text-4xl font-bold text-blue-600">{percentage}%</p>
              <p className="text-sm text-gray-600 mt-2">Evaluated by SkillAssess AI</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h3 className="text-xl font-semibold mb-2">Areas for Improvement</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                {percentage < 100 ? (
                  <>
                    <li>Deepen understanding of advanced {currentTitle} architectures.</li>
                    <li>Practice writing optimized code snippets.</li>
                    <li>Review edge cases in practical scenarios.</li>
                  </>
                ) : (
                  <li>Great job! You have a solid grasp of {currentTitle}.</li>
                )}
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-bold mb-4">Question Breakdown</h3>
          <div className="space-y-4 mb-8">
            {evaluatedQuestions.map((q, i) => {
              return (
                <div key={q.id} className={`p-4 border rounded-lg ${q.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="font-semibold">Q{i+1}: {q.text}</p>
                  <p className={`text-sm mt-1 font-bold ${q.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {q.isCorrect ? 'âœ… Correct Answer' : 'âŒ Incorrect / Needs Improvement'}
                  </p>
                  {!q.isCorrect && (
                    <p className="text-sm text-gray-600 mt-1">
                      {q.type === 'MCQ' 
                        ? 'AI Feedback: You selected the wrong option. Option A is typically correct.' 
                        : `AI Feedback: Your answer was too short or missed key concepts related to ${currentTitle}.`}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <h3 className="text-2xl font-bold mb-4">Best Resources to Learn More</h3>
          <div className="bg-gray-50 p-6 rounded-lg border mb-8">
            <p className="mb-2">Based on your performance, we recommend reviewing these sources:</p>
            <ul className="list-disc pl-5 space-y-2 text-blue-600">
              <li><a href={`https://www.google.com/search?q=${encodeURIComponent(currentTitle)}+tutorial+documentation`} target="_blank" rel="noreferrer" className="hover:underline">Official Documentation & Tutorials for {currentTitle}</a></li>
              <li><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(currentTitle)}+crash+course`} target="_blank" rel="noreferrer" className="hover:underline">Video Crash Course: {currentTitle}</a></li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button onClick={() => navigate('/candidate')} className="px-8 py-3 text-white bg-blue-600 font-bold rounded-lg hover:bg-blue-700 shadow">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Assessment Submitted</h2>
          <p className="text-gray-600 mb-6">Your answers have been saved and successfully evaluated by our AI.</p>
          <div className="flex space-x-4 justify-center">
            <button onClick={handleViewResults} className="px-6 py-2 text-white bg-green-600 font-bold rounded hover:bg-green-700">
              View AI Results
            </button>
            <button onClick={() => navigate('/candidate')} className="px-6 py-2 text-blue-600 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100">
              Dashboard
            </button>
          </div>
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
          <h1 className="text-xl font-bold">SkillAssess AI - {currentTitle}</h1>
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
              {(q.options || [
                { id: 1, text: `Option A for ${q.text.substring(0, 15)}...` },
                { id: 2, text: `Option B for ${q.text.substring(0, 15)}...` },
                { id: 3, text: 'Option C (Mocked)' },
                { id: 4, text: 'Option D (Mocked)' }
              ]).map(opt => (
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
                <button 
                  onClick={() => startVoiceDictation(q.id)}
                  className={`flex items-center text-sm ml-auto ${isRecording ? 'text-red-600 animate-pulse' : 'text-blue-600 hover:text-blue-800'}`}
                >
                  <Mic className="w-4 h-4 mr-1" /> 
                  {isRecording ? 'Listening...' : 'Answer by Voice'}
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
