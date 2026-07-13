import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('No verification token provided');
        setLoading(false);
        return;
      }
      try {
        const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setMessage(res.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-orange-50 font-sans">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Email Verification</h2>
        
        {loading ? (
          <div className="text-gray-600">Verifying your email, please wait...</div>
        ) : error ? (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-600">{error}</div>
        ) : (
          <div className="mb-6 rounded-md bg-green-50 p-4 text-green-700">{message}</div>
        )}

        {!loading && (
          <Link
            to="/login"
            className="inline-block rounded-lg bg-red-600 px-6 py-2 text-white font-medium hover:bg-red-700 transition-colors"
          >
            Go to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
