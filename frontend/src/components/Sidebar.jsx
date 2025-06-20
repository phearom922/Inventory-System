import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaHome, FaArrowDown, FaArrowUp, FaTrash, FaChartBar, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';

function Sidebar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isOpen, setIsOpen] = useState(false); // สำหรับ collapse Sidebar บนมือถือ
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role);
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserRole(null);
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <div
        className={`bg-blue-600 text-white h-screen p-4 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-16'
        } md:w-64 fixed z-10`}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className={`${isOpen ? 'block' : 'hidden'} md:block text-xl font-bold`}>Inventory System</h1>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            <FaBars size={24} />
          </button>
        </div>
        <nav className={`${isOpen ? 'block' : 'hidden'} md:block space-y-2`}>
          {isLoggedIn ? (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-blue-700 ${
                    isActive ? 'bg-blue-700' : ''
                  }`
                }
              >
                <FaHome className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Dashboard</span>
              </NavLink>
              <NavLink
                to="/receive"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-blue-700 ${
                    isActive ? 'bg-blue-700' : ''
                  }`
                }
              >
                <FaArrowDown className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Receive Stock</span>
              </NavLink>
              <NavLink
                to="/issue"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-blue-700 ${
                    isActive ? 'bg-blue-700' : ''
                  }`
                }
              >
                <FaArrowUp className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Issue Stock</span>
              </NavLink>
              <NavLink
                to="/waste"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-blue-700 ${
                    isActive ? 'bg-blue-700' : ''
                  }`
                }
              >
                <FaTrash className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Waste Record</span>
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded hover:bg-blue-700 ${
                    isActive ? 'bg-blue-700' : ''
                  }`
                }
              >
                <FaChartBar className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Reports</span>
              </NavLink>
              {userRole === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded hover:bg-blue-700 ${
                      isActive ? 'bg-blue-700' : ''
                    }`
                  }
                >
                  <FaUsers className="mr-2" />
                  <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>User Management</span>
                </NavLink>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center p-2 rounded hover:bg-blue-700 w-full text-left"
              >
                <FaSignOutAlt className="mr-2" />
                <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center p-2 rounded hover:bg-blue-700 ${
                  isActive ? 'bg-blue-700' : ''
                }`
              }
            >
              <FaSignOutAlt className="mr-2" />
              <span className={`${isOpen ? 'block' : 'hidden'} md:block`}>Login</span>
            </NavLink>
          )}
        </nav>
      </div>
      <div className={`flex-1 ml-16 md:ml-64 transition-all duration-300`}>
        {/* เนื้อหาจะถูกเรนเดอร์โดย Routes ใน App.jsx */}
      </div>
    </div>
  );
}

export default Sidebar;