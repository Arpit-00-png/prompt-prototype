import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Resources = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'note',
    fileUrl: '',
    batch: user?.batch || '',
    tags: ''
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      if (user?.role === 'teacher') {
        const res = await axios.get('/api/resources');
        setResources(res.data);
      } else if (user?.batch) {
        const res = await axios.get(`/api/resources/batch/${user.batch}`);
        setResources(res.data);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      const res = await axios.post('/api/resources', {
        ...formData,
        tags
      });
      setResources([res.data.resource, ...resources]);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        type: 'note',
        fileUrl: '',
        batch: user?.batch || '',
        tags: ''
      });
      if (res.data.agentMessage) {
        alert(`Agent: ${res.data.agentMessage}`);
      }
    } catch (error) {
      alert('Error uploading resource: ' + (error.response?.data?.message || error.message));
    }
  };

  const [chatMessages, setChatMessages] = useState([
    { type: 'agent', message: 'Hello! I\'m your AI Tutor. I can help you create a learning plan. What topic are you interested in?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = { type: 'user', message: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');

    // Simulate agent response
    setTimeout(() => {
      const agentResponse = { 
        type: 'agent', 
        message: 'I can help you with course notes, presentations, and recommended books. What would you like to learn about?' 
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 500);
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="resources-container">
      <div className="resources-main">
        <div className="page-header">
          <div>
            <h1 className="section-title">Resources Hub</h1>
            <p className="page-subtitle">Your digital library for course materials, managed by faculty. Ask the AI Tutor for a personalized learning plan!</p>
          </div>
          {user?.role === 'teacher' && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : 'Upload Resource'}
            </button>
          )}
        </div>

      {showForm && user?.role === 'teacher' && (
        <div className="card">
          <h2>Upload New Resource</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="input-field"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <select
              className="input-field"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="note">Note</option>
              <option value="ppt">PPT</option>
              <option value="book">Book</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="File URL or Link"
              className="input-field"
              value={formData.fileUrl}
              onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
            />
            <input
              type="text"
              placeholder="Batch"
              className="input-field"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Tags (comma separated)"
              className="input-field"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            />
            <button type="submit" className="btn-primary">Upload</button>
          </form>
        </div>
      )}

        <div className="available-resources-section">
          <h2 className="section-subtitle">Available Resources</h2>
          <p className="section-description">Here's a list of all the materials you can ask the AI Tutor about.</p>
          <div className="resources-list">
            <div className="resource-list-item">
              <div className="resource-list-icon">📄</div>
              <span className="resource-list-name">Course Notes</span>
              <span className="resource-list-arrow">▼</span>
            </div>
            <div className="resource-list-item">
              <div className="resource-list-icon">📊</div>
              <span className="resource-list-name">Presentations</span>
              <span className="resource-list-arrow">▼</span>
            </div>
            <div className="resource-list-item">
              <div className="resource-list-icon">📖</div>
              <span className="resource-list-name">Recommended Books</span>
              <span className="resource-list-arrow">▼</span>
            </div>
          </div>
        </div>
      </div>

      <div className="resources-chat">
        <div className="chat-header">
          <div className="chat-icon">🤖</div>
          <h3>AI Tutor</h3>
        </div>
        <div className="chat-messages">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`chat-message ${msg.type}`}>
              {msg.type === 'agent' && <div className="chat-avatar">🤖</div>}
              <div className="chat-bubble">{msg.message}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleChatSubmit} className="chat-input-form">
          <input
            type="text"
            placeholder="e.g., 'Help me with algorithms'"
            className="chat-input"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
          />
          <button type="submit" className="chat-send-btn">✈</button>
        </form>
      </div>
    </div>
  );
};

export default Resources;

