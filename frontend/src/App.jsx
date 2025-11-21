import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import AssignmentDetail from './components/AssignmentDetail';
import ArchivePage from './components/ArchivePage';
import api from './api';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [previousPage, setPreviousPage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [archivedAssignments, setArchivedAssignments] = useState([]);
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
    setPreviousPage(currentPage);
    setCurrentPage('assignment');
  };

  const handleBackToDashboard = () => {
    const pageToReturnTo = previousPage || 'dashboard';
    setCurrentPage(pageToReturnTo);
    setCurrentAssignment(null);
    setPreviousPage(null);
  };

  const handleNavigateToArchive = async () => {
    setCurrentPage('archive');
    // Load archived assignments when navigating to archive page
    try {
      const archivedData = await api.getArchivedAssignments();
      setArchivedAssignments(archivedData);
    } catch (err) {
      console.error('Failed to load archived assignments:', err);
      // Fallback to localStorage
      const savedArchived = localStorage.getItem('archivedAssignments');
      if (savedArchived) {
        setArchivedAssignments(JSON.parse(savedArchived));
      }
    }
  };

  const handleArchiveAssignment = async (assignmentId) => {
    try {
      await api.archiveAssignment(assignmentId);
      // Remove from active assignments
      const assignmentToArchive = assignments.find(a => a.id === assignmentId);
      if (assignmentToArchive) {
        const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
        setAssignments(updatedAssignments);
        // Add to archived (with archived flag)
        const archivedAssignment = { ...assignmentToArchive, archived: true };
        setArchivedAssignments([...archivedAssignments, archivedAssignment]);
        // Update localStorage as fallback
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
        localStorage.setItem('archivedAssignments', JSON.stringify([...archivedAssignments, archivedAssignment]));
      }
    } catch (err) {
      console.error('Failed to archive assignment:', err);
      // Fallback: remove from active and add to archived in state/localStorage
      const assignmentToArchive = assignments.find(a => a.id === assignmentId);
      if (assignmentToArchive) {
        const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
        setAssignments(updatedAssignments);
        const archivedAssignment = { ...assignmentToArchive, archived: true };
        setArchivedAssignments([...archivedAssignments, archivedAssignment]);
        localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
        localStorage.setItem('archivedAssignments', JSON.stringify([...archivedAssignments, archivedAssignment]));
      }
    }
  };

  const handleUnarchiveAssignment = async (assignmentId) => {
    try {
      await api.unarchiveAssignment(assignmentId);
      // Remove from archived and add back to active
      const assignmentToUnarchive = archivedAssignments.find(a => a.id === assignmentId);
      if (assignmentToUnarchive) {
        const updatedArchived = archivedAssignments.filter(a => a.id !== assignmentId);
        setArchivedAssignments(updatedArchived);
        const unarchivedAssignment = { ...assignmentToUnarchive, archived: false };
        setAssignments([...assignments, unarchivedAssignment]);
        // Update localStorage
        localStorage.setItem('archivedAssignments', JSON.stringify(updatedArchived));
        localStorage.setItem('assignments', JSON.stringify([...assignments, unarchivedAssignment]));
      }
    } catch (err) {
      console.error('Failed to unarchive assignment:', err);
      // Fallback: move from archived to active in state/localStorage
      const assignmentToUnarchive = archivedAssignments.find(a => a.id === assignmentId);
      if (assignmentToUnarchive) {
        const updatedArchived = archivedAssignments.filter(a => a.id !== assignmentId);
        setArchivedAssignments(updatedArchived);
        const unarchivedAssignment = { ...assignmentToUnarchive, archived: false };
        setAssignments([...assignments, unarchivedAssignment]);
        localStorage.setItem('archivedAssignments', JSON.stringify(updatedArchived));
        localStorage.setItem('assignments', JSON.stringify([...assignments, unarchivedAssignment]));
      }
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      await api.deleteAssignment(assignmentId);
      // Remove from active assignments permanently
      const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
      setAssignments(updatedAssignments);
      // Also remove from archived if it exists there
      const updatedArchived = archivedAssignments.filter(a => a.id !== assignmentId);
      setArchivedAssignments(updatedArchived);
      // Update localStorage
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      localStorage.setItem('archivedAssignments', JSON.stringify(updatedArchived));
      // If we're viewing this assignment, go back to dashboard
      if (currentAssignment && currentAssignment.id === assignmentId) {
        handleBackToDashboard();
      }
    } catch (err) {
      console.error('Failed to delete assignment:', err);
      // Fallback: remove from state/localStorage
      const updatedAssignments = assignments.filter(a => a.id !== assignmentId);
      setAssignments(updatedAssignments);
      const updatedArchived = archivedAssignments.filter(a => a.id !== assignmentId);
      setArchivedAssignments(updatedArchived);
      localStorage.setItem('assignments', JSON.stringify(updatedAssignments));
      localStorage.setItem('archivedAssignments', JSON.stringify(updatedArchived));
      if (currentAssignment && currentAssignment.id === assignmentId) {
        handleBackToDashboard();
      }
    }
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
          onArchiveAssignment={handleArchiveAssignment}
          onDeleteAssignment={handleDeleteAssignment}
          onNavigateToArchive={handleNavigateToArchive}
        />
      )}
      {currentPage === 'archive' && (
        <ArchivePage 
          user={currentUser}
          archivedAssignments={archivedAssignments}
          onLogout={handleLogout}
          onShowAssignment={handleShowAssignment}
          onUnarchiveAssignment={handleUnarchiveAssignment}
          onDeleteAssignment={handleDeleteAssignment}
          onBackToDashboard={handleBackToDashboard}
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
