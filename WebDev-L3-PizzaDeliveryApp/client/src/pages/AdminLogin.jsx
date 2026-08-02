import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import LogoText from '../components/LogoText';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axiosInstance.post('/auth/login', formData);
      const user = res.data.user;
      
      if (user.role !== 'admin') {
        setError('Not authorized as admin');
        return;
      }

      login(res.data.token, user);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4 font-sans">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-gray-200">
        <div className="mb-8 text-center">
          <img src={`${import.meta.env.BASE_URL}images/logo.jpg`} alt="PizzaHub Logo" className="h-20 w-20 object-contain shadow-sm mx-auto mb-4 border border-gray-100 rounded-lg" />
          <div className="flex items-center justify-center space-x-2 mb-1">
            <LogoText className="text-2xl" />
            <span className="text-2xl font-bold text-gray-800">Admin</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">Authorized personnel only</p>
        </div>
        
        {error && <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700 font-medium border border-red-200">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Admin Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-gray-800 focus:border-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-gray-800 px-4 py-2.5 font-bold text-white hover:bg-gray-900 transition-colors shadow-sm"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
