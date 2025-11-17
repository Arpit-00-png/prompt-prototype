import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Interaction from './pages/Interaction';
import Reports from './pages/Reports';
import Library from './pages/Library';
import Canteen from './pages/Canteen';
import Mess from './pages/Mess';
import Gym from './pages/Gym';
import Services from './pages/Services';
import Events from './pages/Events';
import Exams from './pages/Exams';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/resources"
              element={
                <PrivateRoute>
                  <Resources />
                </PrivateRoute>
              }
            />
            <Route
              path="/interaction"
              element={
                <PrivateRoute>
                  <Interaction />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/library"
              element={
                <PrivateRoute>
                  <Library />
                </PrivateRoute>
              }
            />
            <Route
              path="/canteen"
              element={
                <PrivateRoute>
                  <Canteen />
                </PrivateRoute>
              }
            />
            <Route
              path="/mess"
              element={
                <PrivateRoute>
                  <Mess />
                </PrivateRoute>
              }
            />
            <Route
              path="/gym"
              element={
                <PrivateRoute>
                  <Gym />
                </PrivateRoute>
              }
            />
            <Route
              path="/services"
              element={
                <PrivateRoute>
                  <Services />
                </PrivateRoute>
              }
            />
            <Route
              path="/events"
              element={
                <PrivateRoute>
                  <Events />
                </PrivateRoute>
              }
            />
            <Route
              path="/exams"
              element={
                <PrivateRoute>
                  <Exams />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

