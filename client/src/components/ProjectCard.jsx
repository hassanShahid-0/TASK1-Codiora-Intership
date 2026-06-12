import React from 'react';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const techStack = project.technologiesUsed
    ? project.technologiesUsed.split(',').map((tech) => tech.trim()).filter(Boolean)
    : [];

  return (
    <div className="card h-100 shadow-sm border-0 rounded-3 hover-card">
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div>
          <h5 className="card-title fw-bold text-dark mb-2">{project.projectTitle}</h5>
          <p className="card-text text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            {project.description || 'No description provided.'}
          </p>
          {techStack.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-4">
              {techStack.map((tech, idx) => (
                <span key={idx} className="badge bg-light text-dark border px-2 py-1 rounded-3">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <div className="d-flex gap-2 mb-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-secondary btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              >
                <i className="bi bi-github"></i> GitHub
              </a>
            )}
            {project.liveDemoLink && (
              <a
                href={project.liveDemoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-success btn-sm flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              >
                <i className="bi bi-box-arrow-up-right"></i> Demo
              </a>
            )}
          </div>
          <div className="d-flex gap-2 border-top pt-3">
            <button
              onClick={() => onEdit(project)}
              className="btn btn-primary btn-sm flex-grow-1"
            >
              <i className="bi bi-pencil-square"></i> Edit
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="btn btn-danger btn-sm flex-grow-1"
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
