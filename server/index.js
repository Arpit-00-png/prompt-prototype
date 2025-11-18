const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/resources', require('./routes/resources'));
app.use('/api/interaction', require('./routes/interaction'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/library', require('./routes/library'));
app.use('/api/canteen', require('./routes/canteen'));
app.use('/api/mess', require('./routes/mess'));
app.use('/api/gym', require('./routes/gym'));
app.use('/api/events', require('./routes/events'));
app.use('/api/exams', require('./routes/exams'));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campusexe', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

