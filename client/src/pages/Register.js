import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    studentId: '',
    batch: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await register(formData);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Join CampusExe</h1>
        <p className="auth-subtitle">Create your account</p>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="input-field"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input-field"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="input-field"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            className="input-field"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {formData.role === 'student' && (
            <>
              <input
                type="text"
                name="studentId"
                placeholder="Student ID"
                className="input-field"
                value={formData.studentId}
                onChange={handleChange}
              />
              <input
                type="text"
                name="batch"
                placeholder="Batch (e.g., 2024)"
                className="input-field"
                value={formData.batch}
                onChange={handleChange}
              />
            </>
          )}
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>
            Register
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

