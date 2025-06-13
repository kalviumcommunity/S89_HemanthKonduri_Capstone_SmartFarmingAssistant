import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Context & Protected Route
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page Imports
import Landingpage from './pages/Landingpage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Homepage from './pages/Homepage';
import GoogleCallback from './pages/GoogleCallback';
import ForgotPassword from './pages/forgotPassword';
import ChatWindow from './pages/ChatWindow';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';

function App() {
  const { user, loading } = useAuth();

  // Wait until the authentication status is confirmed
  if (loading) {
    return <div>Loading Application...</div>;
  }

  return (
    <Routes>
      {/* Public Routes: Redirect if logged in */}
      <Route path='/' element={!user ? <Landingpage /> : <Navigate to="/homepage" />} />
      <Route path='/signin' element={!user ? <Signin /> : <Navigate to="/homepage" />} />
      <Route path='/signup' element={!user ? <Signup /> : <Navigate to="/homepage" />} />
      <Route path='/forgotPassword' element={!user ? <ForgotPassword /> : <Navigate to="/homepage" />} />
      
      {/* This callback route should remain public */}
      <Route path='/google-callback' element={<GoogleCallback />} />

      {/* Protected Routes: Require authentication */}
      <Route path='/homepage' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
      <Route path='/chatwindows' element={<ProtectedRoute><ChatWindow /></ProtectedRoute>} />
      <Route path='/diseasedetection' element={<ProtectedRoute><DiseaseDetectionPage /></ProtectedRoute>} />

      {/* Add other protected routes here similarly */}
      {/* <Route path='/marketprices' element={<ProtectedRoute><MarketPricesPage /></ProtectedRoute>} /> */}

      {/* Fallback route for any other path */}
      <Route path="*" element={<Navigate to={user ? "/homepage" : "/"} />} />
    </Routes>
  );
}

export default App;