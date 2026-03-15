import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../features/auth/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const [details, setDetails] = useState({ name: '', email: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    if (user) {
      setDetails({ name: user.name, email: user.email });
    }
  }, [user]);

  const onDetailsChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
  const onPasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });
  const onUpdateDetails = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put('http://localhost:5001/api/users/details', details, config);
      dispatch(setUser(res.data));
      setMessageType('success');
      setMessage('Profile details updated successfully!');
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.msg || 'Failed to update details.');
    }
  };
  
  const onChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      setMessageType('error');
      setMessage('New passwords do not match.');
      return;
    }
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.put('http://localhost:5001/api/users/password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }, config);
      setMessageType('success');
      setMessage(res.data.msg);
      setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (err) {
      setMessageType('error');
      setMessage(err.response?.data?.msg || 'Failed to change password.');
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10">Account Settings</h1>
        
        {message && (
          <p className={`mb-6 text-center p-3 rounded-lg ${
            messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>{message}</p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/*Profile Details*/}
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-indigo-600">
            <form onSubmit={onUpdateDetails}>
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Profile Details</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" id="name" value={details.name} onChange={onDetailsChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input type="email" name="email" id="email" value={details.email} onChange={onDetailsChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
              </div>
              <div className="text-right mt-6 pt-6 border-t">
                <button type="submit" className="bg-indigo-600 flex justify-center hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                  Save Details
                </button>
              </div>
            </form>
          </div>

          {/*Change Password*/}
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-indigo-600">
            <form onSubmit={onChangePassword}>
              <h2 className="text-2xl font-bold text-indigo-600 mb-6">Change Password</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input type="password" name="currentPassword" value={passwords.currentPassword} onChange={onPasswordChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input type="password" name="newPassword" value={passwords.newPassword} onChange={onPasswordChange} required
                  minLength="6"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input type="password" name="confirmNewPassword" value={passwords.confirmNewPassword} onChange={onPasswordChange} required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
              </div>
              <div className="text-right mt-6 pt-6 border-t">
                <button type="submit" className="bg-indigo-600 flex justify-center hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;