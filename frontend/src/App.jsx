import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CandidateDashboard from './dashboards/CandidateDashboard';
import EvaluatorDashboard from './dashboards/EvaluatorDashboard';
import AssessmentPlatform from './pages/AssessmentPlatform';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/candidate/*" element={
            <ProtectedRoute allowedRole="CANDIDATE">
              <CandidateDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/evaluator/*" element={
            <ProtectedRoute allowedRole="EVALUATOR">
              <EvaluatorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/assessment/:id" element={
            <ProtectedRoute>
              <AssessmentPlatform />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
