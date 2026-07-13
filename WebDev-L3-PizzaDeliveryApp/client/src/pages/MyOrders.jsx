import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders/my-orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setError(err.response?.data?.message || 'Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center font-sans">
        <div className="text-xl font-medium text-gray-500 animate-pulse">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-transparent p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/dashboard" className="text-red-600 font-semibold hover:underline">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-gray-900">My Orders</h1>
          <Link 
            to="/dashboard" 
            className="rounded-lg bg-white px-4 py-2 font-medium text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to Dashboard
          </Link>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🍕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't placed any pizza orders yet. Build your custom masterpiece and it will show up here!
            </p>
            <Link 
              to="/dashboard" 
              className="inline-block rounded-xl bg-orange-500 px-8 py-3 font-bold text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-colors"
            >
              Order a Pizza
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="bg-red-600 p-5 flex justify-between items-start">
                  <div>
                    <h3 className="text-white font-bold text-lg">Order #{order.id}</h3>
                    <p className="text-gray-400 text-xs mt-1">{formatDate(order.created_at)}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold \${
                    order.payment_id 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {order.payment_id ? 'PAID' : 'UNPAID'}
                  </div>
                </div>
                
                <div className="p-5 flex-grow">
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded-md text-xs font-semibold mb-3 \${
                      order.status === 'Order Received' ? 'bg-blue-100 text-blue-700' : 
                      order.status === 'In Kitchen' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'Sent to Delivery' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Base:</span>
                      <span className="font-medium text-gray-800">{order.base_name}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Sauce:</span>
                      <span className="font-medium text-gray-800">{order.sauce_name}</span>
                    </li>
                    <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-gray-500">Cheese:</span>
                      <span className="font-medium text-gray-800">{order.cheese_name}</span>
                    </li>
                    {order.vegetables && order.vegetables.length > 0 && order.vegetables[0] !== null && (
                      <li className="pt-1">
                        <span className="text-gray-500 block mb-1">Vegetables:</span>
                        <span className="text-gray-700 text-xs block leading-relaxed">
                          {order.vegetables.join(', ')}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xl font-black text-gray-900">৳{order.total_price}</span>
                  {!order.payment_id ? (
                     <Link 
                       to={`/checkout/\${order.id}`}
                       className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
                     >
                       Pay Now
                     </Link>
                  ) : (
                     <button
                       disabled
                       className="rounded-lg bg-green-100 px-4 py-2 text-sm font-bold text-green-700 cursor-default"
                     >
                       Completed
                     </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
