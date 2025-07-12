import React, { useState } from 'react';
import styled from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { ViewList, Work, Home, Person, School, CalendarToday, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  background: #111111;
  color: #ffffff;
  width: 280px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  border-right: 1px solid #222222;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Современный скроллбар */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #111111;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #333333;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #555555;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    height: 70px;
    bottom: 0;
    top: auto;
    padding: 0.75rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    border-right: none;
    border-top: 1px solid #222222;
    gap: 0.25rem;
    background: #000000;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
`;

const NavButton = styled.button`
  background: ${props => (props.active ? '#ffffff' : 'transparent')};
  color: ${props => (props.active ? '#000000' : '#ffffff')};
  border: none;
  padding: 1rem 1.25rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.95rem;
  font-weight: ${props => (props.active ? '600' : '400')};
  text-align: left;
  cursor: pointer;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isMobile ? 'center' : 'flex-start')};
  gap: 0.75rem;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  svg {
    font-size: 1.25rem;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  &:hover {
    background: ${props => (props.active ? '#ffffff' : '#222222')};
    color: ${props => (props.active ? '#000000' : '#ffffff')};
    transform: translateX(2px);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateX(1px) scale(0.98);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.75rem;
    font-size: 0;
    min-width: 48px;
    height: 48px;
    border-radius: 10px;
    transform: none;
    
    &:hover {
      transform: translateY(-2px);
      background: ${props => (props.active ? '#ffffff' : '#222222')};
    }
    
    &:active {
      transform: translateY(0) scale(0.95);
    }
    
    svg {
      font-size: 1.4rem;
    }
  }
`;

const LogoutButton = styled(NavButton)`
  margin-top: auto;
  background: #ff4444;
  color: #ffffff;
  font-weight: 500;
  
  &:hover {
    background: #ff3333;
    color: #ffffff;
    transform: translateX(2px);
  }
  
  &:active {
    transform: translateX(1px) scale(0.98);
  }
  
  @media (max-width: 768px) {
    margin-top: 0;
    
    &:hover {
      background: #ff3333;
      transform: translateY(-2px);
    }
    
    &:active {
      transform: translateY(0) scale(0.95);
    }
  }
`;

const CategoryText = styled.span`
  letter-spacing: -0.01em;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState('Все');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const categories = [
    { name: 'Все', icon: <ViewList />, path: '/all' },
    { name: 'Работа', icon: <Work />, path: '/work' },
    { name: 'Домашний', icon: <Home />, path: '/home' },
    { name: 'Личный', icon: <Person />, path: '/personal' },
    { name: 'Учеба', icon: <School />, path: '/study' },
    { name: 'Недельный', icon: <CalendarToday />, path: '/weekly' },
  ];

  const handleCategoryClick = (category, path) => {
    console.log('Sidebar.jsx - Selected category:', category, 'Navigating to:', path);
    setActiveCategory(category);
    navigate(path);
  };

  const handleLogout = () => {
    console.log('Sidebar.jsx - Logging out');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <SidebarContainer>
      {categories.map((category) => (
        <NavButton
          key={category.name}
          active={activeCategory === category.name}
          onClick={() => handleCategoryClick(category.name, category.path)}
          aria-label={`Выбрать категорию ${category.name}`}
          title={isMobile ? category.name : undefined}
          isMobile={isMobile}
        >
          {category.icon}
          <CategoryText>{category.name}</CategoryText>
        </NavButton>
      ))}
      <LogoutButton
        onClick={handleLogout}
        aria-label="Выйти"
        title={isMobile ? 'Выйти' : undefined}
        isMobile={isMobile}
      >
        <Logout />
        <CategoryText>Выйти</CategoryText>
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;