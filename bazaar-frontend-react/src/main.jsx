import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import APIBazaar from './APIBazaar.jsx'
import APIPlayground from './APIPlayground.jsx'
import AnalyticsDashboard from './AnalyticsDashboard.jsx'
import { LoginPage, SignupPage } from './Auth.jsx'
import './index.css'

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    return isAuthenticated ? <Navigate to="/" replace /> : children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
                <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
                <Route path="/" element={<ProtectedRoute><APIBazaar /></ProtectedRoute>} />
                <Route path="/playground" element={<ProtectedRoute><APIPlayground /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
