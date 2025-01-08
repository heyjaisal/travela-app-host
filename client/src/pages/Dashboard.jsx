import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUserRole } from "../redux/Action";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    
    if (token && role) {
      localStorage.setItem('token', token); 
      dispatch(setUserRole(role));               
    } else {
      navigate('/login');                   
    }
  }, [navigate, dispatch]);

  return (
    <div>
      <h1>Hey, we are here!</h1>
    </div>
  );
}

export default Home;
