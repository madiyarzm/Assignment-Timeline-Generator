import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AssignmentDetail from './components/AssignmentDetail';
import api from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and load assignments
    const loadUserData = async () => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
          setCurrentPage('dashboard');
          
          // Load assignments from API
          try {
            const assignmentsData = await api.getAssignments();
            setAssignments(assignmentsData);
          } catch (err) {
            console.error('Failed to load assignments:', err);
            // If API fails, try localStorage as fallback
            const savedAssignments = localStorage.getItem('assignments');
            if (savedAssignments) {
              setAssignments(JSON.parse(savedAssignments));
            }
          }
        } catch (err) {
          console.error('Failed to load user:', err);
          localStorage.removeItem('currentUser');
        }
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const handleLogin = async (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
    
    // Load assignments from API
    try {
      const assignmentsData = await api.getAssignments();
      setAssignments(assignmentsData);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const handleRegister = async (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
    
    // Load assignments from API
    try {
      const assignmentsData = await api.getAssignments();
      setAssignments(assignmentsData);
    } catch (err) {
      console.error('Failed to load assignments:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setAssignments([]);
    setCurrentPage('landing');
  };

  const handleAddAssignment = async (assignment) => {
    try {
      const createdAssignment = await api.createAssignment(assignment);
      const newAssignments = [...assignments, createdAssignment];
      setAssignments(newAssignments);
    } catch (err) {
      console.error('Failed to create assignment:', err);
      // Fallback to local storage
      const newAssignments = [...assignments, assignment];
      setAssignments(newAssignments);
      localStorage.setItem('assignments', JSON.stringify(newAssignments));
    }
  };

  const handleUpdateAssignment = async (updatedAssignment) => {
    try {
      const updated = await api.updateAssignment(updatedAssignment.id, updatedAssignment);
      const newAssignments = assignments.map(a => 
        a.id === updated.id ? updated : a
      );
      setAssignments(newAssignments);
      setCurrentAssignment(updated);
    } catch (err) {
      console.error('Failed to update assignment:', err);
      // Fallback to local storage
      const newAssignments = assignments.map(a => 
        a.id === updatedAssignment.id ? updatedAssignment : a
      );
      setAssignments(newAssignments);
      localStorage.setItem('assignments', JSON.stringify(newAssignments));
      setCurrentAssignment(updatedAssignment);
    }
  };

  const handleShowAssignment = (assignment) => {
    setCurrentAssignment(assignment);
    setCurrentPage('assignment');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
    setCurrentAssignment(null);
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

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
