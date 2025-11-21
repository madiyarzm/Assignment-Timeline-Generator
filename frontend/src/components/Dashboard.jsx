import React, { useState } from 'react';
import AddAssignmentModal from './AddAssignmentModal';

function Dashboard({ user, assignments, onLogout, onAddAssignment, onShowAssignment, onArchiveAssignment, onDeleteAssignment, onNavigateToArchive }) {
  const [showModal, setShowModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="page">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="app-title">Assignment Manager</h1>
        </div>
        <div className="header-right">
          <div className="profile-dropdown">
            <button 
              className="profile-btn" 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <i className="fas fa-user-circle"></i>
            </button>
            {showProfileDropdown && (
              <div className="dropdown-menu">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }}>
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-header-section">
          <h2 className="dashboard-title">My Assignments</h2>
          <div className="dashboard-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus"></i> Add Assignment
            </button>
            <button className="btn btn-secondary" onClick={onNavigateToArchive}>
              <i className="fas fa-archive"></i> Archive
            </button>
          </div>
        </div>

        <div className="assignments-container">
          {assignments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-clipboard-list empty-icon"></i>
              <h3>No assignments yet</h3>
              <p>Click + to add your first assignment!</p>
            </div>
          ) : (
            assignments.map((assignment) => {
              const isCompleted = assignment.progress === 100 || 
                (assignment.subtasks && assignment.subtasks.length > 0 && 
                 assignment.subtasks.every(subtask => subtask.completed));
              
              return (
                <div 
                  key={assignment.id} 
                  className={`assignment-card ${isCompleted ? 'completed' : ''}`}
                >
                  <div 
                    className="assignment-card-content"
                    onClick={() => onShowAssignment(assignment)}
                  >
                    <h3 className="assignment-card-title">{assignment.title}</h3>
                    <p className="assignment-card-deadline">Due: {formatDate(assignment.deadline)}</p>
                    <div className="assignment-card-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${assignment.progress || 0}%` }}
                        ></div>
                      </div>
                      <div className="progress-text">{assignment.progress || 0}% complete</div>
                    </div>
                  </div>
                  <div className="assignment-card-actions">
                    <button
                      className="btn btn-small btn-secondary archive-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Archive this assignment? You can recover it later from the Archive page.')) {
                          onArchiveAssignment(assignment.id);
                        }
                      }}
                      title="Archive assignment"
                    >
                      <i className="fas fa-archive"></i> Archive
                    </button>
                    <button
                      className="btn btn-small btn-danger delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Permanently delete this assignment? This cannot be undone.')) {
                          onDeleteAssignment(assignment.id);
                        }
                      }}
                      title="Permanently delete assignment"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {showModal && (
        <AddAssignmentModal
          onClose={() => setShowModal(false)}
          onSave={onAddAssignment}
        />
      )}
    </div>
  );
}

export default Dashboard;
