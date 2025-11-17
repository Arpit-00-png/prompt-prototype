import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Exams = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    batch: user?.batch || ''
  });
  const [suggestionText, setSuggestionText] = useState({});

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      let res;
      if (user?.role === 'student' && user?.batch) {
        res = await axios.get(`/api/exams/batch/${user.batch}`);
      } else {
        res = await axios.get('/api/exams');
      }
      setExams(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exams:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/exams', formData);
      setShowForm(false);
      setFormData({
        title: '',
        subject: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        batch: user?.batch || ''
      });
      fetchExams();
      alert('Exam scheduled successfully!');
    } catch (error) {
      alert('Error scheduling exam: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSuggestion = async (examId) => {
    if (!suggestionText[examId]?.trim()) {
      alert('Please enter a suggestion');
      return;
    }
    try {
      await axios.post(`/api/exams/${examId}/suggestion`, {
        suggestion: suggestionText[examId]
      });
      setSuggestionText({ ...suggestionText, [examId]: '' });
      fetchExams();
      alert('Suggestion submitted successfully!');
    } catch (error) {
      alert('Error submitting suggestion: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  const upcomingExams = exams.filter(e => new Date(e.date) >= new Date());

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">📝 Exams</h1>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Schedule Exam'}
          </button>
        )}
      </div>

      {showForm && (user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="card">
          <h2>Schedule New Exam</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Exam Title"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Subject"
              className="input-field"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <input
              type="date"
              className="input-field"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <input
              type="time"
              className="input-field"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              className="input-field"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="input-field"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              type="text"
              placeholder="Batch"
              className="input-field"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
            />
            <button type="submit" className="btn-primary">Schedule Exam</button>
          </form>
        </div>
      )}

      <div className="exams-section">
        <h2 className="section-subtitle">Upcoming Exams ({upcomingExams.length})</h2>
        {exams.length === 0 ? (
          <div className="card">
            <p>No exams scheduled.</p>
          </div>
        ) : (
          <div className="exams-list">
            {exams.map((exam) => {
              const isUpcoming = new Date(exam.date) >= new Date();

              return (
                <div key={exam._id} className="card exam-card">
                  <div className="exam-header">
                    <h3>{exam.title}</h3>
                    <span className="exam-subject">{exam.subject}</span>
                  </div>
                  <div className="exam-details">
                    <div className="exam-detail-item">
                      <strong>📅 Date:</strong> {new Date(exam.date).toLocaleDateString()}
                    </div>
                    <div className="exam-detail-item">
                      <strong>⏰ Time:</strong> {exam.time}
                    </div>
                    {exam.duration && (
                      <div className="exam-detail-item">
                        <strong>⏱️ Duration:</strong> {exam.duration} minutes
                      </div>
                    )}
                    {exam.location && (
                      <div className="exam-detail-item">
                        <strong>📍 Location:</strong> {exam.location}
                      </div>
                    )}
                    {exam.batch && (
                      <div className="exam-detail-item">
                        <strong>👥 Batch:</strong> {exam.batch}
                      </div>
                    )}
                  </div>
                  <div className="suggestion-section">
                    <input
                      type="text"
                      placeholder="Suggest changes to timing or location..."
                      className="input-field"
                      value={suggestionText[exam._id] || ''}
                      onChange={(e) =>
                        setSuggestionText({ ...suggestionText, [exam._id]: e.target.value })
                      }
                    />
                    <button
                      onClick={() => handleSuggestion(exam._id)}
                      className="btn-secondary"
                    >
                      Submit Suggestion
                    </button>
                  </div>
                  {exam.suggestions && exam.suggestions.length > 0 && (
                    <div className="suggestions-list">
                      <strong>Suggestions:</strong>
                      {exam.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="suggestion-item">
                          <p>{suggestion.suggestion}</p>
                          <span className="suggestion-date">
                            {new Date(suggestion.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exams;

