import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selection = location.state?.selection;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!selection) {
    return <Navigate to="/dashboard" />;
  }

  // Calculate total price based on backend rules: base:150, sauce:30, cheese:50, veg:20 each
  const basePrice = 150;
  const saucePrice = 30;
  const cheesePrice = 50;
  const vegPrice = 20 * selection.vegetables.length;
  const totalPrice = basePrice + saucePrice + cheesePrice + vegPrice;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        baseId: selection.base.id,
        sauceId: selection.sauce.id,
        cheeseId: selection.cheese.id,
        vegetableIds: selection.vegetables.map(v => v.id)
      };
      const res = await axiosInstance.post('/orders/create', payload);
      navigate(`/checkout/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 p-6 flex justify-center items-center font-sans">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center border-b pb-4">Order Summary</h2>

        {error && <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">{error}</div>}

        <div className="space-y-6 mb-10">
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold">Base</span>
              <span className="text-lg font-medium text-gray-800">{selection.base.name}</span>
            </div>
            <span className="font-semibold text-gray-700">৳{basePrice}</span>
          </div>
          
          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold">Sauce</span>
              <span className="text-lg font-medium text-gray-800">{selection.sauce.name}</span>
            </div>
            <span className="font-semibold text-gray-700">৳{saucePrice}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold">Cheese</span>
              <span className="text-lg font-medium text-gray-800">{selection.cheese.name}</span>
            </div>
            <span className="font-semibold text-gray-700">৳{cheesePrice}</span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-100 pb-4">
            <div>
              <span className="text-sm text-gray-500 block uppercase tracking-wider font-semibold">Vegetables</span>
              <span className="text-lg font-medium text-gray-800">
                {selection.vegetables.length > 0 
                  ? selection.vegetables.map(v => v.name).join(', ') 
                  : 'None'}
              </span>
            </div>
            <span className="font-semibold text-gray-700">৳{vegPrice}</span>
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-2xl font-bold text-gray-800">Total</span>
            <span className="text-3xl font-black text-red-600">৳{totalPrice}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-1/3 rounded-xl border-2 border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-2/3 rounded-xl bg-green-600 px-6 py-3 font-bold text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {loading ? 'Processing...' : 'Confirm & Pay'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
