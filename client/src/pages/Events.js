import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { sampleEvents } from '../data/sampleData';
import './Page.css';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    club: '',
    date: '',
    time: '',
    location: ''
  });
  const [suggestionText, setSuggestionText] = useState({});

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events');
      if (res.data && res.data.length > 0) {
        setEvents(res.data);
      } else {
        setEvents(sampleEvents);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents(sampleEvents);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        club: '',
        date: '',
        time: '',
        location: ''
      });
      fetchEvents();
      alert('Event created successfully!');
    } catch (error) {
      alert('Error creating event: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/register`);
      fetchEvents();
      alert('Registered successfully!');
    } catch (error) {
      alert('Error registering: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleVolunteer = async (eventId) => {
    try {
      await axios.post(`/api/events/${eventId}/volunteer`);
      fetchEvents();
      alert('Volunteered successfully!');
    } catch (error) {
      alert('Error volunteering: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSuggestion = async (eventId) => {
    if (!suggestionText[eventId]?.trim()) {
      alert('Please enter a suggestion');
      return;
    }
    try {
      await axios.post(`/api/events/${eventId}/suggestion`, {
        suggestion: suggestionText[eventId]
      });
      setSuggestionText({ ...suggestionText, [eventId]: '' });
      fetchEvents();
      alert('Suggestion submitted successfully!');
    } catch (error) {
      alert('Error submitting suggestion: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  const upcomingEvents = events.filter(e => new Date(e.date) >= new Date());

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="section-title">Events & Exams</h1>
          <p className="page-subtitle">Discover upcoming events, register, and get involved in campus life.</p>
        </div>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create Event'}
          </button>
        )}
      </div>

      {showForm && (user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="card">
          <h2>Create New Event</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Event Title"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="input-field"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Club/Organization"
              className="input-field"
              value={formData.club}
              onChange={(e) => setFormData({ ...formData, club: e.target.value })}
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
              type="text"
              placeholder="Location"
              className="input-field"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <button type="submit" className="btn-primary">Create Event</button>
          </form>
        </div>
      )}

      <div className="events-section">
        {events.length === 0 ? (
          <div className="card">
            <p>No events available.</p>
          </div>
        ) : (
          <div className="events-grid">
            {events.map((event) => {
              const eventId = event._id || event.id;
              const isRegistered = event.registered?.some(r => r._id === user?.id || r === user?.id);
              const isVolunteer = event.volunteers?.some(v => v._id === user?.id || v === user?.id);
              const isUpcoming = new Date(event.date) >= new Date();
              const eventDate = new Date(event.date);
              const formattedDate = eventDate.toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              });

              return (
                <div key={eventId} className="card event-card">
                  <div className="event-image-placeholder" data-event={event.image || 'default'}>
                    <div className="event-image-overlay"></div>
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <span className="event-date">📅 {formattedDate}</span>
                      <span className="event-club">
                        {event.club === 'Music Club' ? '🎵' : event.club === 'Coding Club' ? '💻' : '🏃'} {event.club}
                      </span>
                    </div>
                    <p className="event-description">{event.description}</p>
                    {isUpcoming && (
                      <div className="event-actions">
                        {!isRegistered ? (
                          <button
                            onClick={() => handleRegister(eventId)}
                            className="btn-primary event-btn"
                          >
                            ✏️ Register
                          </button>
                        ) : (
                          <span className="registered-badge">✓ Registered</span>
                        )}
                        {!isVolunteer ? (
                          <button
                            onClick={() => handleVolunteer(eventId)}
                            className="btn-secondary event-btn"
                          >
                            ✋ Volunteer
                          </button>
                        ) : (
                          <span className="volunteer-badge">✓ Volunteering</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;

