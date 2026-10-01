import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { LogOut, BookOpen, User, Settings } from 'lucide-react';

export default function CandidateDashboard() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    // Read from shared localStorage mock database
    const saved = localStorage.getItem('mock_assessments');
    if (saved) {
      setAssessments(JSON.parse(saved));
    } else {
      setAssessments([
        { id: 1, title: 'Python Basics', duration: 60, marks: 100 }
      ]);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">SkillAssess AI</h1>
        </div>
        <nav className="mt-6 space-y-1">
          <Link to="" className="flex items-center px-6 py-3 text-gray-700 bg-gray-100">
            <BookOpen className="w-5 h-5 mr-3" />
            Assessments
          </Link>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <User className="w-5 h-5 mr-3" />
            Profile
          </a>
          <a href="#" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Settings className="w-5 h-5 mr-3" />
            Accessibility
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Available Assessments</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map(assessment => (
            <div key={assessment.id} className="p-6 bg-white rounded-lg shadow border">
              <h3 className="text-xl font-bold">{assessment.title}</h3>
              <p className="mt-2 text-gray-600">Duration: {assessment.duration} mins</p>
              <p className="mb-4 text-gray-600">Marks: {assessment.marks || assessment.total_marks}</p>
              <button 
                onClick={() => navigate(`/assessment/${assessment.id}`)}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Start Assessment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
