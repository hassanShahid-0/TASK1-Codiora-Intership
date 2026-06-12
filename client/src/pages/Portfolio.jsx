import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Portfolio = () => {
  const [fullName, setFullName] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentPicture, setCurrentPicture] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get('/api/portfolio');
        if (res.data) {
          setFullName(res.data.fullName || '');
          setAboutMe(res.data.aboutMe || '');
          setEmail(res.data.email || '');
          setPhoneNumber(res.data.phoneNumber || '');
          setLocation(res.data.location || '');
          setLinkedinUrl(res.data.linkedinUrl || '');
          setGithubUrl(res.data.githubUrl || '');
          setCurrentPicture(res.data.profilePicture || '');
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError('Failed to load portfolio.');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('aboutMe', aboutMe);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('location', location);
    formData.append('linkedinUrl', linkedinUrl);
    formData.append('githubUrl', githubUrl);

    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const res = await api.post('/api/portfolio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Portfolio updated successfully!');
      setCurrentPicture(res.data.profilePicture || '');
      setProfilePicture(null);
      setPreviewUrl('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update portfolio.');
    } finally {
      setSaving(false);
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
      <h2 className="fw-bold mb-4 text-dark">Manage Portfolio</h2>
      
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
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-3 text-center p-4 bg-white">
            <div className="position-relative d-inline-block mx-auto mb-3">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile Preview"
                  className="rounded-circle object-fit-cover shadow"
                  style={{ width: '150px', height: '150px', border: '4px solid #fff' }}
                />
              ) : currentPicture ? (
                <img
                  src={currentPicture}
                  alt="Profile"
                  className="rounded-circle object-fit-cover shadow"
                  style={{ width: '150px', height: '150px', border: '4px solid #fff' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-light d-flex align-items-center justify-content-center text-muted shadow-sm mx-auto"
                  style={{ width: '150px', height: '150px', fontSize: '3.5rem', border: '4px solid #fff' }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
              )}
            </div>

            <h4 className="fw-bold mb-1">{fullName || 'Your Name'}</h4>
            <p className="text-muted small mb-3">
              <i className="bi bi-geo-alt-fill text-danger me-1"></i>
              {location || 'Location Not Specified'}
            </p>
            <hr />
            <div className="text-start px-2 mb-4" style={{ minHeight: '60px' }}>
              <span className="text-secondary fw-semibold small d-block mb-1">About Me:</span>
              <p className="text-dark small mb-0">
                {aboutMe || 'Introduce yourself in the about me section...'}
              </p>
            </div>
            <div className="d-flex justify-content-center gap-3 mt-4">
              {linkedinUrl && (
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                  <i className="bi bi-github"></i>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-3 p-4 bg-white">
            <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">Profile Information</h5>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="fullName" className="form-label text-muted small fw-bold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    placeholder="Enter full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="profilePicture" className="form-label text-muted small fw-bold">Profile Picture</label>
                  <input
                    type="file"
                    className="form-control"
                    id="profilePicture"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="aboutMe" className="form-label text-muted small fw-bold">About Me</label>
                  <textarea
                    className="form-control"
                    id="aboutMe"
                    rows="4"
                    placeholder="Describe your profile, experience, and interests..."
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <label htmlFor="email" className="form-label text-muted small fw-bold">Contact Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="contact@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="phoneNumber" className="form-label text-muted small fw-bold">Phone Number</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="+1 (234) 567-8900"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="location" className="form-label text-muted small fw-bold">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="linkedinUrl" className="form-label text-muted small fw-bold">LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="linkedinUrl"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="githubUrl" className="form-label text-muted small fw-bold">GitHub URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="githubUrl"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-top d-flex justify-content-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary px-4 py-2"
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
