import React, { useState, useEffect } from 'react';

// Recursive component for rendering subtasks with nested subtasks
function SubTaskItem({ subtask, index, path, onToggle, onTextChange, onAddSubtask, onDelete, level = 0 }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const hasNestedSubtasks = subtask.subtasks && subtask.subtasks.length > 0;

  return (
    <div 
      className={`timeline-item timeline-item-level-${level} ${subtask.completed ? 'completed' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="timeline-item-main">
        <input 
          type="checkbox" 
          className="timeline-checkbox"
          checked={subtask.completed || false}
          onChange={() => onToggle(path)}
        />
        <div className="timeline-content">
          <textarea 
            className={`timeline-text ${subtask.completed ? 'completed' : ''}`}
            value={subtask.text}
            onChange={(e) => onTextChange(path, e.target.value)}
            placeholder="Enter subtask description..."
          ></textarea>
        </div>
        <div className="timeline-actions">
          {level === 0 && (
            <button
              className="btn btn-small btn-outline add-subtask-btn"
              onClick={() => onAddSubtask(path)}
              title="Add nested subtask"
            >
              <i className="fas fa-plus"></i>
            </button>
          )}
          {hasNestedSubtasks && (
            <button
              className="btn btn-small btn-icon"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
            </button>
          )}
          <button
            className={`btn btn-small subtask-delete-btn ${isHovered ? 'visible' : 'hidden'}`}
            onClick={() => {
              if (window.confirm('Delete this subtask and all its nested subtasks?')) {
                onDelete(path);
              }
            }}
            title="Delete subtask"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      {hasNestedSubtasks && isExpanded && (
        <div className="nested-subtasks">
          {subtask.subtasks.map((nestedSubtask, nestedIndex) => (
            <SubTaskItem
              key={nestedSubtask.id || nestedIndex}
              subtask={nestedSubtask}
              index={nestedIndex}
              path={[...path, nestedIndex]}
              onToggle={onToggle}
              onTextChange={onTextChange}
              onAddSubtask={onAddSubtask}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AssignmentDetail({ assignment, onBack, onUpdate }) {
  const [localAssignment, setLocalAssignment] = useState(assignment);
  const [showSubtasks, setShowSubtasks] = useState(true);

  useEffect(() => {
    if (assignment) {
      // Ensure all subtasks have subtasks array initialized
      const initializeSubtasks = (subtasks) => {
        if (!subtasks) return [];
        return subtasks.map(subtask => ({
          ...subtask,
          subtasks: initializeSubtasks(subtask.subtasks)
        }));
      };
      
      const assignmentWithSubtasks = {
        ...assignment,
        subtasks: initializeSubtasks(assignment.subtasks || [])
      };
      setLocalAssignment(assignmentWithSubtasks);
    }
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
    
    // Calculate progress including nested subtasks
    let totalCompleted = 0;
    let totalCount = 0;
    
    const countSubtasks = (subtasks) => {
      subtasks.forEach(subtask => {
        totalCount++;
        if (subtask.completed) totalCompleted++;
        if (subtask.subtasks && subtask.subtasks.length > 0) {
          countSubtasks(subtask.subtasks);
        }
      });
    };
    
    countSubtasks(localAssignment.subtasks);
    return totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
  };

  // Helper function to get subtask by path (array of indices)
  const getSubtaskByPath = (subtasks, path) => {
    let current = subtasks;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]].subtasks || [];
    }
    return current[path[path.length - 1]];
  };

  // Helper function to set subtask by path
  const setSubtaskByPath = (subtasks, path, updater) => {
    if (path.length === 1) {
      // Top level
      const newSubtasks = [...subtasks];
      newSubtasks[path[0]] = updater(newSubtasks[path[0]]);
      return newSubtasks;
    } else {
      // Nested level
      const newSubtasks = [...subtasks];
      const parentIndex = path[0];
      const parent = { ...newSubtasks[parentIndex] };
      parent.subtasks = setSubtaskByPath(parent.subtasks || [], path.slice(1), updater);
      newSubtasks[parentIndex] = parent;
      return newSubtasks;
    }
  };

  const handleToggleSubtask = (path) => {
    const updated = { ...localAssignment };
    if (!updated.subtasks) {
      updated.subtasks = [];
    }
    
    updated.subtasks = setSubtaskByPath(updated.subtasks, path, (subtask) => ({
      ...subtask,
      completed: !subtask.completed
    }));
    
    // Recalculate progress
    const calculateSubtaskProgress = (subtasks) => {
      if (!subtasks || subtasks.length === 0) return 0;
      let totalCompleted = 0;
      let totalCount = 0;
      
      const countSubtasks = (subs) => {
        subs.forEach(sub => {
          totalCount++;
          if (sub.completed) totalCompleted++;
          if (sub.subtasks && sub.subtasks.length > 0) {
            countSubtasks(sub.subtasks);
          }
        });
      };
      
      countSubtasks(subtasks);
      return totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
    };
    
    updated.progress = calculateSubtaskProgress(updated.subtasks);
    setLocalAssignment(updated);
  };

  const handleSubtaskTextChange = (path, newText) => {
    const updated = { ...localAssignment };
    if (!updated.subtasks) {
      updated.subtasks = [];
    }
    
    updated.subtasks = setSubtaskByPath(updated.subtasks, path, (subtask) => ({
      ...subtask,
      text: newText
    }));
    
    setLocalAssignment(updated);
  };

  const handleAddSubtask = (path) => {
    const updated = { ...localAssignment };
    if (!updated.subtasks) {
      updated.subtasks = [];
    }
    
    // Generate unique ID
    const getAllIds = (subs) => {
      let ids = [];
      subs.forEach(sub => {
        if (sub.id) ids.push(sub.id);
        if (sub.subtasks) ids = ids.concat(getAllIds(sub.subtasks));
      });
      return ids;
    };
    const allIds = getAllIds(updated.subtasks);
    const maxId = allIds.length > 0 ? Math.max(...allIds) : 0;
    
    // Use different placeholder text based on level
    const placeholderText = path.length === 0 ? 'Add a step...' : 'Add a subtask...';
    
    const newSubtask = {
      id: maxId + 1,
      text: placeholderText,
      completed: false,
      subtasks: []
    };
    
    if (path.length === 0) {
      // Add to top level
      updated.subtasks = [...updated.subtasks, newSubtask];
    } else {
      // Add to nested level
      updated.subtasks = setSubtaskByPath(updated.subtasks, path, (subtask) => ({
        ...subtask,
        subtasks: [...(subtask.subtasks || []), newSubtask]
      }));
    }
    
    setLocalAssignment(updated);
  };

  const handleDeleteSubtask = (path) => {
    const updated = { ...localAssignment };
    if (!updated.subtasks) {
      updated.subtasks = [];
    }
    
    if (path.length === 1) {
      // Delete from top level
      updated.subtasks = updated.subtasks.filter((_, i) => i !== path[0]);
    } else {
      // Delete from nested level
      const parentIndex = path[0];
      const parent = { ...updated.subtasks[parentIndex] };
      parent.subtasks = (parent.subtasks || []).filter((_, i) => i !== path[path.length - 1]);
      updated.subtasks = [...updated.subtasks];
      updated.subtasks[parentIndex] = parent;
    }
    
    // Recalculate progress
    const calculateSubtaskProgress = (subtasks) => {
      if (!subtasks || subtasks.length === 0) return 0;
      let totalCompleted = 0;
      let totalCount = 0;
      
      const countSubtasks = (subs) => {
        subs.forEach(sub => {
          totalCount++;
          if (sub.completed) totalCompleted++;
          if (sub.subtasks && sub.subtasks.length > 0) {
            countSubtasks(sub.subtasks);
          }
        });
      };
      
      countSubtasks(subtasks);
      return totalCount > 0 ? Math.round((totalCompleted / totalCount) * 100) : 0;
    };
    
    updated.progress = calculateSubtaskProgress(updated.subtasks);
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
                {localAssignment.subtasks && localAssignment.subtasks.length > 0 ? (
                  localAssignment.subtasks.map((subtask, index) => (
                    <SubTaskItem
                      key={subtask.id || index}
                      subtask={subtask}
                      index={index}
                      path={[index]}
                      onToggle={handleToggleSubtask}
                      onTextChange={handleSubtaskTextChange}
                      onAddSubtask={handleAddSubtask}
                      onDelete={handleDeleteSubtask}
                      level={0}
                    />
                  ))
                ) : (
                  <div className="empty-subtasks">
                    <p>No subtasks yet. Click "Add Step" to create one.</p>
                  </div>
                )}
              </div>
              <button 
                className="btn btn-outline add-step-btn" 
                onClick={() => handleAddSubtask([])}
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
