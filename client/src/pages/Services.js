import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { sampleMenu, sampleLibraryBooks } from '../data/sampleData';
import './Page.css';

const Services = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [books, setBooks] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { type: 'agent', message: 'Hello! I\'m the Campus Services agent. Ask me about the library, canteen, or gym.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    fetchTodayMenu();
    fetchBooks();
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const res = await axios.get('/api/canteen/menu/today');
      if (res.data && res.data.items) {
        setMenu(res.data);
      } else {
        setMenu({ items: sampleMenu.lunch });
      }
    } catch (error) {
      setMenu({ items: sampleMenu.lunch });
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/library');
      if (res.data && res.data.length > 0) {
        setBooks(res.data);
      } else {
        setBooks(sampleLibraryBooks);
      }
    } catch (error) {
      setBooks(sampleLibraryBooks);
    }
  };

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
        message: 'I can help you with library books, canteen menus, and gym information. What would you like to know?' 
      };
      setChatMessages(prev => [...prev, agentResponse]);
    }, 500);
  };

  const newArrivals = books.filter(b => b.available).slice(0, 3);

  return (
    <div className="services-container">
      <div className="services-main">
        <div className="page-header">
          <div>
            <h1 className="section-title">Campus Services</h1>
            <p className="page-subtitle">Your portal for library, food, and fitness on campus. Ask the agent for more details!</p>
          </div>
        </div>

        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">📚</div>
            <h3>Library</h3>
            <div className="service-content">
              <p><strong>New Arrivals:</strong> {newArrivals.map(b => b.title).join(', ')}</p>
              <p className="service-prompt">Ask the agent about book availability!</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">🍽️</div>
            <h3>Canteen & Mess</h3>
            <div className="service-content">
              <p><strong>Lunch Menu:</strong> {menu?.items?.slice(0, 4).map(item => item.name).join(', ')}</p>
              <p className="service-prompt">Ask the agent for today's full menu!</p>
            </div>
          </div>

          <div className="service-card">
            <div className="service-icon">💪</div>
            <h3>Gym</h3>
            <div className="service-content">
              <p><strong>Timings:</strong> Mon-Sat: 6:00 AM - 10:00 PM, Sun: 8:00 AM - 8:00 PM</p>
              <p className="service-prompt">Ask the agent about available equipment!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="services-chat">
        <div className="chat-header">
          <div className="chat-icon">🤖</div>
          <h3>Services Agent</h3>
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
            placeholder="e.g., 'What's for lunch?'"
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

export default Services;

