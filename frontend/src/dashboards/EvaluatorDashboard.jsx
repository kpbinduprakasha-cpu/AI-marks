import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, BookOpen, BarChart2, User as UserIcon, X, Plus, Sparkles, Trash2, Edit3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function EvaluatorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analytics, setAnalytics] = useState(null);
  const [profile, setProfile] = useState(null);
  
  // Persist Assessments in LocalStorage to share with Candidate View and survive unmounts
  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('mock_assessments');
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, title: 'Python Basics', type: 'MIXED', mode: 'ONLINE', duration: 60, marks: 100 },
      { id: 2, title: 'Data Science Fundamentals', type: 'MCQ', mode: 'ONLINE', duration: 45, marks: 50 },
      { id: 3, title: 'Web Development Practical', type: 'PRACTICAL', mode: 'BLENDED', duration: 120, marks: 200 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('mock_assessments', JSON.stringify(assessments));
  }, [assessments]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [managingAssessment, setManagingAssessment] = useState(null);
  
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [showAIGenerateModal, setShowAIGenerateModal] = useState(false);
  const [showEditQuestionModal, setShowEditQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [viewingCandidate, setViewingCandidate] = useState(null);
  
  // Profile Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Mock questions state
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ text: '', type: 'MCQ', marks: 5 });

  // Form state
  const [newAssessment, setNewAssessment] = useState({
    title: '', type: 'MCQ', mode: 'ONLINE', duration: 60, marks: 100
  });

  useEffect(() => {
    setAnalytics({
      total_candidates: 120,
      total_assessments: 5,
      average_score: 75.5,
      chartData: [
        { name: 'Python Basics', score: 82 },
        { name: 'Data Science', score: 65 },
        { name: 'Web Dev', score: 78 }
      ]
    });

    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (err) {}
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const handleCreateAssessment = (e) => {
    e.preventDefault();
    const created = { ...newAssessment, id: Date.now() };
    setAssessments([...assessments, created]);
    setShowCreateModal(false);
    setNewAssessment({ title: '', type: 'MCQ', mode: 'ONLINE', duration: 60, marks: 100 });
  };
  
  const handleAddQuestion = (e) => {
    e.preventDefault();
    setQuestions([...questions, { ...newQuestion, id: Date.now() }]);
    setShowAddQuestionModal(false);
    setNewQuestion({ text: '', type: 'MCQ', marks: 5 });
  };
  
  // AI Config state
  const [aiQuestionCount, setAiQuestionCount] = useState(5);

  const handleAIGenerate = () => {
    const topic = managingAssessment?.title || "General Topic";
    
    // Some simple templates to ensure we don't repeat easily and match the topic
    const templates = [
      { text: `Explain the core principles of ${topic}.`, type: 'DESCRIPTIVE', marks: 10 },
      { text: `What is the primary advantage of using ${topic} in modern development?`, type: 'MCQ', marks: 5 },
      { text: `Write a small snippet demonstrating a loop in ${topic}.`, type: 'PRACTICAL', marks: 20 },
      { text: `How does memory management work in ${topic}?`, type: 'DESCRIPTIVE', marks: 10 },
      { text: `Which of the following is considered best practice when working with ${topic}?`, type: 'MCQ', marks: 5 },
      { text: `Describe the difference between abstraction and encapsulation in the context of ${topic}.`, type: 'DESCRIPTIVE', marks: 10 },
      { text: `How do you handle exceptions or errors in ${topic}?`, type: 'PRACTICAL', marks: 15 },
      { text: `What is the default visibility scope in ${topic}?`, type: 'MCQ', marks: 5 },
      { text: `Explain how multithreading or concurrency is achieved in ${topic}.`, type: 'DESCRIPTIVE', marks: 10 },
      { text: `Which tool is most commonly used for dependency management in ${topic}?`, type: 'MCQ', marks: 5 }
    ];

    const generated = [];
    // Generate as many questions as requested, appending a variant ID if we exceed templates
    for (let i = 0; i < aiQuestionCount; i++) {
      const templateIndex = i % templates.length;
      const baseQ = templates[templateIndex];
      const variantText = i >= templates.length ? ` (Variant ${Math.floor(i / templates.length) + 1})` : '';
      
      generated.push({
        id: Date.now() + i,
        text: baseQ.text + variantText,
        type: baseQ.type,
        marks: baseQ.marks
      });
    }

    setQuestions([...questions, ...generated]);
    setShowAIGenerateModal(false);
  };
  
  const handleDeleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const handleSaveEditQuestion = (e) => {
    e.preventDefault();
    setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setShowEditQuestionModal(false);
    setEditingQuestion(null);
  };
  
  const handleEditProfile = (e) => {
    e.preventDefault();
    setShowEditProfile(false);
    alert('Profile updated successfully! (Mock)');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setShowChangePassword(false);
    alert('Password changed successfully! (Mock)');
  };

  const handleManageAssessment = (assessment) => {
    setManagingAssessment(assessment);
    setQuestions(assessment.questions || []);
  };

  const handleSaveAssessment = () => {
    setAssessments(assessments.map(a => a.id === managingAssessment.id ? { ...a, questions } : a));
    setManagingAssessment(null);
    alert('Assessment Questions Saved successfully! (Mock)');
  };

  const navItemClass = (tabName) => 
    `flex items-center w-full px-6 py-3 text-left ${activeTab === tabName ? 'text-blue-700 bg-blue-50 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r relative z-10">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">SkillAssess AI</h1>
          <p className="text-sm text-gray-500">Evaluator Portal</p>
        </div>
        <nav className="mt-6 space-y-1">
          <button onClick={() => { setActiveTab('dashboard'); setManagingAssessment(null); setViewingCandidate(null); }} className={navItemClass('dashboard')}>
            <BarChart2 className="w-5 h-5 mr-3" /> Dashboard
          </button>
          <button onClick={() => { setActiveTab('candidates'); setManagingAssessment(null); setViewingCandidate(null); }} className={navItemClass('candidates')}>
            <Users className="w-5 h-5 mr-3" /> Candidates
          </button>
          <button onClick={() => { setActiveTab('assessments'); setManagingAssessment(null); setViewingCandidate(null); }} className={navItemClass('assessments')}>
            <BookOpen className="w-5 h-5 mr-3" /> Assessments
          </button>
          <button onClick={() => { setActiveTab('profile'); setManagingAssessment(null); setViewingCandidate(null); }} className={navItemClass('profile')}>
            <UserIcon className="w-5 h-5 mr-3" /> Profile
          </button>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto relative">
        {activeTab === 'dashboard' && (
          <>
            <h2 className="text-2xl font-bold mb-6">Overview</h2>
            {analytics && (
              <>
                <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <p className="text-sm text-gray-500">Total Candidates</p>
                    <p className="text-3xl font-bold">{analytics.total_candidates}</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <p className="text-sm text-gray-500">Active Assessments</p>
                    <p className="text-3xl font-bold">{analytics.total_assessments}</p>
                  </div>
                  <div className="p-6 bg-white rounded-lg shadow border">
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-3xl font-bold">{analytics.average_score}%</p>
                  </div>
                </div>
                <div className="p-6 bg-white rounded-lg shadow border">
                  <h3 className="mb-4 text-lg font-bold">Average Scores by Course</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="score" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {activeTab === 'candidates' && !viewingCandidate && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Candidates Directory</h2>
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-4 font-semibold text-gray-600">Name</th>
                    <th className="p-4 font-semibold text-gray-600">Email</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4">John Doe</td>
                    <td className="p-4 text-gray-500">candidate@skillassess.local</td>
                    <td className="p-4"><span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">Active</span></td>
                    <td className="p-4">
                      <button onClick={() => setViewingCandidate({name: 'John Doe', email: 'candidate@skillassess.local'})} className="text-blue-600 hover:underline">View Results</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && viewingCandidate && (
          <div>
            <button onClick={() => setViewingCandidate(null)} className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
              &larr; Back to Candidates List
            </button>
            <h2 className="text-2xl font-bold mb-2">Candidate Report: {viewingCandidate.name}</h2>
            <p className="text-gray-500 mb-6">{viewingCandidate.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg shadow border">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">AI Skill Gap Analysis</h3>
                <p className="text-gray-700 text-sm mb-2"><strong>Strong Areas:</strong> Variables, Flow Control</p>
                <p className="text-gray-700 text-sm mb-2"><strong>Needs Improvement:</strong> Object-Oriented Programming (Classes)</p>
                <p className="text-gray-700 text-sm"><strong>AI Recommendation:</strong> John struggled with inheritance concepts in the Python Basics descriptive exam. Recommend assigning supplementary module on OOP.</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow border">
                <h3 className="font-bold text-lg mb-4 border-b pb-2">Recent Assessments</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between items-center text-sm">
                    <span>Python Basics</span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full font-bold">82%</span>
                  </li>
                  <li className="flex justify-between items-center text-sm">
                    <span>Data Science Fundamentals</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">Pending Review</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'assessments' && !managingAssessment && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Assessments Hub</h2>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 flex items-center">
                <Plus className="w-5 h-5 mr-1" /> Create New Assessment
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {assessments.map((assessment) => (
                <div key={assessment.id} className="p-6 bg-white rounded-lg shadow border">
                  <h3 className="text-xl font-bold truncate">{assessment.title}</h3>
                  <div className="mt-4 space-y-2 text-sm text-gray-600">
                    <p><strong>Type:</strong> {assessment.type}</p>
                    <p><strong>Mode:</strong> {assessment.mode}</p>
                    <p><strong>Duration:</strong> {assessment.duration} mins</p>
                    <p><strong>Marks:</strong> {assessment.marks}</p>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button 
                      onClick={() => handleManageAssessment(assessment)}
                      className="w-full px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200">
                      Manage Questions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'assessments' && managingAssessment && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <button 
                  onClick={() => setManagingAssessment(null)}
                  className="text-sm text-gray-500 hover:text-red-600 mb-2 inline-block">
                  &larr; Discard & Back
                </button>
                <h2 className="text-2xl font-bold">{managingAssessment.title} - Question Bank</h2>
              </div>
              <div className="space-x-3 flex">
                <button onClick={() => setShowAIGenerateModal(true)} className="px-4 py-2 font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200 flex items-center border border-blue-200">
                  <Sparkles className="w-4 h-4 mr-2" /> AI Generate
                </button>
                <button onClick={() => setShowAddQuestionModal(true)} className="px-4 py-2 font-semibold text-blue-700 bg-blue-100 rounded hover:bg-blue-200 flex items-center border border-blue-200">
                  <Plus className="w-4 h-4 mr-2" /> Add Question
                </button>
                <button onClick={handleSaveAssessment} className="px-4 py-2 font-semibold text-white bg-green-600 rounded hover:bg-green-700 flex items-center">
                  Save & Submit
                </button>
              </div>
            </div>
            
            {questions.length === 0 ? (
              <div className="bg-white rounded-lg shadow border p-8 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-semibold text-gray-700">Question Bank is currently empty.</p>
                <p className="mb-6">Start by adding questions manually or let AI generate them based on skills.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-white rounded-lg shadow border flex justify-between items-start hover:border-blue-300 transition-colors group">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-bold text-gray-500">Q{idx + 1}.</span>
                        <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">{q.type}</span>
                        <span className="text-xs text-gray-500">{q.marks} Marks</span>
                      </div>
                      <p className="text-gray-800 font-medium">{q.text}</p>
                    </div>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingQuestion(q); setShowEditQuestionModal(true); }} className="p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50">
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Evaluator Profile</h2>
            <div className="max-w-2xl bg-white rounded-lg shadow border p-8">
              {profile ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{profile.name}</h3>
                      <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full inline-block mt-1">
                        {profile.role}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Email Address</p>
                      <p className="text-gray-800">{profile.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Phone Number</p>
                      <p className="text-gray-800">{profile.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Account Created</p>
                      <p className="text-gray-800">{new Date(profile.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-semibold mb-1">Assigned Department</p>
                      <p className="text-gray-800">Computer Science & IT</p>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t flex space-x-4">
                    <button onClick={() => setShowEditProfile(true)} className="px-6 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 font-semibold">
                      Edit Profile
                    </button>
                    <button onClick={() => setShowChangePassword(true)} className="px-6 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200 font-semibold">
                      Change Password
                    </button>
                  </div>
                </div>
              ) : (
                <p>Loading profile details...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Assessment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Assessment</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleCreateAssessment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Title</label>
                <input required type="text" value={newAssessment.title} onChange={e => setNewAssessment({...newAssessment, title: e.target.value})} className="w-full border rounded p-2" placeholder="e.g. Advanced Python" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select value={newAssessment.type} onChange={e => setNewAssessment({...newAssessment, type: e.target.value})} className="w-full border rounded p-2">
                    <option value="MCQ">MCQ</option>
                    <option value="DESCRIPTIVE">Descriptive</option>
                    <option value="PRACTICAL">Practical</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Mode</label>
                  <select value={newAssessment.mode} onChange={e => setNewAssessment({...newAssessment, mode: e.target.value})} className="w-full border rounded p-2">
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                    <option value="BLENDED">Blended</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Duration (mins)</label>
                  <input required type="number" value={newAssessment.duration} onChange={e => setNewAssessment({...newAssessment, duration: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Total Marks</label>
                  <input required type="number" value={newAssessment.marks} onChange={e => setNewAssessment({...newAssessment, marks: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Save Assessment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add Question</h2>
              <button onClick={() => setShowAddQuestionModal(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})} className="w-full border rounded p-2">
                    <option value="MCQ">MCQ</option>
                    <option value="DESCRIPTIVE">Descriptive</option>
                    <option value="PRACTICAL">Practical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Marks</label>
                  <input required type="number" value={newQuestion.marks} onChange={e => setNewQuestion({...newQuestion, marks: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Question Text</label>
                <textarea required rows="4" value={newQuestion.text} onChange={e => setNewQuestion({...newQuestion, text: e.target.value})} className="w-full border rounded p-2" placeholder="Enter the question..."></textarea>
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Add to Bank
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Question Modal */}
      {showEditQuestionModal && editingQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Question</h2>
              <button onClick={() => { setShowEditQuestionModal(false); setEditingQuestion(null); }} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveEditQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Type</label>
                  <select value={editingQuestion.type} onChange={e => setEditingQuestion({...editingQuestion, type: e.target.value})} className="w-full border rounded p-2">
                    <option value="MCQ">MCQ</option>
                    <option value="DESCRIPTIVE">Descriptive</option>
                    <option value="PRACTICAL">Practical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Marks</label>
                  <input required type="number" value={editingQuestion.marks} onChange={e => setEditingQuestion({...editingQuestion, marks: e.target.value})} className="w-full border rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Question Text</label>
                <textarea required rows="4" value={editingQuestion.text} onChange={e => setEditingQuestion({...editingQuestion, text: e.target.value})} className="w-full border rounded p-2"></textarea>
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Generate Modal */}
      {showAIGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center"><Sparkles className="w-5 h-5 mr-2 text-blue-600"/> AI Question Generation</h2>
              <button onClick={() => setShowAIGenerateModal(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">The AI will generate questions based on the skills mapped to this assessment.</p>
              <div>
                <label className="block text-sm font-semibold mb-1">Target Difficulty</label>
                <select className="w-full border rounded p-2">
                  <option>Adaptive / Mixed</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Number of Questions</label>
                <input type="number" min="1" max="100" value={aiQuestionCount} onChange={e => setAiQuestionCount(Number(e.target.value))} className="w-full border rounded p-2" />
              </div>
              <button onClick={handleAIGenerate} className="w-full py-2 mt-4 bg-blue-100 text-blue-700 border border-blue-300 font-bold rounded hover:bg-blue-200">
                Generate Questions
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {showEditProfile && profile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleEditProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Full Name</label>
                <input required type="text" defaultValue={profile.name} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email Address</label>
                <input type="email" defaultValue={profile.email} disabled className="w-full border rounded p-2 bg-gray-100 text-gray-500 cursor-not-allowed" />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone Number</label>
                <input type="text" defaultValue={profile.phone || ''} className="w-full border rounded p-2" placeholder="+1 234 567 8900" />
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Change Password</h2>
              <button onClick={() => setShowChangePassword(false)} className="text-gray-500 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Current Password</label>
                <input required type="password" placeholder="••••••••" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Confirm New Password</label>
                <input required type="password" placeholder="••••••••" className="w-full border rounded p-2" />
              </div>
              <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white font-bold rounded hover:bg-blue-700">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
