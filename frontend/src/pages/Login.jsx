import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { FaUser, FaLock } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // เพิ่มการ import
import { useAuth } from '../context/AuthContext';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refreshBranchFilter } = useAuth();
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await loginUser(formData);
      const { token } = response.data;
      localStorage.setItem('token', token);

      // 🔒 decode token แยก try
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          setError('Token expired immediately, please contact admin');
          localStorage.removeItem('token');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        setError('Invalid token');
        localStorage.removeItem('token');
        setLoading(false);
        return;
      }

      // ✅ เรียก AuthContext ให้รู้ว่า token เปลี่ยน
      refreshBranchFilter();
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-800 mb-6 text-center flex items-center justify-center">
          <FaUser className="mr-2" /> Login
        </h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-blue-600 mb-1 flex items-center">
              <FaUser className="mr-2" /> Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="text-blue-600 mb-1 flex items-center">
              <FaLock className="mr-2" /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;