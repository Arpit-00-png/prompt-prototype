import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { sampleMenu } from '../data/sampleData';
import './Page.css';

const Canteen = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [menuFormData, setMenuFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    items: [{ name: '', price: '', category: '' }]
  });
  const [proposalFormData, setProposalFormData] = useState({
    items: [{ name: '', price: '', category: '', reason: '' }]
  });

  useEffect(() => {
    fetchTodayMenu();
    if (user?.role === 'teacher' || user?.role === 'admin') {
      fetchProposals();
    }
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const res = await axios.get('/api/canteen/menu/today');
      if (res.data && res.data.items) {
        setMenu(res.data);
      } else {
        // Use sample data if no menu available
        setMenu({
          date: new Date(),
          items: sampleMenu.lunch
        });
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Use sample data on error
      setMenu({
        date: new Date(),
        items: sampleMenu.lunch
      });
    }
  };

  const fetchProposals = async () => {
    try {
      const res = await axios.get('/api/canteen/proposals');
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
          price: parseFloat(item.price) || 0,
          category: item.category
        }));
      
      await axios.post('/api/canteen/menu', {
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
          price: parseFloat(item.price) || 0,
          category: item.category,
          reason: item.reason
        }));
      
      await axios.post('/api/canteen/proposal', { items });
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
      items: [...menuFormData.items, { name: '', price: '', category: '' }]
    });
  };

  const addProposalItem = () => {
    setProposalFormData({
      ...proposalFormData,
      items: [...proposalFormData.items, { name: '', price: '', category: '', reason: '' }]
    });
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">🍔 Canteen</h1>
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
                  type="number"
                  placeholder="Price"
                  className="input-field"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...menuFormData.items];
                    newItems[idx].price = e.target.value;
                    setMenuFormData({ ...menuFormData, items: newItems });
                  }}
                />
                <input
                  type="text"
                  placeholder="Category"
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
                  type="number"
                  placeholder="Price"
                  className="input-field"
                  value={item.price}
                  onChange={(e) => {
                    const newItems = [...proposalFormData.items];
                    newItems[idx].price = e.target.value;
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
        <h2 className="section-subtitle">Lunch Menu</h2>
        {menu && menu.items ? (
          <div className="card menu-card">
            <div className="menu-items-list">
              {menu.items.map((item, idx) => (
                <div key={idx} className="menu-item-display">
                  <div className="menu-item-name">{item.name}</div>
                  {item.price && <div className="menu-item-price">₹{item.price}</div>}
                </div>
              ))}
            </div>
            <p className="menu-prompt">Ask the agent for today's full menu!</p>
          </div>
        ) : (
          <div className="card">
            <p>No menu available for today.</p>
          </div>
        )}
      </div>

      {(user?.role === 'teacher' || user?.role === 'admin') && proposals.length > 0 && (
        <div className="proposals-section">
          <h2 className="section-subtitle">Menu Proposals</h2>
          <div className="proposals-list">
            {proposals.map((proposal) => (
              <div key={proposal._id} className="card proposal-card">
                <div className="proposal-header">
                  <span>By: {proposal.proposedBy?.name || 'Unknown'}</span>
                  <span className={`status ${proposal.status}`}>{proposal.status}</span>
                </div>
                <div className="proposal-items">
                  {proposal.items.map((item, idx) => (
                    <div key={idx} className="proposal-item">
                      <strong>{item.name}</strong> - ₹{item.price}
                      {item.reason && <p className="proposal-reason">{item.reason}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Canteen;

