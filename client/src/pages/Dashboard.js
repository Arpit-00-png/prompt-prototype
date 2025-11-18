import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const studentCards = [
    { 
      title: 'Resources Hub', 
      link: '/resources', 
      icon: '📚', 
      desc: 'Access notes, presentations, and books.',
      image: 'library'
    },
    { 
      title: 'Interaction', 
      link: '/interaction', 
      icon: '💬', 
      desc: 'Engage with faculty and view Leaderboards.',
      image: 'classroom'
    },
    { 
      title: 'Faculty Feedback', 
      link: '/reports', 
      icon: '📊', 
      desc: 'Provide anonymous feedback to improve teaching.',
      image: 'feedback'
    },
    { 
      title: 'Campus Services', 
      link: '/services', 
      icon: '🍔', 
      desc: 'Library, canteen, gym info and more.',
      image: 'services'
    },
    { 
      title: 'Events & Exams', 
      link: '/events', 
      icon: '🎉', 
      desc: 'Stay updated on all campus happenings.',
      image: 'events'
    }
  ];

  const teacherCards = [
    { 
      title: 'Resources Hub', 
      link: '/resources', 
      icon: '📚', 
      desc: 'Upload and manage course materials.',
      image: 'library'
    },
    { 
      title: 'Interaction', 
      link: '/interaction', 
      icon: '💬', 
      desc: 'Award points and track student engagement.',
      image: 'classroom'
    },
    { 
      title: 'Faculty Feedback', 
      link: '/reports', 
      icon: '📊', 
      desc: 'View feedback reports and improve teaching.',
      image: 'feedback'
    },
    { 
      title: 'Campus Services', 
      link: '/services', 
      icon: '🍔', 
      desc: 'Manage library, canteen, and gym services.',
      image: 'services'
    },
    { 
      title: 'Events & Exams', 
      link: '/events', 
      icon: '🎉', 
      desc: 'Create and manage events and exams.',
      image: 'events'
    }
  ];

  const cards = user?.role === 'student' ? studentCards : teacherCards;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome to CampusExe</h1>
          <p className="dashboard-subtitle">Your friendly campus assistant.</p>
        </div>
        {user?.role === 'student' && (
          <div className="points-display">
            <span className="points-label">Your Points:</span>
            <span className="points-value">⭐ {user?.points || 0}</span>
          </div>
        )}
      </div>
      <div className="dashboard-grid">
        {cards.map((card, index) => (
          <Link key={index} to={card.link} className="dashboard-card">
            <div className="card-image-placeholder" data-image={card.image}>
              <div className="card-image-overlay"></div>
            </div>
            <div className="card-content">
              <div className="card-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
              <div className="card-arrow">→</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

