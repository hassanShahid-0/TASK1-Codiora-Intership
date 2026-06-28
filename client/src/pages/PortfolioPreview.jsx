import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PortfolioPreview = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, skillsRes, projectsRes, categoriesRes] = await Promise.all([
          api.get('/api/portfolio'),
          api.get('/api/skills'),
          api.get('/api/projects'),
          api.get('/api/categories')
        ]);
        setPortfolio(portfolioRes.data);
        setSkills(skillsRes.data);
        setProjects(projectsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error('Error fetching preview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f8fafc' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading Preview...</span>
        </div>
      </div>
    );
  }

  // Get all unique technologies from user's projects to build the skill filter list
  const allTechs = [
    ...new Set(
      projects
        .flatMap((p) => (p.technologiesUsed ? p.technologiesUsed.split(',').map((t) => t.trim()).filter(Boolean) : []))
    ),
  ].sort();

  // Filtering projects logic
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.projectTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologiesUsed || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || (p.category || 'Uncategorized') === selectedCategory;
    
    const projectTechs = p.technologiesUsed
      ? p.technologiesUsed.split(',').map((t) => t.trim().toLowerCase())
      : [];
    const matchesSkill = selectedSkill === '' || projectTechs.includes(selectedSkill.toLowerCase());

    return matchesSearch && matchesCategory && matchesSkill;
  });

  return (
    <div className="min-vh-100 bg-light pb-5" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* CODIORA Header Banner */}
      <div className="bg-dark py-2 px-4 d-flex justify-content-between align-items-center shadow-sm" style={{ borderBottom: '2px solid var(--emerald-500)' }}>
        <span className="text-white fw-bold tracking-wide" style={{ fontSize: '0.9rem' }}>
          CODIORA <span className="text-muted fw-normal">| Our Code Builds Your Vision</span>
        </span>
        <span className="badge bg-success rounded-pill px-3 py-1">Live Preview Mode</span>
      </div>

      <div className="container py-5">
        {/* Profile Card / Header Section */}
        {portfolio ? (
          <div className="card border-0 shadow-lg rounded-3 mb-5 overflow-hidden bg-white">
            <div className="p-4 p-md-5 text-white" style={{ background: 'linear-gradient(135deg, var(--slate-900) 0%, #064e3b 100%)' }}>
              <div className="row align-items-center g-4">
                <div className="col-auto">
                  {portfolio.profilePicture ? (
                    <img
                      src={`http://localhost:5000${portfolio.profilePicture}`}
                      alt={portfolio.fullName}
                      className="rounded-circle border border-4 border-white shadow"
                      style={{ width: '130px', height: '130px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rounded-circle border border-4 border-white shadow bg-secondary d-flex align-items-center justify-content-center" style={{ width: '130px', height: '130px', fontSize: '3rem' }}>
                      👤
                    </div>
                  )}
                </div>
                <div className="col">
                  <h1 className="fw-bold mb-1">{portfolio.fullName}</h1>
                  <p className="lead opacity-75 mb-3">{portfolio.location || 'Developer'}</p>
                  <div className="d-flex flex-wrap gap-3">
                    {portfolio.email && (
                      <span className="small d-flex align-items-center gap-1">
                        <i className="bi bi-envelope-fill"></i> {portfolio.email}
                      </span>
                    )}
                    {portfolio.phoneNumber && (
                      <span className="small d-flex align-items-center gap-1">
                        <i className="bi bi-telephone-fill"></i> {portfolio.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              <div className="row g-4">
                <div className="col-lg-8">
                  <h4 className="fw-bold text-dark mb-3">About Me</h4>
                  <p className="text-muted leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                    {portfolio.aboutMe || 'No details provided yet.'}
                  </p>
                </div>
                <div className="col-lg-4 border-start-lg">
                  <h4 className="fw-bold text-dark mb-3">Links & Contacts</h4>
                  <div className="d-grid gap-2">
                    {portfolio.linkedinUrl && (
                      <a
                        href={portfolio.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2 rounded-3"
                      >
                        <i className="bi bi-linkedin"></i> LinkedIn Profile
                      </a>
                    )}
                    {portfolio.githubUrl && (
                      <a
                        href={portfolio.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-dark d-flex align-items-center justify-content-center gap-2 rounded-3"
                      >
                        <i className="bi bi-github"></i> GitHub Account
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card border-0 shadow-sm rounded-3 p-5 mb-5 text-center bg-white">
            <span className="fs-1 d-block mb-3">👤</span>
            <h4 className="fw-bold text-dark">Portfolio Not Setup</h4>
            <p className="text-muted mb-0">Fill out your profile details in the portfolio page to see them here.</p>
          </div>
        )}

        {/* Skills Section */}
        <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 mb-5 bg-white">
          <h3 className="fw-bold text-dark mb-4">Core Skills</h3>
          {skills.length === 0 ? (
            <p className="text-muted mb-0">No skills added yet.</p>
          ) : (
            <div className="row g-4">
              {['Advanced', 'Intermediate', 'Beginner'].map((level) => {
                const filtered = skills.filter((s) => s.skillLevel === level);
                if (filtered.length === 0) return null;
                return (
                  <div key={level} className="col-md-4">
                    <h5 className="fw-bold text-secondary mb-3">{level}</h5>
                    <div className="d-flex flex-wrap gap-2">
                      {filtered.map((skill) => (
                        <span
                          key={skill._id}
                          className={`badge rounded-pill px-3 py-2 fw-semibold ${
                            level === 'Advanced'
                              ? 'bg-success-subtle text-success'
                              : level === 'Intermediate'
                              ? 'bg-warning-subtle text-warning'
                              : 'bg-primary-subtle text-primary'
                          }`}
                        >
                          {skill.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Projects Showcase with search/filter */}
        <div className="card border-0 shadow-sm rounded-3 p-4 p-md-5 bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h3 className="fw-bold text-dark mb-0">Project Portfolio</h3>
            
            {/* Filter controls */}
            <div className="d-flex flex-wrap gap-2 flex-grow-1 justify-content-end">
              <input
                type="text"
                className="form-control bg-light border-0 px-3 py-2 rounded-3"
                style={{ maxWidth: '240px', fontSize: '0.9rem' }}
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select
                className="form-select bg-light border-0 py-2 rounded-3"
                style={{ maxWidth: '170px', fontSize: '0.9rem' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
                <option value="Uncategorized">Uncategorized</option>
              </select>
              <select
                className="form-select bg-light border-0 py-2 rounded-3"
                style={{ maxWidth: '170px', fontSize: '0.9rem' }}
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
              >
                <option value="">All Technologies</option>
                {allTechs.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <div className="text-center py-5">
              <span className="fs-1 d-block mb-2">💻</span>
              <p className="text-muted mb-0">No matching projects found. Adjust your search or filters.</p>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredProjects.map((project) => {
                const techStack = project.technologiesUsed
                  ? project.technologiesUsed.split(',').map((t) => t.trim()).filter(Boolean)
                  : [];
                return (
                  <div key={project._id} className="col">
                    <div className="card h-100 border border-light shadow-sm rounded-3 overflow-hidden">
                      {project.projectImage && (
                        <img
                          src={`http://localhost:5000${project.projectImage}`}
                          alt={project.projectTitle}
                          style={{ height: '170px', objectFit: 'cover', width: '100%' }}
                        />
                      )}
                      <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title fw-bold text-dark mb-0">{project.projectTitle}</h5>
                            <span className="badge bg-primary text-white ms-2" style={{ fontSize: '0.7rem' }}>
                              {project.category || 'Uncategorized'}
                            </span>
                          </div>
                          <p className="card-text text-muted small mb-3">
                            {project.description || 'No description provided.'}
                          </p>
                          {techStack.length > 0 && (
                            <div className="d-flex flex-wrap gap-1 mb-4">
                              {techStack.map((tech, idx) => (
                                <span key={idx} className="badge bg-light text-dark border px-2 py-1 rounded-3" style={{ fontSize: '0.75rem' }}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="d-flex gap-2">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-secondary btn-sm flex-grow-1"
                            >
                              <i className="bi bi-github"></i> GitHub
                            </a>
                          )}
                          {project.liveDemoLink && (
                            <a
                              href={project.liveDemoLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-success btn-sm flex-grow-1"
                            >
                              <i className="bi bi-box-arrow-up-right"></i> Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
