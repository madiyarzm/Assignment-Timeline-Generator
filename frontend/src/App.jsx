import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AssignmentDetail from './components/AssignmentDetail';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('landing');
    }

    // Load assignments from localStorage
    const savedAssignments = localStorage.getItem('assignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('landing');
  };

  const handleAddAssignment = (assignment) => {
    const newAssignments = [...assignments, assignment];
    setAssignments(newAssignments);
    localStorage.setItem('assignments', JSON.stringify(newAssignments));
  };

  const handleUpdateAssignment = (updatedAssignment) => {
    const newAssignments = assignments.map(a => 
      a.id === updatedAssignment.id ? updatedAssignment : a
    );
    setAssignments(newAssignments);
    localStorage.setItem('assignments', JSON.stringify(newAssignments));
    setCurrentAssignment(updatedAssignment);
  };

  const handleShowAssignment = (assignment) => {
    setCurrentAssignment(assignment);
    setCurrentPage('assignment');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setCurrentAssignment(null);
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('login')} />
      )}
      {currentPage === 'login' && (
        <LoginPage 
          onLogin={handleLogin}
          onSwitchToRegister={() => setCurrentPage('register')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterPage 
          onRegister={handleRegister}
          onSwitchToLogin={() => setCurrentPage('login')}
        />
      )}
      {currentPage === 'dashboard' && (
        <Dashboard 
          user={currentUser}
          assignments={assignments}
          onLogout={handleLogout}
          onAddAssignment={handleAddAssignment}
          onShowAssignment={handleShowAssignment}
        />
      )}
      {currentPage === 'assignment' && currentAssignment && (
        <AssignmentDetail 
          assignment={currentAssignment}
          onBack={handleBackToDashboard}
          onUpdate={handleUpdateAssignment}
        />
      )}
    </div>
  );
}

export default App;
