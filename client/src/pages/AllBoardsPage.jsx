import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from "../components/Loader";

  const AllBoardsPage = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const fetchAllBoards = async () => {
    if (!token) { setLoading(false); return; }
    try {
      setLoading(true);
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('https://tasksync-qkl8.onrender.com/api/boards', config);
      setBoards(res.data);
    } catch (err) {
      console.error('Failed to fetch all boards', err);
      setError('Could not load boards.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBoards();
  }, [token]);

  const handleDeleteBoard = async (boardIdToDelete) => {
    if (window.confirm('Are you sure you want to permanently delete this board and all its contents?')) {
      try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.delete(`https://tasksync-qkl8.onrender.com/api/boards/${boardIdToDelete}`, config);
        fetchAllBoards();
      } catch (err) {
        console.error('Failed to delete board', err);
        alert('Could not delete board.');
      }
    }
  };

  if (loading) { return <div className="p-8 text-center text-gray-500"><Loader/></div>; }
  if (error) { return <div className="p-8 text-center text-red-500">{error}</div>; }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Boards</h1>
          <Link to="/dashboard" className="text-sm font-semibold text-indigo-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {boards.map((board) => (
            <div key={board._id} className="relative group bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
              <Link to={`/board/${board._id}`} className="block h-36 flex flex-col overflow-hidden rounded-xl">
                <div className="bg-indigo-600 p-4 text-center">
                  <h2 className="font-bold text-lg text-white truncate">{board.title}</h2>
                </div>
                <div className="flex-grow flex items-center justify-center p-4">
                  <div className="flex items-center text-sm font-medium text-gray-500">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015.537 4.93c.046.327.07.66.07 1v1H1V16a5 5 0 015-5z"></path></svg>
                    {board.memberCount} Members
                  </div>
                </div>
              </Link>
              
              {user && user._id === board.user && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteBoard(board._id); }}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete Board"
                  >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
              )}
            </div>
          ))}
          
          <button onClick={() => navigate('/dashboard')} className="p-6 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-all h-36 flex flex-col items-center justify-center">
             <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
             <span className="font-semibold">Create New Board</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllBoardsPage;

