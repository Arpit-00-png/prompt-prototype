import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Page.css';

const Library = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: 1
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get('/api/library');
      setBooks(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }
    try {
      const res = await axios.get(`/api/library/search?query=${searchQuery}`);
      setBooks(res.data.books);
      if (res.data.agentMessage) {
        console.log('Agent:', res.data.agentMessage);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/library', formData);
      setBooks([res.data.book, ...books]);
      setShowAddForm(false);
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: '',
        totalCopies: 1
      });
      if (res.data.agentMessage) {
        alert(`Agent: ${res.data.agentMessage}`);
      }
    } catch (error) {
      alert('Error adding book: ' + (error.response?.data?.message || error.message));
    }
  };

  const availableBooks = books.filter(b => b.available && b.availableCopies > 0);

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="section-title">📖 Library</h1>
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn-primary">
            {showAddForm ? 'Cancel' : 'Add Book'}
          </button>
        )}
      </div>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search books by title, author, or category..."
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className="btn-secondary">Search</button>
        </div>
      </div>

      {showAddForm && (user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="card">
          <h2>Add New Book</h2>
          <form onSubmit={handleAddBook}>
            <input
              type="text"
              placeholder="Title"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Author"
              className="input-field"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="ISBN (optional)"
              className="input-field"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
            />
            <input
              type="text"
              placeholder="Category"
              className="input-field"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <input
              type="number"
              placeholder="Total Copies"
              className="input-field"
              value={formData.totalCopies}
              onChange={(e) => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
              min="1"
              required
            />
            <button type="submit" className="btn-primary">Add Book</button>
          </form>
        </div>
      )}

      <div className="books-section">
        <h2 className="section-subtitle">Available Books ({availableBooks.length})</h2>
        <div className="books-grid">
          {books.length === 0 ? (
            <div className="card">
              <p>No books found.</p>
            </div>
          ) : (
            books.map((book) => (
              <div key={book._id} className="card book-card">
                <h3>{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.category && <span className="book-category">{book.category}</span>}
                <div className="book-availability">
                  <span className={book.available && book.availableCopies > 0 ? 'available' : 'unavailable'}>
                    {book.available && book.availableCopies > 0
                      ? `✓ ${book.availableCopies} available`
                      : '✗ Not available'}
                  </span>
                </div>
                {book.isbn && <p className="book-isbn">ISBN: {book.isbn}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Library;

