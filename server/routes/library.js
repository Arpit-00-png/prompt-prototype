const express = require('express');
const Book = require('../models/Book');
const { auth } = require('../middleware/auth');
const { libraryAgent } = require('../utils/geminiAgent');

const router = express.Router();

// Add book (Admin/Teacher)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { title, author, isbn, category, totalCopies } = req.body;

    const book = new Book({
      title,
      author,
      isbn,
      category,
      totalCopies: totalCopies || 1,
      availableCopies: totalCopies || 1
    });

    await book.save();

    // Agent notification
    const agentResponse = await libraryAgent('book_added', { title, author });

    res.json({ book, agentMessage: agentResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all books
router.get('/', auth, async (req, res) => {
  try {
    const books = await Book.find().sort({ title: 1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search books
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const books = await Book.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });

    // Agent can provide recommendations
    const agentResponse = await libraryAgent('book_search', { query, results: books.length });

    res.json({ books, agentMessage: agentResponse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get available books
router.get('/available', auth, async (req, res) => {
  try {
    const books = await Book.find({ available: true, availableCopies: { $gt: 0 } });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update book availability
router.put('/:id/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { availableCopies } = req.body;
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    book.availableCopies = availableCopies;
    book.available = availableCopies > 0;

    await book.save();
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

