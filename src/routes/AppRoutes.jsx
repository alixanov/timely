import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import Login from '../components/login/Login';
import Sidebar from '../components/sidebar/Sidebar';
import Work from '../components/work/Work';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  console.log('ProtectedRoute - Token:', token);
  if (!token) {
    console.log('ProtectedRoute - No token found');
    toast.error('Пожалуйста, войдите в систему', {
      position: 'top-center',
      autoClose: 3000,
      style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' },
    });
    return <Navigate to="/login" />;
  }
  try {
    const decoded = jwtDecode(token);
    console.log('ProtectedRoute - Decoded token:', decoded);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.log('ProtectedRoute - Token expired:', decoded.exp, currentTime);
      localStorage.removeItem('token');
      toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' },
      });
      return <Navigate to="/login" />;
    }
    return children;
  } catch (err) {
    console.error('ProtectedRoute - Invalid token format:', err.message);
    localStorage.removeItem('token');
    toast.error('Ошибка токена. Пожалуйста, войдите снова.', {
      position: 'top-center',
      autoClose: 3000,
      style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Inter, sans-serif' },
    });
    return <Navigate to="/login" />;
  }
};

// Layout Component
const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
  background: #FFFFFF;
  color: #000000;
  @media (max-width: 768px) {
    margin-left: 0;
    margin-bottom: 60px;
    padding: 1rem;
  }
`;

const AppRoutes = () => {
  const [activeCategory, setActiveCategory] = useState('Все');

  const renderContent = () => {
    console.log('AppRoutes.jsx - Rendering category:', activeCategory);
    switch (activeCategory) {
      case 'Работа':
        return <Work />;
      default:
        return <div>Выберите категорию</div>;
    }
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/sidebar"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Sidebar setActiveCategory={setActiveCategory} />
              <ContentArea>{renderContent()}</ContentArea>
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;