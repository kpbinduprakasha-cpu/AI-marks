import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { LogOut, BookOpen, User, Settings, X, Trophy, Flame, Award } from 'lucide-react';

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

  const [showProfile, setShowProfile] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">SkillAssess AI</h1>
        </div>
        <nav className="mt-6 space-y-1 flex flex-col">
          <button className="flex items-center w-full px-6 py-3 text-left text-gray-700 bg-gray-100">
            <BookOpen className="w-5 h-5 mr-3" />
            Assessments
          </button>
          <button onClick={() => setShowProfile(true)} className="flex items-center w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50">
            <User className="w-5 h-5 mr-3" />
            Profile
          </button>
          <button onClick={() => setShowAccessibility(true)} className="flex items-center w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50">
            <Settings className="w-5 h-5 mr-3" />
            Accessibility
          </button>
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto flex space-x-8">
        
        {/* Left Side: Assessments */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 pb-4 border-b">
            <h2 className="text-2xl font-bold">Available Assessments</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {assessments.map(assessment => (
              <div key={assessment.id} className="p-6 bg-white rounded-lg shadow border">
                <h3 className="text-xl font-bold">{assessment.title}</h3>
                <p className="mt-2 text-gray-600">Duration: {assessment.duration} mins</p>
                <p className="mb-4 text-gray-600">Marks: {assessment.marks || assessment.total_marks}</p>
                <button 
                  onClick={() => navigate(`/assessment/${assessment.id}`)}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-bold"
                >
                  Start Assessment
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Gamification & Profile Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-6">
          <div className="flex items-center space-x-3 bg-white px-4 py-4 rounded-xl shadow border cursor-pointer hover:bg-gray-50 transition" onClick={() => setShowProfile(true)}>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight text-gray-800">Welcome K P Bindu 👋</p>
              <p className="text-sm text-gray-500 font-medium">Student • 1RV21CS001</p>
            </div>
          </div>

          {/* Gamification Stats */}
          <div className="flex justify-between bg-white rounded-xl shadow border p-4">
            <div className="text-center">
              <div className="flex justify-center items-center text-yellow-500 font-bold mb-1"><Award className="w-5 h-5 mr-1" /> XP</div>
              <span className="font-bold text-gray-800">30,539</span>
            </div>
            <div className="text-center border-l border-r px-4 border-gray-100">
              <div className="flex justify-center items-center text-orange-500 font-bold mb-1"><Flame className="w-5 h-5 mr-1" /> Streak</div>
              <span className="font-bold text-gray-800">39</span>
            </div>
            <div className="text-center">
              <div className="flex justify-center items-center text-yellow-600 font-bold mb-1"><Trophy className="w-5 h-5 mr-1" /> Rank</div>
              <span className="font-bold text-gray-800">#1</span>
            </div>
          </div>

          {/* Daily Tracker */}
          <div className="bg-white rounded-xl shadow border p-6">
            <h3 className="font-bold text-gray-800 mb-4">Monthly Tracker</h3>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {Array.from({length: 28}).map((_, i) => (
                <div key={i} className={`w-full aspect-square rounded ${i < 18 ? 'bg-green-500' : 'bg-gray-100'}`}></div>
              ))}
            </div>
            <div className="flex items-center text-xs text-gray-500 space-x-4">
              <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1.5"></div> Achieved</div>
              <div className="flex items-center"><div className="w-3 h-3 bg-gray-100 rounded mr-1.5"></div> Missed</div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-xl shadow border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">Leaderboard</h3>
              <button className="text-blue-600 text-sm font-semibold hover:underline" onClick={() => setShowLeaderboardModal(true)}>View All &rarr;</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'K P Bindu', xp: 575, rank: 1, color: 'bg-yellow-100 text-yellow-700' },
                { name: 'Leela Yaswanth', xp: 341, rank: 2, color: 'bg-gray-100 text-gray-700' },
                { name: 'Rajesh', xp: 330, rank: 3, color: 'bg-orange-100 text-orange-700' },
              ].map(student => (
                <div key={student.rank} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${student.color}`}>{student.rank}</div>
                    <span className="font-semibold text-gray-800 text-sm">{student.name}</span>
                  </div>
                  <span className="text-yellow-600 font-bold text-sm text-right flex items-center"><Award className="w-4 h-4 mr-1"/> {student.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Candidate Profile</h2>
              <button onClick={() => setShowProfile(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mb-2 border-2 border-gray-300">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <label className="cursor-pointer px-4 py-2 bg-gray-100 border text-sm font-semibold rounded hover:bg-gray-200">
                  Upload Image
                  <input type="file" className="hidden" accept="image/*" onChange={() => alert('Image selected! (Mock upload)')} />
                </label>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input type="text" defaultValue="John Doe" disabled className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input type="email" defaultValue="candidate@skillassess.local" disabled className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <button onClick={() => { setShowProfile(false); alert("Profile Image Updated Successfully!"); }} className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accessibility Modal */}
      {showAccessibility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Accessibility Settings</h2>
              <button onClick={() => setShowAccessibility(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="ml-3 font-semibold">Enable Screen Reader Mode</span>
              </label>
              <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="ml-3 font-semibold">High Contrast UI</span>
              </label>
              <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input type="checkbox" className="w-4 h-4 text-blue-600" />
                <span className="ml-3 font-semibold">Voice Dictation (Default ON)</span>
              </label>
              <button onClick={() => { setShowAccessibility(false); alert("Accessibility Settings Saved!"); }} className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 mt-4">
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Leaderboard Modal */}
      {showLeaderboardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center text-gray-800"><Trophy className="w-6 h-6 text-yellow-500 mr-2" /> Global Leaderboard</h2>
              <button onClick={() => setShowLeaderboardModal(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { name: 'K P Bindu', xp: 575, rank: 1, branch: 'CS', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { name: 'Leela Yaswanth', xp: 341, rank: 2, branch: 'IS', color: 'bg-gray-100 text-gray-700 border-gray-200' },
                { name: 'Rajesh', xp: 330, rank: 3, branch: 'EC', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                { name: 'Neha Sharma', xp: 290, rank: 4, branch: 'CS', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { name: 'Rahul Verma', xp: 250, rank: 5, branch: 'ME', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { name: 'Priya Patel', xp: 215, rank: 6, branch: 'EE', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { name: 'Arjun Singh', xp: 198, rank: 7, branch: 'CS', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                { name: 'Anjali Desai', xp: 180, rank: 8, branch: 'IS', color: 'bg-blue-50 text-blue-700 border-blue-100' },
              ].map(student => (
                <div key={student.rank} className={`flex justify-between items-center p-3 rounded-lg border ${student.color}`}>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold shadow-sm mr-4">{student.rank}</div>
                    <div>
                      <p className="font-bold text-gray-800">{student.name}</p>
                      <p className="text-xs font-medium opacity-80">{student.branch} Department</p>
                    </div>
                  </div>
                  <span className="font-bold text-lg flex items-center"><Award className="w-5 h-5 mr-1"/> {student.xp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
