import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SkillCard from '../components/SkillCard';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSkills = async () => {
    try {
      const res = await api.get('/api/skills');
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to fetch skills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
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
    setEditingSkill(null);
    setSkillName('');
    setSkillLevel('Beginner');
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setSkillName(skill.skillName);
    setSkillLevel(skill.skillLevel);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setSkillName('');
    setSkillLevel('Beginner');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!skillName || !skillLevel) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      if (editingSkill) {
        await api.put(`/api/skills/${editingSkill._id}`, { skillName, skillLevel });
        setSuccess('Skill updated successfully!');
      } else {
        await api.post('/api/skills', { skillName, skillLevel });
        setSuccess('Skill added successfully!');
      }
      fetchSkills();
      closeModal();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/api/skills/${id}`);
        setSuccess('Skill deleted successfully!');
        fetchSkills();
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete skill.');
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

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-dark mb-0">Manage Skills</h2>
        <button onClick={openAddModal} className="btn btn-primary d-flex align-items-center gap-2 px-3 py-2 rounded-3">
          <i className="bi bi-plus-circle"></i> Add New Skill
        </button>
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

      {skills.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border">
          <span className="fs-1 d-block mb-3">🛠️</span>
          <h4 className="fw-bold text-dark">No Skills Found</h4>
          <p className="text-muted small mb-4">Add your technical skills to showcase them on your profile</p>
          <button onClick={openAddModal} className="btn btn-primary btn-sm rounded-3">
            Add Your First Skill
          </button>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {skills.map((skill) => (
            <div key={skill._id} className="col">
              <SkillCard skill={skill} onEdit={openEditModal} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-3 shadow-lg">
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label htmlFor="skillName" className="form-label text-muted small fw-bold">Skill Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="skillName"
                      placeholder="e.g., React, Node.js, Python"
                      value={skillName}
                      onChange={(e) => setSkillName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="skillLevel" className="form-label text-muted small fw-bold">Skill Level</label>
                    <select
                      className="form-select"
                      id="skillLevel"
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      required
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-3" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    {editingSkill ? 'Save Changes' : 'Add Skill'}
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

export default Skills;
