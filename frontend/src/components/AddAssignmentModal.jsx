import React, { useState } from 'react';

function AddAssignmentModal({ onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [subtasks, setSubtasks] = useState([]);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSampleSubtasks = (title, description) => {
    if (title.toLowerCase().includes('presentation')) {
      return [
        'Research topic and gather key points',
        'Create presentation outline',
        'Design slides and visual elements',
        'Practice presentation delivery',
        'Prepare for questions and discussion',
        'Present to audience'
      ];
    } else if (title.toLowerCase().includes('report')) {
      return [
        'Conduct research and data collection',
        'Analyze findings and draw conclusions',
        'Write introduction and methodology',
        'Draft main content and analysis',
        'Create charts and visualizations',
        'Final review and submission'
      ];
    } else if (title.toLowerCase().includes('project')) {
      return [
        'Define project requirements and scope',
        'Create project timeline and milestones',
        'Develop core functionality',
        'Test and debug implementation',
        'Document code and create user guide',
        'Deploy and deliver project'
      ];
    }
    
    return [
      'Research and gather information',
      'Create initial outline or plan',
      'Draft first version',
      'Review and revise content',
      'Final proofreading and editing',
      'Submit or present final work'
    ];
  };

  const handleGenerateBreakdown = () => {
    if (!title) {
      alert('Please enter a title first');
      return;
    }

    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const generatedSubtasks = generateSampleSubtasks(title, description);
      setSubtasks(generatedSubtasks.map((text, index) => ({
        id: index,
        text: text,
        completed: false
      })));
      setShowSubtasks(true);
      setIsGenerating(false);
    }, 2000);
  };

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

    const assignment = {
      id: Date.now().toString(),
      title: title,
      description: description,
      deadline: deadline,
      progress: 0,
      subtasks: subtasks,
      createdAt: new Date().toISOString()
    };

    onSave(assignment);
    onClose();
    
    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setSubtasks([]);
    setShowSubtasks(false);
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
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleGenerateBreakdown}
            >
              <i className="fas fa-magic"></i> Generate Breakdown (AI)
            </button>
            {isGenerating && (
              <div className="ai-loading">
                <i className="fas fa-spinner fa-spin"></i> Generating breakdown...
              </div>
            )}
          </div>

          {showSubtasks && subtasks.length > 0 && (
            <div className="subtasks-container">
              <h4>Generated Subtasks</h4>
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
