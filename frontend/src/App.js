import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import History from './pages/History';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {user && <Navbar />}
      <Routes>
        <Route 
          path="/home" 
          element={<Home />} 
        />
        <Route 
          path="/signin" 
          element={user ? <Navigate to="/dashboard" /> : <SignIn />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" /> : <SignUp />} 
        />
        <Route 
          path="/dashboard" 
          element={user ? <Dashboard /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/reports" 
          element={user ? <Reports /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/history" 
          element={user ? <History /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/profile" 
          element={user ? <Profile /> : <Navigate to="/home" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to="/home" />} 
        />
      </Routes>
    </div>
  );
}

export default App;