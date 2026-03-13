import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/authContext';
import PrivateRoute from './components/PrivateRoute';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e1e2a',
            color: '#f0eff8',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1e1e2a' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1e1e2a' } },
        }}
      />
    </AuthProvider>
  );
}