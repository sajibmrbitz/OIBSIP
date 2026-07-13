import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Page imports
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import OrderSummary from './pages/OrderSummary';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home';

// Placeholder components
const OrderDetails = () => <div>Order Details</div>;

function App() {
  return (
    <div className="relative min-h-screen bg-orange-50 text-gray-900 overflow-hidden">
      {/* Universal Faded Circular Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] rounded-full bg-orange-300 opacity-40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[35rem] h-[35rem] rounded-full bg-red-300 opacity-30 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[25rem] h-[25rem] rounded-full bg-orange-400 opacity-20 blur-[80px]"></div>
      </div>
      
      <div className="relative z-10">
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Admin Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected User Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order-summary" 
          element={
            <ProtectedRoute>
              <OrderSummary />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout/:orderId" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/order/:id" 
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-orders" 
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } 
        />

        {/* Protected Admin Routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      </div>
    </div>
  );
}

export default App;
