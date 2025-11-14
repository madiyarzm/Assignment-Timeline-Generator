import React, { useState } from 'react';

function AddAssignmentModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState([]);

  const handleSubtaskChange = (index, newText) => {
    const updated = [...subtasks];
    updated[index].text = newText;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !deadline) {
      alert('Please fill in the required fields');
      return;
    }

    // Don't send subtasks if description exists - let backend generate via LLM
    // Only send subtasks if user manually added them AND no description
    const assignment = {
      title: title,
      description: description,
      deadline: deadline,
      progress: 0,
      // Only include subtasks if user manually added them (not auto-generated)
      // If description exists, backend will use LLM to generate milestones
      subtasks: (description && description.trim()) ? [] : subtasks,
      createdAt: new Date().toISOString()
    };

    onSave(assignment);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setSubtasks([]);
  };

  return (
    <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Add New Assignment</h3>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="assignment-title">Title *</label>
            <input 
              type="text" 
              id="assignment-title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="assignment-description">Description</label>
            <textarea 
              id="assignment-description" 
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="assignment-deadline">Deadline *</label>
            <input 
              type="date" 
              id="assignment-deadline" 
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
          
          <div className="ai-section">
            <p style={{fontSize: '0.9em', color: '#666', marginBottom: '10px'}}>
              💡 <strong>Tip:</strong> Fill in the description field and tasks will be automatically generated via AI when you save!
            </p>
          </div>

          {subtasks.length > 0 && (
            <div className="subtasks-container">
              <h4>Manual Subtasks (optional)</h4>
              <p style={{fontSize: '0.85em', color: '#888', marginBottom: '10px'}}>
                If you add manual subtasks, they will be used instead of AI generation
              </p>
              {subtasks.map((subtask, index) => (
                <div key={index} className="subtask-item">
                  <input 
                    type="text" 
                    value={subtask.text}
                    onChange={(e) => handleSubtaskChange(index, e.target.value)}
                    placeholder="Enter subtask..."
                  />
                  <button 
                    type="button" 
                    className="subtask-delete" 
                    onClick={() => handleRemoveSubtask(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSubtasks([...subtasks, {id: subtasks.length, text: '', completed: false}])}
                style={{marginTop: '10px'}}
              >
                + Add Subtask
              </button>
            </div>
          )}
          
          {subtasks.length === 0 && (
            <div style={{marginTop: '10px'}}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setSubtasks([{id: 0, text: '', completed: false}])}
              >
                + Add Manual Subtasks (optional)
              </button>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddAssignmentModal;
