import React from 'react';

function LandingPage({ onGetStarted }) {
  return (
    <div className="page">
      <div className="landing-container">
        <div className="landing-content">
          <h1 className="landing-title">Assignment Manager</h1>
          <p className="landing-subtitle">Organize your tasks with AI-powered breakdowns</p>
          <div className="landing-buttons">
            <button className="btn btn-primary" onClick={onGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
