import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: board } = useSelector((state) => state.board);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  let userRole = null;
  if (isAuthenticated && user && board && board.user) {
    if (board.user._id === user._id) {
      userRole = 'Owner';
    } else if (board.members.some(member => member._id === user._id)) {
      userRole = 'Member';
    }
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 py-3">

        {/* 🔹 ROW 1 */}
        <div className="flex justify-between items-center">

          {/* LEFT */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center space-x-2">
            <Logo />
            <span className="text-lg sm:text-xl font-bold text-indigo-600">
              Task Sync
            </span>
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* DESKTOP: show everything inline */}
            <div className="hidden sm:flex items-center gap-4">
              {userRole && (
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  userRole === 'Owner'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userRole}
                </span>
              )}

              {isAuthenticated && (
                <span className="text-green-600">
                  Hello {user?.name}
                </span>
              )}
            </div>

            {isAuthenticated ? (
              <>
                <Link to="/profile" className="text-indigo-600 font-semibold text-sm">
                  Profile
                </Link>

                <button
                  onClick={onLogout}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-indigo-600 font-semibold text-sm">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* 🔹 ROW 2 (ONLY MOBILE) */}
        {isAuthenticated && (
  <div
    className={`flex sm:hidden items-center gap-2 mt-3 ${
      !userRole ? 'ml-8' : ''
    }`}
  >
    
    {userRole && (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
        userRole === 'Owner'
          ? 'bg-indigo-100 text-indigo-800'
          : 'bg-green-100 text-green-800'
      }`}>
        {userRole}
      </span>
    )}

    <span className="text-green-600 text-sm">
      Hello {user?.name}
    </span>

  </div>
)}
      </div>
    </nav>
  );
};

export default Navbar;