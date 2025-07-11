import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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

// Анимации
const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const slideIn = keyframes`
  from { 
    transform: translateX(-100%); 
    opacity: 0; 
  }
  to { 
    transform: translateX(0); 
    opacity: 1; 
  }
`;

const glow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
  50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.3); }
  100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const WorkContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  letter-spacing: 2px;
  text-transform: uppercase;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

const TaskForm = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${slideIn} 0.6s ease-out;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.03);
    animation: ${glow} 2s infinite;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const DescriptionField = styled.div`
  grid-column: 1 / -1;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    color: #ffffff;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    
    &.Mui-focused {
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }
    
    & fieldset {
      border-color: rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
    }
    
    &:hover fieldset {
      border-color: rgba(255, 255, 255, 0.3);
    }
    
    &.Mui-focused fieldset {
      border-color: rgba(255, 255, 255, 0.5);
    }
  }
  
  & .MuiInputLabel-root {
    color: rgba(255, 255, 255, 0.7);
    
    &.Mui-focused {
      color: #ffffff;
    }
  }
  
  & .MuiInputBase-input {
    color: #ffffff;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }
  
  & .MuiInputAdornment-root .MuiSvgIcon-root {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const AddButton = styled(Button)`
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  color: #000000;
  border: none;
  border-radius: 50px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: none;
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.5);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
`;

const TasksContainer = styled.div`
  display: grid;
  gap: 1.5rem;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;
`;

const TaskCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #ffffff, rgba(255, 255, 255, 0.3));
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    padding: 1.5rem;
  }
`;

const TaskContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const TaskTitle = styled.h3`
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  word-wrap: break-word;
`;

const TaskDescription = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0 0 0.75rem 0;
  line-height: 1.6;
  word-wrap: break-word;
`;

const TaskDate = styled.div`
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '📅';
    font-size: 0.8rem;
  }
`;

const DeleteButton = styled(IconButton)`
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  padding: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 50, 50, 0.2);
    border-color: rgba(255, 50, 50, 0.3);
    color: #ff6b6b;
    transform: scale(1.1);
    animation: ${pulse} 0.5s ease;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: rgba(255, 255, 255, 0.5);
  
  & h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.7);
  }
  
  & p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  & .MuiCircularProgress-root {
    color: #ffffff;
  }
`;

const Work = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3007/api';

  const token = localStorage.getItem('token');
  console.log('Work.jsx - Token:', token);

  useEffect(() => {
    let user = null;
    if (token) {
      try {
        user = jwtDecode(token);
        console.log('Work.jsx - Decoded user:', user);
        const currentTime = Date.now() / 1000;
        if (user.exp < currentTime) {
          console.log('Work.jsx - Token expired:', user.exp, currentTime);
          localStorage.removeItem('token');
          toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
            position: 'top-center',
            autoClose: 3000,
            style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
          });
          navigate('/login');
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Work.jsx - Invalid token:', err);
        localStorage.removeItem('token');
        toast.error('Ошибка токена. Пожалуйста, войдите снова.', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
        });
        navigate('/login');
      }
    } else {
      console.log('Work.jsx - No token found, redirecting to login');
      toast.error('Пожалуйста, войдите в систему', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/login');
    }

    const fetchTasks = async () => {
      if (!user) return;
      const userEmail = user.email || '';
      if (!userEmail) {
        console.log('Work.jsx - No user email, redirecting to login');
        toast.error('Пользователь не авторизован', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
        });
        navigate('/login');
        return;
      }
      setLoading(true);
      try {
        console.log('Work.jsx - Fetching tasks from:', `${API_URL}/tasks?category=Работа`);
        const response = await fetch(`${API_URL}/tasks?category=Работа`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Work.jsx - Fetch response status:', response.status);
        if (!response.ok) {
          const data = await response.json();
          console.log('Work.jsx - Fetch error response:', data);
          if (response.status === 401) {
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
              position: 'top-center',
              autoClose: 3000,
              style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
            });
            navigate('/login');
            return;
          }
          throw new Error(data.error || 'Ошибка при загрузке задач');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error('Work.jsx - Fetch error:', err.message);
        toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при загрузке задач', {
          position: 'top-center',
          autoClose: 3000,
          style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
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
      console.log('Work.jsx - Not authenticated in handleAddTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Название и дата обязательны', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      return;
    }
    const user = token ? jwtDecode(token) : null;
    const userEmail = user?.email || '';
    if (!userEmail) {
      console.log('Work.jsx - No user email in handleAddTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      console.log('Work.jsx - Adding task to:', `${API_URL}/tasks`);
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newTask, category: 'Работа', userEmail }),
      });
      console.log('Work.jsx - Add task response status:', response.status);
      if (!response.ok) {
        const data = await response.json();
        console.log('Work.jsx - Add task error response:', data);
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
            position: 'top-center',
            autoClose: 3000,
            style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
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
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
    } catch (err) {
      console.error('Work.jsx - Add task error:', err.message);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при добавлении задачи', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!isAuthenticated) {
      console.log('Work.jsx - Not authenticated in handleDeleteTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    const user = token ? jwtDecode(token) : null;
    const userEmail = user?.email || '';
    if (!userEmail) {
      console.log('Work.jsx - No user email in handleDeleteTask, redirecting to login');
      toast.error('Пользователь не авторизован', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      console.log('Work.jsx - Deleting task from:', `${API_URL}/tasks/${id}`);
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Work.jsx - Delete task response status:', response.status);
      if (!response.ok) {
        const data = await response.json();
        console.log('Work.jsx - Delete task error response:', data);
        if (response.status === 401) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          toast.error('Сессия истекла. Пожалуйста, войдите снова.', {
            position: 'top-center',
            autoClose: 3000,
            style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
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
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
    } catch (err) {
      console.error('Work.jsx - Delete task error:', err.message);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Ошибка при удалении задачи', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#1A1A1A', color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <WorkContainer>
      <PageTitle>Работа</PageTitle>

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
              startAdornment: <TitleIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />,
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
              startAdornment: <CalendarTodayIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />,
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
                startAdornment: <DescriptionIcon sx={{ color: 'rgba(255, 255, 255, 0.6)', mr: 1 }} />,
              }}
            />
          </DescriptionField>
        </FormGrid>

        <AddButton
          onClick={handleAddTask}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
        >
          {loading ? 'Добавление...' : 'Добавить задачу'}
        </AddButton>
      </TaskForm>

      {loading && (
        <LoadingContainer>
          <CircularProgress size={40} />
        </LoadingContainer>
      )}

      <TasksContainer>
        {tasks.length === 0 && !loading && (
          <EmptyState>
            <h3>Нет рабочих задач</h3>
            <p>Добавьте первую задачу, чтобы начать планирование своей работы</p>
          </EmptyState>
        )}

        {tasks.map((task, index) => (
          <TaskCard key={task._id} style={{ animationDelay: `${index * 0.1}s` }}>
            <TaskContent>
              <TaskTitle>{task.title}</TaskTitle>
              <TaskDescription>
                {task.description || 'Описание не указано'}
              </TaskDescription>
              <TaskDate>
                {new Date(task.dueDate).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
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
    </WorkContainer>
  );
};

export default Work;