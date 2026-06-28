import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [technologiesUsed, setTechnologiesUsed] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [liveDemoLink, setLiveDemoLink] = useState('');
  const [projectImageFile, setProjectImageFile] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterSkill, setFilterSkill] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        api.get('/api/projects'),
        api.get('/api/categories'),
      ]);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching projects page data:', err);
      setError('Failed to fetch required data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isModalOpen]);

  const openAddModal = () => {
    setEditingProject(null);
    setProjectTitle('');
    setCategory(categories.length > 0 ? categories[0].name : 'Uncategorized');
    setDescription('');
    setTechnologiesUsed('');
    setGithubLink('');
    setLiveDemoLink('');
    setProjectImageFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setProjectTitle(project.projectTitle);
    setCategory(project.category || 'Uncategorized');
    setDescription(project.description || '');
    setTechnologiesUsed(project.technologiesUsed || '');
    setGithubLink(project.githubLink || '');
    setLiveDemoLink(project.liveDemoLink || '');
    setProjectImageFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProjectImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!projectTitle) {
      setError('Project title is required.');
      return;
    }

    const formData = new FormData();
    formData.append('projectTitle', projectTitle);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('technologiesUsed', technologiesUsed);
    formData.append('githubLink', githubLink);
    formData.append('liveDemoLink', liveDemoLink);
    if (projectImageFile) {
      formData.append('projectImage', projectImageFile);
    }

    try {
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (editingProject) {
        await api.put(`/api/projects/${editingProject._id}`, formData, { headers });
        setSuccess('Project updated successfully!');
      } else {
        await api.post('/api/projects', formData, { headers });
        setSuccess('Project added successfully!');
      }
      fetchData();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/api/projects/${id}`);
        setSuccess('Project deleted successfully!');
        fetchData();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete project.');
      }
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Get all unique categories dynamically
  const uniqueCategories = [...new Set(projects.map((p) => p.category || 'Uncategorized'))];

  // Get all unique technology tags from projects for filtering
  const allTechs = [
    ...new Set(
      projects
        .flatMap((p) => (p.technologiesUsed ? p.technologiesUsed.split(',').map((t) => t.trim()).filter(Boolean) : []))
    ),
  ].sort();

  // Filter projects by search query, category, and skill/technology
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      (p.projectTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technologiesUsed || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === '' || (p.category || 'Uncategorized') === filterCategory;

    const projectTechs = p.technologiesUsed
      ? p.technologiesUsed.split(',').map((t) => t.trim().toLowerCase())
      : [];
    const matchesSkill = filterSkill === '' || projectTechs.includes(filterSkill.toLowerCase());

    return matchesSearch && matchesCategory && matchesSkill;
  });

  return (
    <div className="container-fluid p-4">
      {/* Header controls with Search & Filter */}
      <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-center mb-4 gap-3">
        <h2 className="fw-bold text-dark mb-0">Manage Projects</h2>
        
        <div className="d-flex flex-wrap gap-2 flex-grow-1 justify-content-xl-end">
          <input 
            type="text" 
            className="form-control" 
            style={{ maxWidth: '240px' }}
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="form-select" 
            style={{ maxWidth: '170px' }}
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            className="form-select" 
            style={{ maxWidth: '170px' }}
            value={filterSkill} 
            onChange={(e) => setFilterSkill(e.target.value)}
          >
            <option value="">All Technologies</option>
            {allTechs.map(tech => (
              <option key={tech} value={tech}>{tech}</option>
            ))}
          </select>
          <button onClick={openAddModal} className="btn btn-primary d-flex align-items-center justify-content-center gap-2 px-3 py-2 rounded-3 text-nowrap">
            <i className="bi bi-plus-circle"></i> Add New Project
          </button>
        </div>
      </div>

      {success && (
        <div className="alert alert-success alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-check-circle-fill me-2"></i> {success}
          <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show rounded-3" role="alert">
          <i className="bi bi-x-circle-fill me-2"></i> {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {filteredProjects.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <span className="fs-1 d-block mb-3">💻</span>
          <h4 className="fw-bold text-dark">No Projects Found</h4>
          <p className="text-muted small mb-4">Try adjusting your filters, or add a new project.</p>
          <button onClick={openAddModal} className="btn btn-primary btn-sm rounded-3">
            Add New Project
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredProjects.map((project) => (
            <div key={project._id} className="col">
              <ProjectCard project={project} onEdit={openEditModal} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="projectTitle" className="form-label text-muted small fw-bold">Project Title</label>
                      <input
                        type="text"
                        className="form-control"
                        id="projectTitle"
                        placeholder="e.g., E-Commerce App"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label text-muted small fw-bold">Category</label>
                      <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="Uncategorized">Uncategorized</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label htmlFor="projectImage" className="form-label text-muted small fw-bold">Project Image</label>
                      <input
                        type="file"
                        className="form-control"
                        id="projectImage"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <span className="text-muted small" style={{ fontSize: '0.85rem' }}>
                        Leave blank to retain previous image (if editing) or use default card placeholder.
                      </span>
                    </div>

                    <div className="col-12">
                      <label htmlFor="description" className="form-label text-muted small fw-bold">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="3"
                        placeholder="Provide details about the project features, structure, and challenge..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label htmlFor="technologiesUsed" className="form-label text-muted small fw-bold">Technologies Used (comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        id="technologiesUsed"
                        placeholder="e.g., React, Node.js, Express, MongoDB"
                        value={technologiesUsed}
                        onChange={(e) => setTechnologiesUsed(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="githubLink" className="form-label text-muted small fw-bold">GitHub Repository Link</label>
                      <input
                        type="url"
                        className="form-control"
                        id="githubLink"
                        placeholder="https://github.com/username/project"
                        value={githubLink}
                        onChange={(e) => setGithubLink(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="liveDemoLink" className="form-label text-muted small fw-bold">Live Demo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="liveDemoLink"
                        placeholder="https://myproject.com"
                        value={liveDemoLink}
                        onChange={(e) => setLiveDemoLink(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    {editingProject ? 'Save Changes' : 'Add Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
