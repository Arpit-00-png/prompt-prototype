import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Reports = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  useEffect(() => {
    if (user?.role === 'student') {
      fetchQuestions();
      fetchFaculties();
    } else {
      fetchMyReports();
    }
  }, [user]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('/api/reports/questions');
      setQuestions(res.data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      // In a real app, you'd have an endpoint to get all teachers
      // For now, we'll use a placeholder
      setFaculties([]);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchMyReports = async () => {
    try {
      const res = await axios.get('/api/reports/faculty/me');
      setReports(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setLoading(false);
    }
  };

  const handleResponseChange = (index, value) => {
    setResponses({ ...responses, [index]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFaculty) {
      alert('Please select a faculty member');
      return;
    }

    const allResponses = questions.map((_, index) => responses[index] || '');
    if (allResponses.some(r => !r.trim())) {
      alert('Please answer all questions');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/reports/submit', {
        facultyId: selectedFaculty,
        responses: allResponses
      });
      alert('Feedback submitted successfully! Your response is anonymous.');
      setResponses({});
      setSelectedFaculty('');
    } catch (error) {
      alert('Error submitting feedback: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  if (user?.role === 'student') {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="section-title">📊 Anonymous Feedback</h1>
        </div>
        <div className="card">
          <p style={{ marginBottom: '24px', color: '#666' }}>
            Your feedback is completely anonymous. Help faculty improve by providing honest, constructive feedback.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Select Faculty Member:</label>
              <input
                type="text"
                placeholder="Faculty ID or Email"
                className="input-field"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                required
              />
            </div>
            {questions.map((question, index) => (
              <div key={index} className="form-group">
                <label>{question}</label>
                <textarea
                  className="input-field"
                  rows="4"
                  value={responses[index] || ''}
                  onChange={(e) => handleResponseChange(index, e.target.value)}
                  required
                  placeholder="Your answer..."
                />
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">📊 Your Feedback Reports</h1>
      </div>
      {reports.length === 0 ? (
        <div className="card">
          <p>No feedback reports available yet.</p>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report._id} className="card report-card">
              <div className="report-header">
                <h3>Feedback Report</h3>
                <span className="report-date">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              {report.generatedReport ? (
                <div className="report-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {report.generatedReport}
                  </pre>
                </div>
              ) : (
                <div className="report-content">
                  <h4>Responses:</h4>
                  {report.responses.map((response, idx) => (
                    <div key={idx} className="response-item">
                      <strong>{response.question}</strong>
                      <p>{response.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;

