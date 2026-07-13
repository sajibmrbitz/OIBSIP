import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import LogoText from '../components/LogoText';

const AdminDashboard = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/inventory');
      setInventory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/admin/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory') {
      fetchInventory();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await axiosInstance.put(`/admin/inventory/${id}`, { stockQuantity: Number(newStock) });
      setInventory(inventory.map(item => item.id === id ? { ...item, stock_quantity: Number(newStock) } : item));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update stock');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-transparent font-sans text-gray-800">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-3">
              <img src="/images/logo.jpg" alt="PizzaHub Logo" className="h-8 w-8 object-contain shadow-sm rounded-md" />
              <div className="flex items-center space-x-2">
                <LogoText className="text-xl" />
                <span className="text-xl font-bold text-gray-900 tracking-tight">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-gray-600">{user?.email}</span>
              <button 
                onClick={handleLogout}
                className="text-sm rounded border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex space-x-6 border-b border-gray-300">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 px-1 text-sm font-semibold \${activeTab === 'inventory' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Inventory Management
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-1 text-sm font-semibold \${activeTab === 'orders' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Order Fulfillments
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 animate-pulse font-medium">Loading data...</div>
        ) : (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
            {activeTab === 'inventory' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Threshold</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock Quantity</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map(item => (
                      <tr key={item.id} className={item.stock_quantity < item.threshold ? 'bg-red-50' : 'hover:bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {item.name}
                          {item.stock_quantity < item.threshold && (
                            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                              Low Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.item_type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.threshold}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input 
                            type="number" 
                            className="border border-gray-300 rounded px-3 py-1.5 w-24 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-gray-800 focus:border-gray-800"
                            defaultValue={item.stock_quantity}
                            id={`stock-${item.id}`}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => {
                              const val = document.getElementById(`stock-${item.id}`).value;
                              handleStockUpdate(item.id, val);
                            }}
                            className="rounded bg-gray-100 border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="font-bold text-gray-800">{order.user_name}</div>
                          <div className="text-gray-500 text-xs mt-0.5">{order.user_email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 text-sm text-gray-600 min-w-[250px] leading-relaxed">
                          <div><span className="font-semibold text-gray-800">Base:</span> {order.base_name}</div>
                          <div><span className="font-semibold text-gray-800">Sauce:</span> {order.sauce_name}</div>
                          <div><span className="font-semibold text-gray-800">Cheese:</span> {order.cheese_name}</div>
                          {order.vegetables && order.vegetables.length > 0 && order.vegetables[0] !== null && (
                            <div><span className="font-semibold text-gray-800">Veg:</span> {order.vegetables.join(', ')}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">৳{order.total_price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <select 
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className={`border rounded px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-1 \${
                              order.status === 'Order Received' ? 'border-blue-300 bg-blue-50 text-blue-800 focus:ring-blue-500' :
                              order.status === 'In Kitchen' ? 'border-yellow-300 bg-yellow-50 text-yellow-800 focus:ring-yellow-500' :
                              'border-green-300 bg-green-50 text-green-800 focus:ring-green-500'
                            }`}
                          >
                            <option value="Order Received">Order Received</option>
                            <option value="In Kitchen">In Kitchen</option>
                            <option value="Sent to Delivery">Sent to Delivery</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <div className="p-12 text-center text-gray-500 font-medium">No paid orders found.</div>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
