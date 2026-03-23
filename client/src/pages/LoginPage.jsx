import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginSuccess, setUser } from '../features/auth/authSlice';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // ✅ NEW

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // ✅ prevent multiple clicks

    setLoading(true); // ✅ start loading

    try {
      const res = await axios.post('https://tasksync-qkl8.onrender.com/api/auth/login', formData);

      dispatch(loginSuccess(res.data));

      const config = { headers: { 'x-auth-token': res.data.token } };

      const userRes = await axios.get('https://tasksync-qkl8.onrender.com/api/auth', config);

      dispatch(setUser(userRes.data));

      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response?.data);
      alert('Login Failed: Invalid Credentials');
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-indigo-600">Welcome Back!</h1>
        <p className="text-lg text-gray-600 mt-2">Log in to continue managing your projects.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Log In to Your Account
        </h2>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="shadow-sm border rounded w-full py-3 px-4 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="shadow-sm border rounded w-full py-3 px-4 focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* ✅ UPDATED BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-150 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;