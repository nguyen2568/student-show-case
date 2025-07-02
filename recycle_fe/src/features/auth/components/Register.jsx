import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import styled from 'styled-components';
import backgroundImg from '../../../assets/bg_main.jpg';
import recycle from '../../../assets/recycle-symbol.png';
import Input from '../../../component/Input';
import { Link } from 'react-router-dom';
const Div = styled.div`
  height: 100vh;
  background-color: #C4E8F6;
  background-image: url(${(props => props.$background)});
  background-size: contain;
  background-position: bottom;
  background-repeat: no-repeat;
  padding-top: 70px;

  form {
    background: rgba(255, 255, 255, 0.8); /* Add a semi-transparent background for the form */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%; /* Adjust form width for mobile */
    max-width: 400px; /* Limit form width for larger screens */
    margin: auto;
  }
    
  button {
    width: 100%;
    padding: 10px;
    ${(props => !props.$isLoading ? 
      'background-color: #1a93b0;':
       'background-color: #7abbca; !important;')}
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

  button:hover {
    
    ${(props => !props.$isLoading ? 
      'background-color:rgb(23, 124, 149);':
       'background-color: #7abbca; !important;')}
  }
`;

const H2Styled = styled.h2`
  margin-bottom: 20px;
  text-align: center;
  color: #1a93b0;
  font-size: 24px;
  font-weight: bold;
`;
const RecycleStyled = styled.img`
  width: 50px;
  height: 50px;
  margin: auto;
  margin-bottom: 20px;
  display: block;
`;

const Register = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123');
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Determine where to redirect after login
  const { from } = { from: { pathname: '/qr' } }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Replace with your backend API endpoint
      const res = await register(username, password);
      if (res.success) {
        navigate(from, { replace: true }); // Redirect after login
      }
      else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Div $background={backgroundImg} $isLoading={isLoading}>
      <form onSubmit={handleSubmit}>
        <RecycleStyled src={recycle} alt="Recycle" />
        <H2Styled>Sign Up!</H2Styled>
        <p className='text-center mb-4'>Sign up and discover the positive impact of recycling</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Input
          type="username"
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          required
        />
        <p className='font-semibold'>Default password: 123</p>
        {/* <Input
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          readOnly = {true}
        /> */}
        <button type="submit" disabled={isLoading} className="mt-4">Register</button>
        <p className='text-center mt-4'>Already have an account? <Link to="/login" className='text-blue-500'>Login</Link></p>
      </form>
    </Div>

  );
};

export default Register;