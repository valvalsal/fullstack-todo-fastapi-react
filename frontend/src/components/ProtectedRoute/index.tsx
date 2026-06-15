import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router';

import useAuth from '@/hooks/useAuth';
import Loader from '../Loader';
import Header from '../Header';

const ProtectedRoute = () => {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
