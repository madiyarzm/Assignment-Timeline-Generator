import React from 'react';

function ArchivePage({ user, archivedAssignments, onLogout, onShowAssignment, onUnarchiveAssignment, onDeleteAssignment, onBackToDashboard }) {
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
          <button className="back-btn" onClick={onBackToDashboard}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <h1 className="app-title">Assignment Manager</h1>
        </div>
        <div className="header-right">
          <div className="profile-dropdown">
            <button 
              className="profile-btn" 
              onClick={() => {}}
            >
              <i className="fas fa-user-circle"></i>
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-header-section">
          <h2 className="dashboard-title">Archived Assignments</h2>
        </div>

        <div className="assignments-container">
          {archivedAssignments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-archive empty-icon"></i>
              <h3>No archived assignments</h3>
              <p>Completed assignments will appear here when archived.</p>
            </div>
          ) : (
            archivedAssignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="assignment-card archived"
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
                    className="btn btn-small btn-outline unarchive-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Unarchive this assignment?')) {
                        onUnarchiveAssignment(assignment.id);
                      }
                    }}
                    title="Unarchive assignment"
                  >
                    <i className="fas fa-undo"></i> Unarchive
                  </button>
                  <button
                    className="btn btn-small btn-danger delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Permanently delete this archived assignment? This cannot be undone.')) {
                        onDeleteAssignment(assignment.id);
                      }
                    }}
                    title="Permanently delete assignment"
                  >
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default ArchivePage;

