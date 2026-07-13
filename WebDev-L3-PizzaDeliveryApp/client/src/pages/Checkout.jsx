import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Checkout = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Checkout mounted with orderId:', orderId);
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/orders/${orderId}`);
        console.log('Order fetched successfully:', res.data);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    if (orderId) {
      fetchOrder();
    } else {
      setError('No order ID provided in URL');
      setLoading(false);
    }
  }, [orderId]);

  const handlePay = async () => {
    setPaying(true);
    setError(null);
    
    // Simulate payment delay
    setTimeout(async () => {
      try {
        await axiosInstance.post('/payment/simulate', { orderId });
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } catch (err) {
        setError(err.response?.data?.message || 'Payment failed');
        setPaying(false);
      }
    }, 1500);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-orange-50 font-sans text-gray-500">Loading order...</div>;
  }

  if (error && !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard" className="text-red-600 font-semibold hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden relative">
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-10 bg-green-500 flex flex-col items-center justify-center text-white p-8 animate-in fade-in duration-500">
            <div className="text-6xl mb-4 animate-bounce">🍕</div>
            <h2 className="text-3xl font-black mb-2">Payment Successful!</h2>
            <p className="text-green-100 text-center font-medium">Your pizza is now being prepared. Redirecting to your orders...</p>
          </div>
        )}

        <div className="bg-gray-900 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-red-500 opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-orange-500 opacity-20"></div>
          <h2 className="text-white text-sm font-bold tracking-widest uppercase mb-1 relative z-10">Total Amount</h2>
          <div className="text-5xl font-black text-white relative z-10">৳{order.total_price}</div>
          <div className="text-gray-400 text-sm mt-2 font-medium relative z-10">Order #{order.id}</div>
        </div>

        <div className="p-8">
          {error && <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-600 font-medium">{error}</div>}

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b pb-2">Order Details</h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-gray-800 font-medium">
                <span>Base</span>
                <span>{order.base_name}</span>
              </li>
              <li className="flex justify-between items-center text-gray-800 font-medium">
                <span>Sauce</span>
                <span>{order.sauce_name}</span>
              </li>
              <li className="flex justify-between items-center text-gray-800 font-medium">
                <span>Cheese</span>
                <span>{order.cheese_name}</span>
              </li>
              {order.vegetables && order.vegetables.length > 0 && order.vegetables[0] !== null && (
                <li className="flex flex-col text-gray-800 font-medium pt-2">
                  <span className="text-xs text-gray-500 mb-1">Vegetables</span>
                  <span className="text-sm">{order.vegetables.join(', ')}</span>
                </li>
              )}
            </ul>
          </div>

          <button
            onClick={handlePay}
            disabled={paying || !!order.payment_id}
            className="w-full relative overflow-hidden rounded-xl bg-red-600 px-6 py-4 text-lg font-bold text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:shadow-none"
          >
            {paying ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing Payment...
              </span>
            ) : order.payment_id ? (
              'Already Paid'
            ) : (
              'Pay Now'
            )}
          </button>
          
          <div className="mt-4 text-center">
             <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel and return to Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
