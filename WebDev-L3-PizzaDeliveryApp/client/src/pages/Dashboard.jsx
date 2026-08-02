import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import PizzaBuilder from '../components/PizzaBuilder';
import LogoText from '../components/LogoText';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    vegetables: []
  });
  const [showBuilder, setShowBuilder] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axiosInstance.get('/orders/options');
        // Ensure data exists and is structured correctly
        if (res.data) {
          setOptions({
            bases: res.data.bases || [],
            sauces: res.data.sauces || [],
            cheeses: res.data.cheeses || [],
            vegetables: res.data.vegetables || []
          });
        }
      } catch (err) {
        console.error('Fetch options error:', err);
        setError('Failed to load pizza options. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent p-6 font-sans text-gray-800">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 flex items-center justify-between rounded-2xl bg-white p-6 shadow-md">
          <div className="flex items-center space-x-4">
            <img src={`${import.meta.env.BASE_URL}images/logo.jpg`} alt="PizzaHub Logo" className="h-12 w-12 object-contain shadow-sm rounded-lg" />
            <div>
              <div className="mb-1">
                <LogoText className="text-3xl" />
              </div>
              <p className="text-gray-600">Welcome back, {user?.name || 'Pizza Lover'}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/my-orders" 
              className="rounded-lg bg-orange-100 px-4 py-2 font-medium text-orange-800 hover:bg-orange-200 transition-colors"
            >
              My Orders
            </Link>
            <button 
              onClick={handleLogout}
              className="rounded-lg border border-red-200 px-4 py-2 font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {!showBuilder ? (
          <div className="rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 p-12 text-center text-white shadow-xl">
            <h2 className="mb-4 text-4xl font-black">Craving a Masterpiece?</h2>
            <p className="mb-8 text-lg font-medium text-red-100">
              Build your custom pizza from our fresh ingredients.
            </p>
            <button
              onClick={() => setShowBuilder(true)}
              className="rounded-full bg-white px-8 py-4 text-xl font-bold text-red-600 shadow-lg hover:scale-105 transition-transform"
            >
              Build Your Pizza
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <button 
                onClick={() => setShowBuilder(false)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                &larr; Cancel
              </button>
            </div>
            {loading ? (
              <div className="text-center p-10 font-bold text-gray-400 animate-pulse">Loading fresh ingredients...</div>
            ) : error ? (
              <div className="text-center p-10 text-red-500 font-medium">{error}</div>
            ) : (
              <PizzaBuilder 
                bases={options.bases}
                sauces={options.sauces}
                cheeses={options.cheeses}
                vegetables={options.vegetables}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
