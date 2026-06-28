import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const res = await api.post('/api/categories', { name: newCategoryName });
      setCategories([...categories, res.data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName('');
      setSuccess('Category created successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create category.');
    }
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setEditingName(category.name);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingName('');
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!editingName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }

    try {
      const res = await api.put(`/api/categories/${editingCategory._id}`, { name: editingName });
      setCategories(
        categories
          .map((cat) => (cat._id === editingCategory._id ? res.data : cat))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingCategory(null);
      setEditingName('');
      setSuccess('Category updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? Projects using this category will display "Uncategorized".')) {
      setError('');
      setSuccess('');
      try {
        await api.delete(`/api/categories/${id}`);
        setCategories(categories.filter((cat) => cat._id !== id));
        setSuccess('Category deleted successfully!');
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to delete category.');
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
        <h2 className="fw-bold text-dark mb-0">Project Categories</h2>
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

      <div className="row g-4">
        {/* Left Side: Create / Edit Form */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 className="fw-bold text-dark mb-3">
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h5>
            
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <div className="mb-4">
                <label htmlFor="categoryName" className="form-label text-muted small fw-bold">
                  Category Name
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  id="categoryName"
                  placeholder="e.g., Web App, Mobile App, Game Dev"
                  value={editingCategory ? editingName : newCategoryName}
                  onChange={(e) => editingCategory ? setEditingName(e.target.value) : setNewCategoryName(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1 rounded-3 py-2 fw-bold">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
                {editingCategory && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-outline-secondary rounded-3 py-2 px-3"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Category List */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 bg-white p-4">
            <h5 className="fw-bold text-dark mb-4">Available Categories</h5>
            
            {categories.length === 0 ? (
              <div className="text-center py-5">
                <span className="fs-1 d-block mb-2">🏷️</span>
                <p className="text-muted mb-0">No categories found. Create one to begin organizing your projects.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th className="text-muted small fw-bold border-bottom-0 pb-3" style={{ width: '70%' }}>Name</th>
                      <th className="text-muted small fw-bold border-bottom-0 pb-3 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category._id}>
                        <td className="fw-semibold text-dark border-bottom">{category.name}</td>
                        <td className="text-end border-bottom">
                          <button
                            onClick={() => handleStartEdit(category)}
                            className="btn btn-outline-primary btn-sm me-2 rounded-3 px-3 py-1"
                          >
                            <i className="bi bi-pencil-square me-1"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="btn btn-outline-danger btn-sm rounded-3 px-3 py-1"
                          >
                            <i className="bi bi-trash me-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
