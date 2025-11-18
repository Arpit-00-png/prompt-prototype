import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Mess = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [menuFormData, setMenuFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: [{ name: '', category: '' }]
  });
  const [proposalFormData, setProposalFormData] = useState({
    items: [{ name: '', category: '', reason: '' }]
  });

  useEffect(() => {
    fetchTodayMenu();
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchProposals();
    }
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const res = await axios.get('/api/mess/menu/today');
      setMenu(res.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await axios.get('/api/mess/proposals');
      setProposals(res.data);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    }
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      const items = menuFormData.items
        .filter(item => item.name.trim())
        .map(item => ({
          name: item.name,
          category: item.category
        }));
      
      await axios.post('/api/mess/menu', {
        date: menuFormData.date,
        items
      });
      setShowMenuForm(false);
      fetchTodayMenu();
      alert('Menu updated successfully!');
    } catch (error) {
      alert('Error updating menu: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    try {
      const items = proposalFormData.items
        .filter(item => item.name.trim())
        .map(item => ({
          name: item.name,
          category: item.category,
          reason: item.reason
        }));
      
      await axios.post('/api/mess/proposal', { items });
      setShowProposalForm(false);
      fetchProposals();
      alert('Proposal submitted successfully!');
    } catch (error) {
      alert('Error submitting proposal: ' + (error.response?.data?.message || error.message));
    }
  };

  const addMenuItem = () => {
    setMenuFormData({
      ...menuFormData,
      items: [...menuFormData.items, { name: '', category: '' }]
    });
  };

  const addProposalItem = () => {
    setProposalFormData({
      ...proposalFormData,
      items: [...proposalFormData.items, { name: '', category: '', reason: '' }]
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">🍽️ Mess</h1>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button onClick={() => setShowMenuForm(!showMenuForm)} className="btn-primary">
            {showMenuForm ? 'Cancel' : 'Update Menu'}
          </button>
        )}
        <button onClick={() => setShowProposalForm(!showProposalForm)} className="btn-secondary">
          {showProposalForm ? 'Cancel' : 'Submit Proposal'}
        </button>
      </div>

      {showMenuForm && (user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="card">
          <h2>Update Today's Menu</h2>
          <form onSubmit={handleMenuSubmit}>
            <input
              type="date"
              className="input-field"
              value={menuFormData.date}
              onChange={(e) => setMenuFormData({ ...menuFormData, date: e.target.value })}
              required
            />
            {menuFormData.items.map((item, idx) => (
              <div key={idx} className="menu-item-form">
                <input
                  type="text"
                  placeholder="Item Name"
                  className="input-field"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...menuFormData.items];
                    newItems[idx].name = e.target.value;
                    setMenuFormData({ ...menuFormData, items: newItems });
                  }}
                />
                <input
                  type="text"
                  placeholder="Category (Breakfast/Lunch/Dinner)"
                  className="input-field"
                  value={item.category}
                  onChange={(e) => {
                    const newItems = [...menuFormData.items];
                    newItems[idx].category = e.target.value;
                    setMenuFormData({ ...menuFormData, items: newItems });
                  }}
                />
              </div>
            ))}
            <button type="button" onClick={addMenuItem} className="btn-secondary">
              Add Item
            </button>
            <button type="submit" className="btn-primary">Update Menu</button>
          </form>
        </div>
      )}

      {showProposalForm && (
        <div className="card">
          <h2>Submit Menu Proposal</h2>
          <form onSubmit={handleProposalSubmit}>
            {proposalFormData.items.map((item, idx) => (
              <div key={idx} className="menu-item-form">
                <input
                  type="text"
                  placeholder="Item Name"
                  className="input-field"
                  value={item.name}
                  onChange={(e) => {
                    const newItems = [...proposalFormData.items];
                    newItems[idx].name = e.target.value;
                    setProposalFormData({ ...proposalFormData, items: newItems });
                  }}
                />
                <input
                  type="text"
                  placeholder="Category"
                  className="input-field"
                  value={item.category}
                  onChange={(e) => {
                    const newItems = [...proposalFormData.items];
                    newItems[idx].category = e.target.value;
                    setProposalFormData({ ...proposalFormData, items: newItems });
                  }}
                />
                <textarea
                  placeholder="Reason for proposal"
                  className="input-field"
                  rows="2"
                  value={item.reason}
                  onChange={(e) => {
                    const newItems = [...proposalFormData.items];
                    newItems[idx].reason = e.target.value;
                    setProposalFormData({ ...proposalFormData, items: newItems });
                  }}
                />
              </div>
            ))}
            <button type="button" onClick={addProposalItem} className="btn-secondary">
              Add Item
            </button>
            <button type="submit" className="btn-primary">Submit Proposal</button>
          </form>
        </div>
      )}

      <div className="menu-section">
        <h2 className="section-subtitle">Today's Menu</h2>
        {menu && menu.items ? (
          <div className="card">
            <div className="menu-items">
              {menu.items.map((item, idx) => (
                <div key={idx} className="menu-item">
                  <div className="menu-item-header">
                    <h4>{item.name}</h4>
                  </div>
                  {item.category && <span className="menu-category">{item.category}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="card">
            <p>No menu available for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mess;

