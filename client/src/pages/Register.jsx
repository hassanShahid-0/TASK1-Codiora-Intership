import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSubmitError('');

    if (!name || !email || !password || !confirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/');
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100 py-5">
      <div className="card shadow-lg border-0 rounded-3 overflow-hidden" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="card-body p-5 bg-white">
          <div className="text-center mb-4">
            <span className="fs-1">🌱</span>
            <h2 className="fw-bold text-dark mt-2">Join GrowthHub</h2>
            <p className="text-muted">Register to build your professional growth space</p>
          </div>

          {validationError && (
            <div className="alert alert-danger py-2 px-3 mb-3" role="alert" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {validationError}
            </div>
          )}

          {submitError && (
            <div className="alert alert-danger py-2 px-3 mb-3" role="alert" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-x-circle-fill me-2"></i>
              {submitError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                <input
                  type="text"
                  className="form-control bg-light"
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control bg-light"
                  id="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control bg-light"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label text-secondary fw-semibold mb-1" style={{ fontSize: '0.85rem' }}>
                Confirm Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted"><i className="bi bi-lock-fill"></i></span>
                <input
                  type="password"
                  className="form-control bg-light"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 rounded-3 fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <div className="text-center mt-4 pt-2 border-top">
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-bold text-decoration-none">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
