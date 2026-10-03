import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { LogOut, BookOpen, User, Settings, X, Trophy, Flame, Award, Database, Layout, Terminal, Code, Monitor, Download, Linkedin, Share2 } from 'lucide-react';

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
        { id: 1, title: 'Python Basics', duration: 60, marks: 100, status: 'HOSTED' }
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
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [badgesFilter, setBadgesFilter] = useState('All');
  const [activeGamificationTab, setActiveGamificationTab] = useState('monthly');
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('studentProfile');
    if (saved) return JSON.parse(saved);
    return { name: 'K P Binduprakasha', email: 'candidate@skillassess.local', usn: '1RV21CS001' };
  });

  // Listen for storage changes if updated from another tab
  useEffect(() => {
    const handleStorage = () => {
      const saved = localStorage.getItem('studentProfile');
      if (saved) setProfile(JSON.parse(saved));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
            {assessments.filter(a => a.status === 'HOSTED').length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-lg shadow border border-gray-200">
                <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-bold text-gray-700">No Assessments Available</h3>
                <p className="text-gray-500">Your evaluator has not hosted any assessments yet. Please check back later.</p>
              </div>
            ) : (
              assessments.filter(a => a.status === 'HOSTED').map(assessment => (
                <div key={assessment.id} className="p-6 bg-white rounded-lg shadow border relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">LIVE</div>
                  <h3 className="text-xl font-bold pr-12">{assessment.title}</h3>
                  <p className="mt-2 text-gray-600">Duration: {assessment.duration} mins</p>
                  <p className="mb-4 text-gray-600">Marks: {assessment.marks || assessment.total_marks}</p>
                  <button 
                    onClick={() => navigate(`/assessment/${assessment.id}`)}
                    className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-bold shadow-sm"
                  >
                    Start Assessment
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Gamification & Profile Sidebar */}
        <div className="w-80 flex-shrink-0 space-y-6">
          <div className="flex items-center space-x-3 bg-white px-4 py-4 rounded-xl shadow border cursor-pointer hover:bg-gray-50 transition" onClick={() => setShowProfile(true)}>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-blue-200">
              <User className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight text-gray-800">Welcome {profile.name} 👋</p>
              <p className="text-sm text-gray-500 font-medium">Student • {profile.usn}</p>
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
          {/* Gamification Tabs */}
          <div className="bg-white rounded-xl shadow border overflow-hidden">
            <div className="flex border-b bg-gray-50 p-2 space-x-2">
              <button onClick={() => setActiveGamificationTab('monthly')} className={`flex-1 py-2 px-1 text-sm font-semibold rounded-md ${activeGamificationTab === 'monthly' ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Monthly Tracker</button>
              <button onClick={() => setActiveGamificationTab('leaderboard')} className={`flex-1 py-2 px-1 text-sm font-semibold rounded-md ${activeGamificationTab === 'leaderboard' ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Leaderboard</button>
              <button onClick={() => setActiveGamificationTab('badges')} className={`flex-1 py-2 px-1 text-sm font-semibold rounded-md ${activeGamificationTab === 'badges' ? 'bg-white shadow border border-gray-200 text-gray-800' : 'text-gray-600 hover:bg-gray-100'}`}>Badges</button>
            </div>
            
            <div className="p-6">
              {activeGamificationTab === 'monthly' && (
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-800 flex items-center">Oct 2026 <span className="ml-2 text-gray-400 cursor-pointer hover:text-gray-600">&lt; &gt;</span></h3>
                     <select className="border rounded px-3 py-1 text-sm font-semibold bg-white text-gray-700 outline-none"><option>Daily</option></select>
                   </div>
                   <div className="grid grid-cols-10 gap-1.5 mb-6">
                      {Array.from({length: 31}).map((_, i) => (
                        <div key={i} className={`w-full aspect-square rounded flex flex-col items-center justify-end pb-1 ${i < 3 ? 'bg-green-500' : 'border-[1.5px] border-gray-200 bg-white'}`}>
                          {i === 2 && <div className="w-0 h-0 border-l-[3px] border-r-[3px] border-b-[4px] border-transparent border-b-blue-600 transform translate-y-2"></div>}
                        </div>
                      ))}
                   </div>
                   <div className="flex flex-wrap items-center text-xs text-gray-600 gap-x-4 gap-y-2 border-t pt-4 font-medium">
                      <div className="flex items-center"><div className="w-3 h-3 border-[1.5px] border-gray-200 rounded mr-1.5 bg-gray-50"></div> Missed</div>
                      <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1.5"></div> Achieved</div>
                      <div className="flex items-center"><div className="w-3 h-3 border border-red-200 bg-white rounded flex items-center justify-center mr-1.5"><div className="w-4 border-t border-red-400 transform rotate-45"></div></div> Holiday</div>
                      <div className="flex items-center"><div className="w-3 h-3 border border-gray-400 rounded flex items-center justify-center mr-1.5"><span className="text-[6px] font-bold text-gray-500">II</span></div> Paused</div>
                      <div className="flex items-center"><Flame className="w-3.5 h-3.5 text-blue-500 mr-1.5" /> Freeze</div>
                   </div>
                </div>
              )}

              {activeGamificationTab === 'leaderboard' && (
                <div>
                   <div className="flex justify-between items-center mb-6">
                     <div className="flex items-center">
                       <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3 border border-blue-200"><Trophy className="w-5 h-5 text-blue-500" /></div>
                       <div>
                         <p className="font-bold text-gray-800 text-sm">Sapphire League</p>
                         <p className="text-xs text-gray-500 font-medium">Oct 2026</p>
                       </div>
                     </div>
                     <button className="text-blue-600 text-sm font-semibold hover:underline" onClick={() => setShowLeaderboardModal(true)}>View &rarr;</button>
                   </div>
                   <div className="space-y-3">
                      {[
                        { name: 'Abhiraj', xp: 980, rank: 2, color: 'text-gray-800' },
                        { name: profile.name, xp: 944, rank: 3, color: 'text-gray-800', isMe: true },
                        { name: 'Rajesh', xp: 655, rank: 4, color: 'text-gray-800' },
                      ].map(student => (
                        <div key={student.rank} className={`flex justify-between items-center p-2 rounded-lg ${student.isMe ? 'border border-gray-200 shadow-sm bg-white' : ''}`}>
                          <div className="flex items-center">
                            <span className="w-6 text-center font-bold text-gray-800 text-sm mr-2">{student.rank}</span>
                            <div className="w-8 h-8 rounded-full bg-indigo-400 mr-3 text-white flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-semibold text-gray-800 text-sm">{student.name}</span>
                          </div>
                          <span className="text-yellow-500 font-bold text-sm flex items-center bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100">
                            <Award className="w-3.5 h-3.5 mr-1 text-yellow-600"/> {student.xp}
                          </span>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {activeGamificationTab === 'badges' && (
                <div>
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="font-bold text-gray-800">Badges</h3>
                     <button className="text-blue-600 text-sm font-semibold hover:underline" onClick={() => setShowBadgesModal(true)}>View All &rarr;</button>
                   </div>
                   <div className="grid grid-cols-3 gap-y-6 gap-x-2 text-center">
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-blue-50 border-2 border-blue-300 rounded-xl flex items-center justify-center mb-2 relative transform rotate-3 hover:scale-105 transition">
                           <Trophy className="w-6 h-6 text-yellow-500" />
                           <div className="absolute -bottom-2 bg-blue-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">#5</div>
                         </div>
                         <p className="text-[10px] text-gray-700 font-semibold leading-tight truncate w-full">Sapphire Challen...</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-indigo-50 border-2 border-indigo-400 rounded-xl flex items-center justify-center mb-2 relative transform hover:scale-105 transition">
                           <span className="text-indigo-600 font-bold text-sm">&lt;/&gt;</span>
                           <div className="absolute -bottom-2 bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">100</div>
                         </div>
                         <p className="text-[10px] text-gray-700 font-semibold leading-tight truncate w-full">Algorithm Enthu...</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-yellow-50 border-2 border-yellow-400 rounded-xl flex items-center justify-center mb-2 relative transform -rotate-3 hover:scale-105 transition">
                           <span className="text-yellow-700 font-bold text-[10px]">XP</span>
                           <div className="absolute -bottom-2 bg-yellow-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full border border-white">30000</div>
                         </div>
                         <p className="text-[10px] text-gray-700 font-semibold leading-tight truncate w-full">XP Titan</p>
                      </div>
                      <div className="flex flex-col items-center">
                         <div className="w-12 h-12 bg-orange-50 border-2 border-orange-400 rounded-xl flex items-center justify-center mb-2 relative transform rotate-6 hover:scale-105 transition">
                           <Flame className="w-5 h-5 text-orange-500" />
                           <div className="absolute -bottom-2 bg-orange-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">50</div>
                         </div>
                         <p className="text-[10px] text-gray-700 font-semibold leading-tight truncate w-full">Streak - 50 Days</p>
                      </div>
                      <div className="flex flex-col items-center opacity-60">
                         <div className="w-12 h-12 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center justify-center mb-2 relative grayscale">
                           <Trophy className="w-5 h-5 text-gray-500" />
                           <div className="absolute -bottom-2 -right-2 bg-gray-600 text-white text-[8px] font-bold px-1 py-0.5 rounded border border-white shadow">ðŸ”’</div>
                         </div>
                         <p className="text-[10px] text-gray-600 font-semibold leading-tight truncate w-full">Iron Champion</p>
                      </div>
                      <div className="flex flex-col items-center opacity-60">
                         <div className="w-12 h-12 bg-gray-50 border-2 border-gray-300 rounded-xl flex items-center justify-center mb-2 relative grayscale">
                           <span className="font-bold text-gray-500">5</span>
                           <div className="absolute -bottom-2 -right-2 bg-gray-600 text-white text-[8px] font-bold px-1 py-0.5 rounded border border-white shadow">ðŸ”’</div>
                         </div>
                         <p className="text-[10px] text-gray-600 font-semibold leading-tight truncate w-full">HTML Master</p>
                      </div>
                   </div>
                </div>
              )}
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
                <input type="text" value={profile.name} disabled className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input type="email" value={profile.email} disabled className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
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
                { name: profile.name, xp: 575, rank: 1, branch: 'CS', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
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
      {/* Badges Full Screen Modal */}
      {showBadgesModal && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <button onClick={() => setShowBadgesModal(false)} className="text-gray-500 hover:text-gray-800 flex items-center font-semibold">
                  &larr; Back
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Badges</h1>
              </div>
              <div className="flex items-center space-x-2 bg-gray-50 rounded-full border p-1 shadow-sm">
                <span className="text-sm font-semibold text-gray-500 px-3">Filter</span>
                <button 
                  onClick={() => setBadgesFilter('All')} 
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${badgesFilter === 'All' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-600 hover:bg-gray-100'}`}>All</button>
                <button 
                  onClick={() => setBadgesFilter('Collected')} 
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${badgesFilter === 'Collected' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'text-gray-600 hover:bg-gray-100'}`}>Collected</button>
              </div>
            </div>

            <div className="space-y-12 pb-12">
              {/* Leaderboard Category */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Leaderboard</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {[
                    { title: 'Bronze Master', sub: 'Rank - 2', icon: Trophy, bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600', val: '#2', collected: true },
                    { title: 'Bronze Prodigy', sub: 'Rank - 3', icon: Trophy, bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600', val: '#3', collected: true },
                    { title: 'Bronze Achiever', sub: 'Rank - 4', icon: Trophy, bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-600', val: '#4', collected: true },
                    { title: 'Silver Master', sub: 'Rank - 2', icon: Trophy, bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-600', val: '#2', collected: false },
                    { title: 'Silver Prodigy', sub: 'Rank - 3', icon: Trophy, bg: 'bg-gray-200', border: 'border-gray-300', text: 'text-gray-600', val: '#3', collected: false },
                    { title: 'Gold Master', sub: 'Rank - 2', icon: Trophy, bg: 'bg-yellow-200', border: 'border-yellow-400', text: 'text-yellow-700', val: '#2', collected: false },
                    { title: 'Platinum Champ', sub: 'Rank - 1', icon: Trophy, bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-500', val: '#1', collected: false },
                  ].filter(b => badgesFilter === 'All' || b.collected).map((badge, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => badge.collected && setSelectedBadge(badge)}
                      className={`flex-shrink-0 w-32 border rounded-xl p-4 flex flex-col items-center transition-transform ${badge.collected ? 'border-gray-200 bg-white shadow-sm cursor-pointer hover:scale-105' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-14 h-14 ${badge.bg} border-2 ${badge.border} rounded-xl flex items-center justify-center mb-3 relative`}>
                        <badge.icon className={`w-6 h-6 ${badge.text}`} />
                        <div className={`absolute -bottom-2 ${badge.bg} ${badge.text} text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white`}>{badge.val}</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 text-center leading-tight">{badge.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Problem Solved Category */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Problem Solved</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {[
                    { title: 'Problem Solver', sub: '10 problems', val: '10', collected: true },
                    { title: 'Logic Builder', sub: '30 problems', val: '30', collected: true },
                    { title: 'Code Challenger', sub: '50 problems', val: '50', collected: true },
                    { title: 'Algorithm Enthu...', sub: '100 problems', val: '100', collected: true },
                    { title: 'Bug Buster', sub: '150 problems', val: '150', collected: false },
                    { title: 'Coding Prodigy', sub: '200 problems', val: '200', collected: false },
                    { title: 'Solution Master', sub: '250 problems', val: '250', collected: false },
                  ].filter(b => badgesFilter === 'All' || b.collected).map((badge, idx) => (
                    <div key={idx} onClick={() => badge.collected && setSelectedBadge(badge)} className={`flex-shrink-0 w-32 border rounded-xl p-4 flex flex-col items-center transition-transform ${badge.collected ? 'border-indigo-100 bg-indigo-50 shadow-sm cursor-pointer hover:scale-105' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-14 h-14 bg-indigo-100 border-2 border-indigo-300 rounded-xl flex items-center justify-center mb-3 relative`}>
                        <span className="text-indigo-600 font-bold text-sm">&lt;/&gt;</span>
                        <div className={`absolute -bottom-2 bg-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white`}>{badge.val}</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 text-center leading-tight">{badge.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Progress Category */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Skill Progress</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {[
                    { title: 'HTML Master', sub: 'Completed', icon: Monitor, bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', val: 'HTML', collected: false },
                    { title: 'Bootstrap Pro', sub: 'Completed', icon: Layout, bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', val: 'B', collected: false },
                    { title: 'SQL Data Explorer', sub: 'Completed', icon: Database, bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', val: 'SQL', collected: false },
                    { title: 'Python Program...', sub: 'Completed', icon: Terminal, bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', val: 'PY', collected: false },
                    { title: 'JavaScript Devel...', sub: 'Completed', icon: Code, bg: 'bg-gray-100', border: 'border-gray-400', text: 'text-gray-700', val: 'JS', collected: false },
                  ].filter(b => badgesFilter === 'All' || b.collected).map((badge, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => badge.collected && setSelectedBadge(badge)}
                      className={`flex-shrink-0 w-32 border rounded-xl p-4 flex flex-col items-center transition-transform ${badge.collected ? 'border-indigo-100 bg-indigo-50 shadow-sm cursor-pointer hover:scale-105' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-14 h-14 ${badge.bg} border-2 ${badge.border} rounded-xl flex items-center justify-center mb-3 relative`}>
                        <badge.icon className={`w-5 h-5 ${badge.text} mb-1`} />
                        <div className={`absolute -bottom-2 bg-gray-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white`}>{badge.val}</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 text-center leading-tight">{badge.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total XP Category */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Total XP</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {[
                    { title: 'XP Explorer', sub: 'Earn 500 XP', val: '500', collected: true },
                    { title: 'XP Challenger', sub: 'Earn 1000 XP', val: '1000', collected: true },
                    { title: 'XP Achiever', sub: 'Earn 2500 XP', val: '2500', collected: true },
                    { title: 'XP Master', sub: 'Earn 5000 XP', val: '5000', collected: true },
                    { title: 'XP Prodigy', sub: 'Earn 8000 XP', val: '8000', collected: false },
                    { title: 'XP Elite', sub: 'Earn 10000 XP', val: '10000', collected: false },
                    { title: 'XP Champion', sub: 'Earn 12000 XP', val: '12000', collected: false },
                  ].filter(b => badgesFilter === 'All' || b.collected).map((badge, idx) => (
                    <div key={idx} onClick={() => badge.collected && setSelectedBadge(badge)} className={`flex-shrink-0 w-32 border rounded-xl p-4 flex flex-col items-center transition-transform ${badge.collected ? 'border-yellow-200 bg-yellow-50 shadow-sm cursor-pointer hover:scale-105' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-14 h-14 bg-yellow-100 border-2 border-yellow-400 rounded-xl flex items-center justify-center mb-3 relative`}>
                        <span className="text-yellow-700 font-bold text-[10px]">XP</span>
                        <div className={`absolute -bottom-2 bg-yellow-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white`}>{badge.val}</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 text-center leading-tight">{badge.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Streak Category */}
              <div>
                <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Streak</h2>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {[
                    { title: 'Streak - 3 Days', sub: '3-day streak', val: '3', collected: true },
                    { title: 'Streak - 7 Days', sub: '7-day streak', val: '7', collected: true },
                    { title: 'Streak - 14 Days', sub: '14-day streak', val: '14', collected: true },
                    { title: 'Streak - 30 Days', sub: '30-day streak', val: '30', collected: true },
                    { title: 'Streak - 50 Days', sub: '50-day streak', val: '50', collected: false },
                    { title: 'Streak - 75 Days', sub: '75-day streak', val: '75', collected: false },
                    { title: 'Streak - 100 Days', sub: '100-day streak', val: '100', collected: false },
                  ].filter(b => badgesFilter === 'All' || b.collected).map((badge, idx) => (
                    <div key={idx} onClick={() => badge.collected && setSelectedBadge(badge)} className={`flex-shrink-0 w-32 border rounded-xl p-4 flex flex-col items-center transition-transform ${badge.collected ? 'border-orange-200 bg-orange-50 shadow-sm cursor-pointer hover:scale-105' : 'border-gray-100 bg-gray-50 opacity-60 grayscale'}`}>
                      <div className={`w-14 h-14 bg-orange-100 border-2 border-orange-400 rounded-xl flex items-center justify-center mb-3 relative`}>
                        <Flame className="w-6 h-6 text-orange-500" />
                        <div className={`absolute -bottom-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white`}>{badge.val}</div>
                      </div>
                      <p className="text-xs font-bold text-gray-800 text-center leading-tight">{badge.title}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{badge.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
      {/* Selected Badge Detailed Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl p-8" style={{ background: 'linear-gradient(135deg, #2b005e 0%, #1a0033 100%)' }}>
            <button onClick={() => setSelectedBadge(null)} className="absolute top-4 right-4 text-white hover:text-gray-300">
              <X className="w-6 h-6" />
            </button>
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 2px, transparent 2.5px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Floating Badge Icon */}
              <div className={`w-28 h-28 ${selectedBadge.bg || 'bg-indigo-100'} border-4 ${selectedBadge.border || 'border-indigo-300'} rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,255,255,0.2)] transform -rotate-3`}>
                {selectedBadge.icon ? (
                  <selectedBadge.icon className={`w-12 h-12 ${selectedBadge.text || 'text-indigo-600'}`} />
                ) : (
                  <span className={`font-bold text-2xl ${selectedBadge.text || 'text-indigo-600'}`}>
                    {selectedBadge.val === 'XP' ? 'XP' : '< />'}
                  </span>
                )}
                <div className={`absolute -bottom-3 ${selectedBadge.bg || 'bg-indigo-500'} text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-lg`}>
                  {selectedBadge.val}
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-3xl font-extrabold text-yellow-400 mb-4 leading-tight">{selectedBadge.title}</h2>
              <p className="text-white font-medium text-sm mb-8 px-4 opacity-90">
                You have earned a badge for solving {selectedBadge.val} problems or collecting this milestone!
              </p>

              {/* User Pill */}
              <div className="bg-black bg-opacity-40 border border-white border-opacity-10 rounded-full py-2 px-4 flex items-center mb-8">
                <div className="w-8 h-8 rounded-full bg-blue-100 mr-3 overflow-hidden border border-gray-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <span className="text-white font-bold text-sm pr-2">{profile.name}</span>
              </div>
            </div>

            {/* Footer / Share */}
            <div className="relative z-10 text-center border-t border-white border-opacity-10 pt-6 mt-2 bg-white bg-opacity-[0.02] -mx-8 -mb-8 pb-8">
              <p className="text-xs text-gray-400 font-semibold mb-4 uppercase tracking-wider">Share your progress</p>
              <div className="flex justify-center space-x-6">
                <button className="text-gray-300 hover:text-white transition"><X className="w-6 h-6" /></button>
                <button className="text-gray-300 hover:text-blue-400 transition"><Linkedin className="w-6 h-6" /></button>
                <button className="text-gray-300 hover:text-white transition"><Download className="w-6 h-6" /></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
