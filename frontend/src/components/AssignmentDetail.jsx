import React, { useState, useEffect } from 'react';

function AssignmentDetail({ assignment, onBack, onUpdate }) {
  const [localAssignment, setLocalAssignment] = useState(assignment);
  const [showSubtasks, setShowSubtasks] = useState(true);

  useEffect(() => {
    setLocalAssignment(assignment);
  }, [assignment]);

  useEffect(() => {
    // Auto-save when assignment changes
    const timer = setTimeout(() => {
      if (localAssignment) {
        onUpdate(localAssignment);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localAssignment, onUpdate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateProgress = () => {
    if (!localAssignment || !localAssignment.subtasks || localAssignment.subtasks.length === 0) {
      return localAssignment?.progress || 0;
    }
    const completed = localAssignment.subtasks.filter(t => t.completed).length;
    return Math.round((completed / localAssignment.subtasks.length) * 100);
  };

  const handleToggleSubtask = (index) => {
    const updated = { ...localAssignment };
    if (updated.subtasks && updated.subtasks[index]) {
      updated.subtasks[index].completed = !updated.subtasks[index].completed;
      // Recalculate progress
      const completed = updated.subtasks.filter(t => t.completed).length;
      updated.progress = updated.subtasks.length > 0 
        ? Math.round((completed / updated.subtasks.length) * 100)
        : 0;
      setLocalAssignment(updated);
    }
  };

  const handleSubtaskTextChange = (index, newText) => {
    const updated = { ...localAssignment };
    updated.subtasks[index].text = newText;
    setLocalAssignment(updated);
  };

  const handleAddStep = () => {
    const updated = { ...localAssignment };
    updated.subtasks = [
      ...updated.subtasks,
      {
        id: updated.subtasks.length,
        text: 'New step...',
        completed: false
      }
    ];
    setLocalAssignment(updated);
  };

  const progress = calculateProgress();

  return (
    <div className="page">
      <header className="assignment-header">
        <button className="back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back
        </button>
        <div className="assignment-title-section">
          <h1>{localAssignment.title}</h1>
          <p>Due: {formatDate(localAssignment.deadline)}</p>
        </div>
      </header>

      <main className="assignment-main">
        <div className="progress-section">
          <div className="progress-header">
            <h3>Progress</h3>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="subtasks-section">
          <div className="subtasks-header">
            <h3>Timeline</h3>
            <button 
              className="btn btn-small" 
              onClick={() => setShowSubtasks(!showSubtasks)}
            >
              <i className={`fas fa-chevron-${showSubtasks ? 'down' : 'right'}`}></i>
            </button>
          </div>
          {showSubtasks && (
            <>
              <div className="subtasks-timeline">
                {localAssignment.subtasks && localAssignment.subtasks.map((subtask, index) => (
                  <div 
                    key={index} 
                    className={`timeline-item ${subtask.completed ? 'completed' : ''}`}
                  >
                    <input 
                      type="checkbox" 
                      className="timeline-checkbox"
                      checked={subtask.completed || false}
                      onChange={() => handleToggleSubtask(index)}
                    />
                    <div className="timeline-content">
                      <textarea 
                        className={`timeline-text ${subtask.completed ? 'completed' : ''}`}
                        value={subtask.text}
                        onChange={(e) => handleSubtaskTextChange(index, e.target.value)}
                        onBlur={() => onUpdate(localAssignment)}
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                className="btn btn-outline add-step-btn" 
                onClick={handleAddStep}
              >
                <i className="fas fa-plus"></i> Add Step
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AssignmentDetail;
