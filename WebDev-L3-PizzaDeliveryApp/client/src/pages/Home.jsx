import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LogoText from '../components/LogoText';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen flex-col font-sans text-gray-800 bg-transparent">
      {/* Hero Section */}
      <section className="relative flex flex-grow items-center justify-center py-32 bg-gradient-to-br from-gray-900 to-black overflow-hidden">
        {/* Stylistic Emoji Background Elements */}
        <div className="absolute -right-10 -top-10 opacity-20 transform rotate-12 text-[200px] pointer-events-none">
          🍕
        </div>
        <div className="absolute -left-10 bottom-0 opacity-10 transform -rotate-12 text-[250px] pointer-events-none">
          🍅
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10 transform rotate-45 text-[150px] pointer-events-none">
          🧀
        </div>
        
        <div className="relative z-10 px-4 text-center sm:px-6 lg:px-8">
          <div className="relative flex justify-center mb-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#f90] rounded-full blur-[60px] opacity-40 pointer-events-none"></div>
            <div className="relative z-10 bg-white p-4 rounded-2xl shadow-2xl">
              <img src="/images/logo.jpg" alt="PizzaHub Logo" className="h-32 w-auto object-contain rounded-lg" />
            </div>
          </div>
          <h1 className="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            Craft Your Perfect <span className="text-red-500">Pizza</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium text-gray-300 sm:text-xl">
            Fresh ingredients, endless combinations. Build your masterpiece from scratch and get it delivered hot to your door in minutes.
          </p>
          
          <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
            {user ? (
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:-translate-y-1 transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/register"
                  className="w-full sm:w-auto rounded-full bg-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 hover:-translate-y-1 transition-all"
                >
                  Sign Up
                </Link>
                <Link 
                  to="/login"
                  className="w-full sm:w-auto rounded-full bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-lg hover:bg-gray-100 hover:-translate-y-1 transition-all"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded bg-red-500"></div>
          </div>
          
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl shadow-sm border border-orange-100">
                🍕
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">1. Build Your Pizza</h3>
              <p className="text-gray-600 leading-relaxed">Customize everything. Choose your base, pick a sauce, layer the cheese, and load up on fresh veggies.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl shadow-sm border border-orange-100">
                💳
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">2. Pay Securely</h3>
              <p className="text-gray-600 leading-relaxed">Review your custom creation and checkout seamlessly with our fast and secure payment process.</p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-50 text-4xl shadow-sm border border-orange-100">
                🛵
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">3. Track Your Order</h3>
              <p className="text-gray-600 leading-relaxed">Watch your pizza's journey from our kitchen oven straight to your doorstep in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-center text-gray-400">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center space-x-3 mb-2">
            <img src="/images/logo.jpg" alt="PizzaHub Logo" className="h-8 w-8 object-contain grayscale opacity-80 rounded-md" />
            <span className="text-2xl font-bold text-white">PizzaHub</span>
          </div>
          <p className="mb-8 text-sm">Delivering happiness, one slice at a time.</p>
          <div className="border-t border-gray-800 pt-8 text-sm font-medium text-gray-500">
            <span>&copy; {new Date().getFullYear()} PizzaHub. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
