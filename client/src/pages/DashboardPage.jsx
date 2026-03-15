import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';


const StatCard = ({ title, value, iconComponent }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center space-x-4 transition hover:shadow-lg hover:-translate-y-1">
    {iconComponent}
    <div>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState({ totalBoards: 0, totalLists: 0, totalCards: 0, recentBoards: [] });
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) { setLoading(false); return; }
      try {
        setLoading(true);
        const config = { headers: { 'x-auth-token': token } };
        const res = await axios.get('http://localhost:5001/api/dashboard', config);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        setError('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);
  
  const onCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    try {
      const config = { headers: { 'x-auth-token': token } };
      const body = { title: newBoardTitle };
      const res = await axios.post('http://localhost:5001/api/boards', body, config);
      navigate(`/board/${res.data._id}`);
    } catch (err) { 
      console.error('Failed to create board', err);
    }
  };

  if (loading) { return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>; }
  if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Here's a look at your workspace.</h2>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Boards" 
            value={stats.totalBoards} 
            iconComponent={
              <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h-2M5 11H3"></path></svg>
              </div>
            } 
          />
          <StatCard 
            title="Total Lists" 
            value={stats.totalLists}
            iconComponent={
              <div className="p-3 rounded-xl bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
            }
          />
          <StatCard
            title="Total Cards"
            value={stats.totalCards}
            iconComponent={
              <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
              </div>
            }
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Recent Boards</h2>
              {stats.totalBoards > 0 && (
                <Link to="/boards" className="text-sm font-semibold text-indigo-600 hover:underline">
                  View All Boards &rarr;
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stats.recentBoards.length > 0 ? (
                stats.recentBoards.map((board) => (
                  <Link
                    key={board._id}
                    to={`/board/${board._id}`}
                    className="block bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all h-36 flex flex-col overflow-hidden"
                  >
                    <div className="bg-indigo-600 p-4 text-center">
                      <h3 className="font-bold text-lg text-white truncate">
                        {board.title}
                      </h3>
                    </div>
                    <div className="flex-grow flex items-center justify-center p-4">
                      <div className="flex items-center text-sm font-medium text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.537 4.93c.046.327.07.66.07 1v1H1V16a5 5 0 015-5z"></path></svg>
                        {board.memberCount} Members
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                  <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-md text-center text-gray-500">
                    <p>No boards yet. Create one to get started!</p>
                  </div>
                )}
            </div>
          </div>

          
          <div className="p-6 bg-white rounded-xl shadow-md flex flex-col h-full">
            <h2 className="text-xl text-center font-bold mb-4 text-gray-700">Create New Board</h2>
            <form onSubmit={onCreateBoard} className="flex flex-col flex-grow">
              <input 
                type="text" 
                className="w-full border-gray-300 text-center rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3" 
                placeholder="Enter Board Name" 
                value={newBoardTitle} 
                onChange={(e) => setNewBoardTitle(e.target.value)} 
                required 
              />
              <button 
                type="submit" 
                className="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition duration-150 flex items-center justify-center"
              >
                
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Create Board
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;