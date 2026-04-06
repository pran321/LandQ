import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      alert('Google authentication failed. Please try again.');
      navigate('/login');
      return;
    }

    if (token) {
      // Store token and fetch user data
      localStorage.setItem('token', token);
      
      // Fetch user data
      const apiUrl = import.meta.env?.VITE_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            login(data.user, token);
            navigate('/dashboard');
          } else {
            throw new Error('Failed to fetch user data');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Failed to complete login. Please try again.');
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing Google sign in...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;
