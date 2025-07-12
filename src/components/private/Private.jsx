import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PrivateContainer = styled(Box)`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  font-family: 'Inter', 'Roboto', sans-serif;
  @media (max-width: 768px) {
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
`;

const TaskForm = styled(Card)`
  padding: 2rem;
  border-radius: 16px;
  background: #ffffff;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const FormGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DescriptionField = styled(Box)`
  grid-column: 1 / -1;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: #fafafa;
    border-radius: 12px;
    font-family: 'Inter', 'Roboto', sans-serif;
    font-size: 1rem;
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
  & .MuiInputBase-input {
    color: #1a1a1a;
    &::placeholder {
      color: #9ca3af;
    }
  }
  & .MuiInputAdornment-root .MuiSvgIcon-root {
    color: #6b7280;
  }
`;

const AddButton = styled(Button)`
  font-family: 'Inter', 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  text-transform: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #1a1a1a 0%, #374151 100%);
  color: #ffffff;
  transition: all 0.3s ease;
  &:hover {
    background: linear-gradient(135deg, #374151 0%, #4b5563 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  &:disabled {
    background: #9ca3af;
    color: #ffffff;
    transform: none;
    box-shadow: none;
  }
`;

const TasksContainer = styled(Box)`
  display: grid;
  gap: 1.5rem;
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
  display: flex;
  align-items: center;
  gap: 1.5rem;
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
    flex-direction: column;
    align-items: flex-start;
    padding: 1.25rem;
    gap: 1rem;
  }
`;

const TaskContent = styled(CardContent)`
  flex: 1;
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

const DeleteButton = styled(IconButton)`
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
  transition: all 0.3s ease;
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.05);
  }
  @media (max-width: 480px) {
    padding: 0.5rem;
    align-self: flex-end;
  }
`;

const EmptyState = styled(Box)`
  text-align: center;
  padding: 3rem 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 2px dashed #d1d5db;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #6b7280;
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
`;

const Private = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'https://timely-server-puce.vercel.app/api';

  const token = localStorage.getItem('token');
  console.log('Private.jsx - Token:', token);

  useEffect(() => {
    let user = null;
    if (token) {
      try {
        user = jwtDecode(token);
        console.log('Private.jsx - Decoded user:', user);
        const currentTime = Date.now() / 1000;
        if (user.exp < currentTime) {
          console.log('Private.jsx - Token expired:', user.exp, currentTime);
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
        console.error('Private.jsx - Invalid token:', err);
        localStorage.removeItem('token');
        toast.error('Ошибка токена. Пожалуйста, войдите снова.', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
        });
        navigate('/login');
      }
    } else {
      console.log('Private.jsx - No token found, redirecting to login');
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
        console.log('Private.jsx - No user email, redirecting to login');
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
        console.log('Private.jsx - Fetching tasks from:', `${API_URL}/tasks?category=Личный`);
        const response = await fetch(`${API_URL}/tasks?category=Личный`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Private.jsx - Fetch response status:', response.status);
        if (!response.ok) {
          const data = await response.json();
          console.log('Private.jsx - Fetch error response:', data);
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
        setTasks(data);
      } catch (err) {
        console.error('Private.jsx - Fetch error:', err.message);
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

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      console.log('Private.jsx - Not authenticated in handleAddTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Название и дата обязательны', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
      return;
    }
    const user = token ? jwtDecode(token) : null;
    const userEmail = user?.email || '';
    if (!userEmail) {
      console.log('Private.jsx - No user email in handleAddTask, redirecting to login');
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
      console.log('Private.jsx - Adding task to:', `${API_URL}/tasks`);
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newTask, category: 'Личный', userEmail }),
      });
      console.log('Private.jsx - Add task response status:', response.status);
      if (!response.ok) {
        const data = await response.json();
        console.log('Private.jsx - Add task error response:', data);
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
        throw new Error(data.error || 'Ошибка при добавлении задачи');
      }
      const data = await response.json();
      setTasks([...tasks, data.task]);
      setNewTask({ title: '', description: '', dueDate: '' });
      toast.success('Задача добавлена!', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
    } catch (err) {
      console.error('Private.jsx - Add task error:', err.message);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при добавлении задачи', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!isAuthenticated) {
      console.log('Private.jsx - Not authenticated in handleDeleteTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    const user = token ? jwtDecode(token) : null;
    const userEmail = user?.email || '';
    if (!userEmail) {
      console.log('Private.jsx - No user email in handleDeleteTask, redirecting to login');
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
      console.log('Private.jsx - Deleting task from:', `${API_URL}/tasks/${id}`);
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Private.jsx - Delete task response status:', response.status);
      if (!response.ok) {
        const data = await response.json();
        console.log('Private.jsx - Delete task error response:', data);
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
        throw new Error(data.error || 'Ошибка при удалении задачи');
      }
      setTasks(tasks.filter(task => task._id !== id));
      toast.success('Задача удалена!', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
    } catch (err) {
      console.error('Private.jsx - Delete task error:', err.message);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при удалении задачи', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1a1a1a', color: '#ffffff', fontFamily: 'Inter, Roboto, sans-serif' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <PrivateContainer>
      <PageTitle variant="h5">Личные задачи</PageTitle>

      <TaskForm>
        <FormGrid>
          <StyledTextField
            fullWidth
            name="title"
            label="Название задачи"
            value={newTask.title}
            onChange={handleInputChange}
            disabled={loading}
            InputProps={{
              startAdornment: <TitleIcon sx={{ color: '#6b7280', mr: 1 }} />,
            }}
          />

          <StyledTextField
            fullWidth
            name="dueDate"
            label="Дата выполнения"
            type="date"
            value={newTask.dueDate}
            onChange={handleInputChange}
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: <CalendarTodayIcon sx={{ color: '#6b7280', mr: 1 }} />,
            }}
          />

          <DescriptionField>
            <StyledTextField
              fullWidth
              name="description"
              label="Описание задачи"
              multiline
              rows={4}
              value={newTask.description}
              onChange={handleInputChange}
              disabled={loading}
              InputProps={{
                startAdornment: <DescriptionIcon sx={{ color: '#6b7280', mr: 1 }} />,
              }}
            />
          </DescriptionField>
        </FormGrid>

        <AddButton
          variant="contained"
          onClick={handleAddTask}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
        >
          {loading ? 'Добавление...' : 'Добавить задачу'}
        </AddButton>
      </TaskForm>

      {loading && (
        <LoadingContainer>
          <CircularProgress size={40} sx={{ color: '#6b7280' }} />
        </LoadingContainer>
      )}

      <TasksContainer>
        {tasks.length === 0 && !loading && (
          <EmptyState>
            <Typography variant="h6">Нет личных задач</Typography>
            <Typography>Добавьте первую задачу, чтобы начать планирование личных дел</Typography>
          </EmptyState>
        )}

        {tasks.map((task, index) => (
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
            <DeleteButton
              onClick={() => handleDeleteTask(task._id)}
              disabled={loading}
            >
              <DeleteIcon />
            </DeleteButton>
          </TaskCard>
        ))}
      </TasksContainer>
    </PrivateContainer>
  );
};

export default Private;