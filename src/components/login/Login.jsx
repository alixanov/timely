import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fadeIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px) scale(0.96); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0) scale(1); 
  }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  padding: 1rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    pointer-events: none;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const FormWrapper = styled.div`
  background: rgba(17, 17, 17, 0.95);
  border: 1px solid #333333;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  animation: ${fadeIn} 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  
  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
    max-width: 95%;
    border-radius: 12px;
  }
`;

const Title = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 300;
  color: #ffffff;
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 2rem;
  letter-spacing: -0.02em;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #ffffff, transparent);
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  margin: 1.5rem 0;
  
  @media (max-width: 480px) {
    margin: 1.25rem 0;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 1.25rem 1rem;
  border: 1px solid #333333;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus {
    outline: none;
    border-color: #ffffff;
    background: rgba(0, 0, 0, 0.6);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
  
  &::placeholder {
    color: #888888;
    transition: color 0.3s ease;
  }
  
  &:focus::placeholder {
    color: #aaaaaa;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 1rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1.25rem;
  margin: 2rem 0 1.5rem 0;
  background: ${props => props.disabled ? '#333333' : 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)'};
  color: ${props => props.disabled ? '#666666' : '#000000'};
  border: none;
  border-radius: 8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(255, 255, 255, 0.1);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 1rem;
  }
`;

const LoadingButton = styled(Button)`
  background: #333333;
  color: #ffffff;
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border: 2px solid #666666;
    border-top: 2px solid #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    100% { transform: translate(-50%, -50%) rotate(360deg); }
  }
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #888888;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
  margin-top: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  text-align: center;
  padding: 0.5rem;
  
  &:hover:not(:disabled) {
    color: #ffffff;
  }
  
  &:focus {
    outline: none;
    color: #ffffff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.9rem;
  margin: 1rem 0;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  border: 1px solid rgba(255, 107, 107, 0.2);
  border-radius: 6px;
  padding: 0.75rem;
  
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
  const API_URL = 'https://timely-server-puce.vercel.app/api';

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
        style: {
          background: '#000000',
          color: '#ffffff',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          border: '1px solid #333333',
          borderRadius: '8px'
        },
      });
      navigate('/all');
    } catch (err) {
      console.error('Login.jsx - Error:', err.message);
      setError(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Произошла ошибка. Попробуйте снова.');
      setIsLoading(false);
      toast.error(err.message === 'Failed to fetch' ? 'Не удалось подключиться к серверу. Проверьте, работает ли сервер.' : err.message || 'Произошла ошибка. Попробуйте снова.', {
        position: 'top-center',
        autoClose: 3000,
        style: {
          background: '#000000',
          color: '#ffffff',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          border: '1px solid #333333',
          borderRadius: '8px'
        },
      });
    }
  };

  return (
    <LoginContainer>
      <FormWrapper>
        <Title>{isRegister ? 'Регистрация' : 'Авторизация'}</Title>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <InputWrapper>
              <Input
                type="text"
                name="username"
                placeholder="Имя пользователя"
                value={formData.username}
                onChange={handleInputChange}
                aria-label="Имя пользователя"
                disabled={isLoading}
              />
            </InputWrapper>
          )}
          <InputWrapper>
            <Input
              type="email"
              name="email"
              placeholder="Электронная почта"
              value={formData.email}
              onChange={handleInputChange}
              aria-label="Электронная почта"
              disabled={isLoading}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              name="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={handleInputChange}
              aria-label="Пароль"
              disabled={isLoading}
            />
          </InputWrapper>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {isLoading ? (
            <LoadingButton type="submit" disabled={true}>
              Загрузка...
            </LoadingButton>
          ) : (
            <Button type="submit">
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </Button>
          )}
        </form>
        <ToggleLink onClick={() => setIsRegister(!isRegister)} disabled={isLoading}>
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </ToggleLink>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;