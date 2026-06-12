import React from 'react';

const SkillCard = ({ skill, onEdit, onDelete }) => {
  const getBadgeColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'badge-beginner';
      case 'Intermediate':
        return 'badge-intermediate';
      case 'Advanced':
        return 'badge-advanced';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getPercent = (level) => {
    switch (level) {
      case 'Beginner':
        return '35%';
      case 'Intermediate':
        return '70%';
      case 'Advanced':
        return '100%';
      default:
        return '0%';
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 hover-card">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title fw-bold text-dark mb-0">{skill.skillName}</h5>
            <span className={`badge ${getBadgeColor(skill.skillLevel)} px-2 py-1 rounded-pill`}>
              {skill.skillLevel}
            </span>
          </div>
          <div className="progress mb-4" style={{ height: '6px' }}>
            <div
              className={`progress-bar ${
                skill.skillLevel === 'Advanced' ? 'progress-emerald' : skill.skillLevel === 'Intermediate' ? 'progress-teal' : 'progress-cyan'
              }`}
              role="progressbar"
              style={{ width: getPercent(skill.skillLevel) }}
              aria-valuenow={skill.skillLevel === 'Advanced' ? 100 : skill.skillLevel === 'Intermediate' ? 70 : 35}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => onEdit(skill)}
            className="btn btn-outline-primary btn-sm flex-grow-1"
          >
            <i className="bi bi-pencil-square me-1"></i> Edit
          </button>
          <button
            onClick={() => onDelete(skill._id)}
            className="btn btn-outline-danger btn-sm flex-grow-1"
          >
            <i className="bi bi-trash me-1"></i> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
