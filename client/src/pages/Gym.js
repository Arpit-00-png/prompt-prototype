import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Gym = () => {
  const { user } = useAuth();
  const [gymInfo, setGymInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGymInfo();
  }, []);

  const fetchGymInfo = async () => {
    try {
      const res = await axios.get('/api/gym/info');
      setGymInfo(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gym info:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">💪 Gym</h1>
      </div>
      {gymInfo && (
        <div className="card">
          <h2>Gym Information</h2>
          <div className="gym-info">
            <div className="info-item">
              <strong>Status:</strong> <span className={gymInfo.status === 'Open' ? 'status-open' : 'status-closed'}>{gymInfo.status}</span>
            </div>
            <div className="info-item">
              <strong>Hours:</strong> {gymInfo.hours}
            </div>
            <div className="info-item">
              <strong>Available Equipment:</strong>
              <ul className="equipment-list">
                {gymInfo.equipment?.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gym;

