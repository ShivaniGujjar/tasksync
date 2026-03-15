import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import { setUser, logout } from './features/auth/authSlice';
import setAuthToken from './utils/setAuthToken';
import axios from 'axios';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    const loadUser = async () => {
      try {
        const res = await axios.get('https://tasksync-qkl8.onrender.com/api/auth');
        dispatch(setUser(res.data));
      } catch (err) {
        dispatch(logout());
      }
    };
    
    if (localStorage.token) {
      loadUser();
    }
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;