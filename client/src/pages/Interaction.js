import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { sampleLeaderboard, getRankIcon, getAvatarColor } from '../data/sampleData';
import './Page.css';

const Interaction = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [interactions, setInteractions] = useState([]);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [students, setStudents] = useState([]);
  const [awardData, setAwardData] = useState({
    studentId: '',
    type: 'doubt',
    points: 10,
    description: ''
  });

  useEffect(() => {
    fetchLeaderboard();
    if (user?.role === 'student') {
      fetchMyInteractions();
    } else {
      fetchStudents();
    }
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('/api/interaction/leaderboard');
      // Merge with sample data for demo
      const combined = [...sampleLeaderboard, ...(res.data || [])]
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, 20);
      setLeaderboard(combined);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      // Use sample data if API fails
      setLeaderboard(sampleLeaderboard);
    }
  };

  const fetchMyInteractions = async () => {
    try {
      const res = await axios.get('/api/interaction/me');
      setInteractions(res.data);
    } catch (error) {
      console.error('Error fetching interactions:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/auth/me');
      // In a real app, you'd have an endpoint to get all students
      // For now, we'll use a placeholder
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleAwardPoints = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/interaction/award', awardData);
      setShowAwardForm(false);
      setAwardData({
        studentId: '',
        type: 'doubt',
        points: 10,
        description: ''
      });
      fetchLeaderboard();
      alert('Points awarded successfully!');
    } catch (error) {
      alert('Error awarding points: ' + (error.response?.data?.message || error.message));
    }
  };

  const myRank = leaderboard.findIndex(s => s.id === user?.id || s._id === user?.id) + 1;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="section-title">Class Interaction</h1>
          <p className="page-subtitle">Earn points for participation and climb the leaderboard!</p>
        </div>
        {user?.role === 'teacher' && (
          <button onClick={() => setShowAwardForm(!showAwardForm)} className="btn-primary">
            {showAwardForm ? 'Cancel' : 'Award Points'}
          </button>
        )}
      </div>

      {user?.role === 'student' && (
        <div className="card my-stats">
          <h2>Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Total Points</span>
              <span className="stat-value">⭐ {user?.points || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rank</span>
              <span className="stat-value">#{myRank || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Interactions</span>
              <span className="stat-value">{interactions.length}</span>
            </div>
          </div>
        </div>
      )}

      {showAwardForm && user?.role === 'teacher' && (
        <div className="card">
          <h2>Award Points to Student</h2>
          <form onSubmit={handleAwardPoints}>
            <input
              type="text"
              placeholder="Student ID or Email"
              className="input-field"
              value={awardData.studentId}
              onChange={(e) => setAwardData({ ...awardData, studentId: e.target.value })}
              required
            />
            <select
              className="input-field"
              value={awardData.type}
              onChange={(e) => setAwardData({ ...awardData, type: e.target.value })}
            >
              <option value="doubt">Doubt</option>
              <option value="quiz">Quiz</option>
              <option value="academic">Academic</option>
              <option value="participation">Participation</option>
            </select>
            <input
              type="number"
              placeholder="Points"
              className="input-field"
              value={awardData.points}
              onChange={(e) => setAwardData({ ...awardData, points: parseInt(e.target.value) })}
              required
              min="1"
            />
            <textarea
              placeholder="Description (optional)"
              className="input-field"
              rows="3"
              value={awardData.description}
              onChange={(e) => setAwardData({ ...awardData, description: e.target.value })}
            />
            <button type="submit" className="btn-primary">Award Points</button>
          </form>
        </div>
      )}

      <div className="leaderboard-section">
        <h2 className="section-subtitle">
          <span className="star-icon">⭐</span> Leaderboard
        </h2>
        <div className="card leaderboard-card">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 20).map((student, index) => {
                const rank = index + 1;
                const rankIcon = getRankIcon(rank);
                const avatarColor = getAvatarColor(student.name);
                const initials = student.avatar || student.name.split(' ').map(n => n[0]).join('').toUpperCase();
                const isCurrentUser = (student.id === user?.id || student._id === user?.id);
                
                return (
                  <tr key={student.id || student._id} className={isCurrentUser ? 'my-rank-row' : ''}>
                    <td className="rank-cell">
                      {rankIcon ? (
                        <span className="rank-icon">{rankIcon}</span>
                      ) : (
                        <span className="rank-number">{rank}</span>
                      )}
                    </td>
                    <td className="student-cell">
                      <div className="student-info">
                        <div 
                          className="student-avatar" 
                          style={{ backgroundColor: avatarColor }}
                        >
                          {initials}
                        </div>
                        <span className="student-name">{student.name}</span>
                      </div>
                    </td>
                    <td className="points-cell">
                      <span className="points-value">⭐ {student.points || 0}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {user?.role === 'student' && interactions.length > 0 && (
        <div className="interactions-section">
          <h2 className="section-subtitle">Your Interaction History</h2>
          <div className="interactions-list">
            {interactions.map((interaction) => (
              <div key={interaction._id} className="card interaction-item">
                <div className="interaction-header">
                  <span className="interaction-type">{interaction.type.toUpperCase()}</span>
                  <span className="interaction-points">+{interaction.points} pts</span>
                </div>
                {interaction.description && <p>{interaction.description}</p>}
                <div className="interaction-footer">
                  <span>Awarded by: {interaction.awardedBy?.name}</span>
                  <span>{new Date(interaction.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interaction;

