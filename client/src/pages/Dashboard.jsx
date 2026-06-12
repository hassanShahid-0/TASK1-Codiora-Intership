import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [skillsCount, setSkillsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [portfolioExists, setPortfolioExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [skillsRes, projectsRes, portfolioRes] = await Promise.all([
          api.get('/api/skills'),
          api.get('/api/projects'),
          api.get('/api/portfolio')
        ]);
        
        setSkillsCount(skillsRes.data.length);
        setProjectsCount(projectsRes.data.length);
        setPortfolioExists(!!portfolioRes.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 bg-gradient-welcome text-white p-5 rounded-3 shadow-lg">
            <h1 className="fw-bold mb-2">Welcome Back, {user?.name}! 👋</h1>
            <p className="lead mb-0 opacity-75">
              Manage your personal brand, update your skills, and showcase your best projects here.
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 p-4 d-flex flex-row align-items-center gap-4 bg-white hover-card">
            <div className="stat-icon-emerald rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-person-badge fs-2"></i>
            </div>
            <div>
              <span className="text-muted small d-block mb-1">Portfolio Status</span>
              <span className={`fw-bold h5 mb-0 ${portfolioExists ? 'text-success' : 'text-warning'}`}>
                {portfolioExists ? 'Completed' : 'Not Created'}
              </span>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 p-4 d-flex flex-row align-items-center gap-4 bg-white hover-card">
            <div className="stat-icon-teal rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-journal-code fs-2"></i>
            </div>
            <div>
              <span className="text-muted small d-block mb-1">Total Skills</span>
              <h2 className="fw-bold text-dark mb-0">{skillsCount}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 p-4 d-flex flex-row align-items-center gap-4 bg-white hover-card">
            <div className="stat-icon-cyan rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
              <i className="bi bi-code-slash fs-2"></i>
            </div>
            <div>
              <span className="text-muted small d-block mb-1">Total Projects</span>
              <h2 className="fw-bold text-dark mb-0">{projectsCount}</h2>
            </div>
          </div>
        </div>
      </div>

      <h3 className="fw-bold mb-4">Quick Actions</h3>
      <div className="row g-4">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 bg-white hover-card">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-dark mb-2">Update Portfolio</h5>
                <p className="text-muted small mb-4">
                  Add contact info, social handles, and upload your profile picture.
                </p>
              </div>
              <Link to="/portfolio" className="btn btn-outline-primary w-100 rounded-3">
                Manage Portfolio
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 bg-white hover-card">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-dark mb-2">Manage Skills</h5>
                <p className="text-muted small mb-4">
                  Add, update, or remove technical skills to match your resume.
                </p>
              </div>
              <Link to="/skills" className="btn btn-outline-primary w-100 rounded-3">
                Manage Skills
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm rounded-3 bg-white hover-card">
            <div className="card-body p-4 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-dark mb-2">Showcase Projects</h5>
                <p className="text-muted small mb-4">
                  Add your recent project repositories, tech stack details, and live URLs.
                </p>
              </div>
              <Link to="/projects" className="btn btn-outline-primary w-100 rounded-3">
                Manage Projects
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
