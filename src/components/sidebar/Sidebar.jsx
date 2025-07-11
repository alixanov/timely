import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMediaQuery } from '@mui/material';
import { ViewList, Work, Home, Person, School, CalendarToday, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const SidebarContainer = styled.div`
  background: #1A1A1A;
  color: #FFFFFF;
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Inter', sans-serif;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    bottom: 0;
    top: auto;
    padding: 0.5rem;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.2);
  }
`;

const NavButton = styled.button`
  background: ${props => (props.active ? '#4A4A4A' : 'transparent')};
  color: #FFFFFF;
  border: none;
  padding: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.3s ease, transform 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: ${props => (props.isMobile ? 'center' : 'flex-start')};
  &:hover {
    background: #4A4A4A;
    transform: scale(1.02);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
  }
  @media (max-width: 768px) {
    flex: 1;
    padding: 0.65rem;
    font-size: 0;
    min-width: 48px;
    height: 48px;
    svg {
      font-size: 1.5rem;
    }
  }
`;

const LogoutButton = styled(NavButton)`
  margin-top: auto;
  background: #FF0000;
  &:hover {
    background: #CC0000;
  }
  @media (max-width: 768px) {
    margin-top: 0;
  }
`;

const Sidebar = ({ setActiveCategory }) => {
  const [activeCategory, setLocalActiveCategory] = useState('Все');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();

  const categories = [
    { name: 'Все', icon: <ViewList /> },
    { name: 'Работа', icon: <Work /> },
    { name: 'Домашний', icon: <Home /> },
    { name: 'Личный', icon: <Person /> },
    { name: 'Учеба', icon: <School /> },
    { name: 'Недельный', icon: <CalendarToday /> },
  ];

  const handleCategoryClick = (category) => {
    console.log('Sidebar.jsx - Selected category:', category);
    setLocalActiveCategory(category);
    setActiveCategory(category);
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
          onClick={() => handleCategoryClick(category.name)}
          aria-label={`Выбрать категорию ${category.name}`}
          title={isMobile ? category.name : undefined}
          isMobile={isMobile}
        >
          {isMobile ? category.icon : category.name}
        </NavButton>
      ))}
      <LogoutButton
        onClick={handleLogout}
        aria-label="Выйти"
        title={isMobile ? 'Выйти' : undefined}
        isMobile={isMobile}
      >
        {isMobile ? <Logout /> : 'Выйти'}
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar;