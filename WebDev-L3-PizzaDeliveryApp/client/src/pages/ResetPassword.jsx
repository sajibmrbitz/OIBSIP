import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-orange-50 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="mb-2 text-center text-3xl font-bold text-gray-800">Set New Password</h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Please enter your new password below.
        </p>

        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</div>}
        {message && (
          <div className="mb-4 rounded-md bg-green-50 p-4 text-center">
            <p className="text-sm text-green-700 mb-2">{message}</p>
            <Link to="/login" className="font-semibold text-red-600 hover:text-red-700 underline">
              Go to Login
            </Link>
          </div>
        )}

        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition-colors"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
