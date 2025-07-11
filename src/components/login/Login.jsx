import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f5f5f5;
  padding: 1rem;
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const FormWrapper = styled.div`
  background: #ffffff;
  border-radius: 2px;
  padding: 2rem;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  animation: ${fadeIn} 0.3s ease-out;
  @media (max-width: 480px) {
    padding: 1.5rem;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  color: #333333;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin: 0.5rem 0;
  border: 1px solid #e0e0e0;
  border-radius: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  background: #ffffff;
  color: #333333;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #666666;
  }
  &::placeholder {
    color: #999999;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.9rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  margin: 1.5rem 0 1rem 0;
  background: #333333;
  color: #ffffff;
  border: none;
  border-radius: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #555555;
  }
  &:focus {
    outline: none;
    background: #555555;
  }
  &:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.9rem;
  }
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #666666;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  margin-top: 0.5rem;
  transition: color 0.2s ease;
  &:hover {
    color: #333333;
  }
  &:focus {
    outline: none;
    color: #333333;
  }
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  margin: 0.5rem 0;
  text-align: center;
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = 'http://localhost:3007/api';

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setError('Пожалуйста, заполните все обязательные поля');
      setIsLoading(false);
      return;
    }
    if (isRegister && !formData.username) {
      setError('Пожалуйста, введите имя пользователя');
      setIsLoading(false);
      return;
    }

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const url = `${API_URL}${endpoint}`;
      console.log('Login.jsx - Fetching URL:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        console.log('Login.jsx - Error response:', data);
        throw new Error(data.error || 'Ошибка при отправке данных');
      }

      const data = await response.json();
      console.log('Login.jsx - Token received:', data.token);
      localStorage.setItem('token', data.token);
      setIsLoading(false);
      toast.success(isRegister ? 'Регистрация успешна! Готов к магии?' : 'Авторизация успешна! Давай планировать!', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#333333', color: '#ffffff', fontFamily: 'Roboto, sans-serif' },
      });
      navigate('/sidebar');
    } catch (err) {
      console.error('Login.jsx - Error:', err.message);
      setError(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Произошла ошибка. Попробуйте снова.');
      setIsLoading(false);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Произошла ошибка. Попробуйте снова.', {
        position: 'top-center',
        autoClose: 3000,
        style: { background: '#333333', color: '#ffffff', fontFamily: 'Roboto, sans-serif' },
      });
    }
  };

  return (
    <LoginContainer>
      <FormWrapper>
        <Title>{isRegister ? 'Регистрация' : 'Авторизация'}</Title>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <Input
              type="text"
              name="username"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={handleInputChange}
              aria-label="Имя пользователя"
              disabled={isLoading}
            />
          )}
          <Input
            type="email"
            name="email"
            placeholder="Электронная почта"
            value={formData.email}
            onChange={handleInputChange}
            aria-label="Электронная почта"
            disabled={isLoading}
          />
          <Input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleInputChange}
            aria-label="Пароль"
            disabled={isLoading}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Загрузка...' : isRegister ? 'Зарегистрироваться' : 'Войти'}
          </Button>
        </form>
        <ToggleLink onClick={() => setIsRegister(!isRegister)} disabled={isLoading}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </ToggleLink>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;