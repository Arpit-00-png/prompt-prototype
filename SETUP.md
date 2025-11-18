# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Set up Environment Variables**
   - Copy `env.example` to `.env`
   - Add your MongoDB connection string
   - Add your Gemini API key (get it from https://makersuite.google.com/app/apikey)
   - Add a JWT secret key

3. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas (cloud) and update the connection string

4. **Run the Application**
   ```bash
   npm run dev
   ```
   - Backend will run on http://localhost:5000
   - Frontend will run on http://localhost:3000

## Getting Gemini API Key

1. Go to https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Create a new API key
4. Copy the key and add it to your `.env` file

## MongoDB Setup

### Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/campusexe`

### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

## First Time Setup

1. Register as a teacher/admin to create events, upload resources, etc.
2. Register as a student to access resources, earn points, etc.
3. Teachers can award points to students
4. Students can submit anonymous feedback

## Troubleshooting

- **MongoDB Connection Error**: Check if MongoDB is running and connection string is correct
- **Gemini API Error**: Verify API key is correct and has proper permissions
- **Port Already in Use**: Change PORT in `.env` or kill the process using the port
- **CORS Errors**: Make sure backend is running on port 5000 and frontend on port 3000

