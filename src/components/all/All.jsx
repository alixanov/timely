import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Collapse,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AllContainer = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Inter', 'Roboto', sans-serif;
  background: #f9fafb;
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const PageTitle = styled(Typography)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SortContainer = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const StyledFormControl = styled(FormControl)`
  min-width: 150px;
  & .MuiOutlinedInput-root {
    background: #ffffff;
    border-radius: 12px;
    font-family: 'Inter', 'Roboto', sans-serif;
    font-size: 0.95rem;
    color: #1a1a1a;
    transition: all 0.3s ease;
    & fieldset {
      border-color: #d1d5db;
    }
    &:hover fieldset {
      border-color: #6b7280;
    }
    &.Mui-focused {
      background: #ffffff;
      & fieldset {
        border-color: #374151;
        border-width: 2px;
      }
    }
  }
  & .MuiInputLabel-root {
    font-family: 'Inter', 'Roboto', sans-serif;
    color: #6b7280;
    font-weight: 500;
    &.Mui-focused {
      color: #374151;
    }
  }
  & .MuiSelect-select {
    color: #1a1a1a;
  }
`;

const CategorySection = styled(Box)`
  margin-bottom: 2rem;
`;

const CategoryHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  }
`;

const CategoryTitle = styled(Typography)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const ExpandIcon = styled(ExpandMoreIcon)`
  transition: transform 0.3s ease;
  transform: ${props => (props.open ? 'rotate(180deg)' : 'rotate(0deg)')};
`;

const TasksContainer = styled(Box)`
  display: grid;
  gap: 1rem;
  padding: 1rem;
`;

const cardColors = [
  { bg: '#fff5f5', border: '#fed7d7', accent: '#e53e3e' },
  { bg: '#f7fafc', border: '#bee3f8', accent: '#3182ce' },
  { bg: '#f0fff4', border: '#c6f6d5', accent: '#38a169' },
  { bg: '#fffbeb', border: '#fbd38d', accent: '#dd6b20' },
  { bg: '#faf5ff', border: '#d6bcfa', accent: '#805ad5' },
  { bg: '#f0f9ff', border: '#bfdbfe', accent: '#0ea5e9' },
  { bg: '#ecfdf5', border: '#bbf7d0', accent: '#059669' },
  { bg: '#fef3c7', border: '#fde68a', accent: '#d97706' },
];

const TaskCard = styled(Card)`
  padding: 1.5rem;
  border-radius: 16px;
  background: ${props => props.cardColor?.bg || '#ffffff'};
  border: 2px solid ${props => props.cardColor?.border || '#e5e7eb'};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => props.cardColor?.accent || '#6b7280'};
  }
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  }
  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const TaskContent = styled(CardContent)`
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #1a1a1a;
  padding: 0 !important;
`;

const TaskTitle = styled(Typography)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const TaskDescription = styled(Typography)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
  line-height: 1.5;
`;

const TaskDate = styled(Typography)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 0.85rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
`;

const EmptyState = styled(Box)`
  text-align: center;
  padding: 3rem 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #6b7280;
  margin-top: 2rem;
  & h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #374151;
  }
  & p {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  min-height: 50vh;
`;

const All = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [expandedCategories, setExpandedCategories] = useState({
    Работа: true,
    Дом: true,
    Личный: true,
    Учеба: true,
    Недельный: true,
    'Без категории': true,
  });
  const navigate = useNavigate();
  const API_URL = 'https://timely-server-puce.vercel.app/api';

  const token = localStorage.getItem('token');
  console.log('All.jsx - Token:', token);

  useEffect(() => {
    let user = null;
    if (token) {
      try {
        user = jwtDecode(token);
        console.log('All.jsx - Decoded user:', user);
        const currentTime = Date.now() / 1000;
        if (user.exp < currentTime) {
          console.log('All.jsx - Token expired:', user.exp, currentTime);
          localStorage.removeItem('token');
          toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
            position: 'top-center',
            autoClose: 3000,
            style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
          });
          navigate('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('All.jsx - Invalid token:', err);
        localStorage.removeItem('token');
        toast.error('Ошибка токена. Пожалуйста, войдите снова.', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
        });
        navigate('/login');
      }
    } else {
      console.log('All.jsx - No token found, redirecting to login');
      toast.error('Пожалуйста, войдите в систему', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
      navigate('/login');
    }

    const fetchTasks = async () => {
      if (!user) return;
      const userEmail = user.email || '';
      if (!userEmail) {
        console.log('All.jsx - No user email, redirecting to login');
        toast.error('Пользователь не авторизован', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
        });
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        console.log('All.jsx - Fetching tasks from:', `${API_URL}/tasks`);
        const response = await fetch(`${API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('All.jsx - Fetch response status:', response.status);
        if (!response.ok) {
          const data = await response.json();
          console.log('All.jsx - Fetch error response:', data);
          if (response.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
              position: 'top-center',
              autoClose: 3000,
              style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
            });
            navigate('/login');
            return;
          }
          throw new Error(data.error || 'Ошибка при загрузке задач');
        }
        const data = await response.json();
        console.log('All.jsx - Fetched tasks:', data);
        setTasks(data);
      } catch (err) {
        console.error('All.jsx - Fetch error:', err.message);
        toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при загрузке задач', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchTasks();
  }, [API_URL, token, navigate]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleToggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (!isAuthenticated) return null;

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    const category = task.category || 'Без категории';
    if (!acc[category]) acc[category] = [];
    acc[category].push(task);
    return acc;
  }, {});

  // Sort tasks within each category
  Object.keys(groupedTasks).forEach(category => {
    groupedTasks[category].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  });

  const categories = ['Работа', 'Дом', 'Личный', 'Учеба', 'Недельный', 'Без категории'];

  return (
    <AllContainer>
      <PageTitle variant="h5">Все ваши задачи</PageTitle>

      <SortContainer>
        <StyledFormControl>
          <InputLabel>Сортировать по</InputLabel>
          <Select value={sortBy} onChange={handleSortChange}>
            <MenuItem value="date">Дате</MenuItem>
            <MenuItem value="title">Названию</MenuItem>
          </Select>
        </StyledFormControl>
      </SortContainer>

      {loading && (
        <LoadingContainer>
          <CircularProgress size={40} sx={{ color: '#6b7280' }} />
        </LoadingContainer>
      )}

      {!loading && tasks.length === 0 && (
        <EmptyState>
          <Typography variant="h6">Нет задач</Typography>
          <Typography>Перейдите в категории, чтобы добавить задачи</Typography>
        </EmptyState>
      )}

      {!loading && tasks.length > 0 && (
        <>
          {categories.map(category => (
            groupedTasks[category] && (
              <CategorySection key={category}>
                <CategoryHeader onClick={() => handleToggleCategory(category)}>
                  <CategoryTitle>{category}</CategoryTitle>
                  <IconButton>
                    <ExpandIcon open={expandedCategories[category]} />
                  </IconButton>
                </CategoryHeader>
                <Collapse in={expandedCategories[category]}>
                  <TasksContainer>
                    {groupedTasks[category].map((task, index) => (
                      <TaskCard key={task._id} cardColor={cardColors[index % cardColors.length]}>
                        <TaskContent>
                          <TaskTitle variant="h6">{task.title}</TaskTitle>
                          <TaskDescription variant="body2">
                            {task.description || 'Описание не указано'}
                          </TaskDescription>
                          <TaskDate variant="caption">
                            <CalendarTodayIcon fontSize="small" />
                            Срок: {new Date(task.dueDate).toLocaleDateString('ru-RU', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </TaskDate>
                        </TaskContent>
                      </TaskCard>
                    ))}
                  </TasksContainer>
                </Collapse>
              </CategorySection>
            )
          ))}
        </>
      )}
    </AllContainer>
  );
};

export default All;