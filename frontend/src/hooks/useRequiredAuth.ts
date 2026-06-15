import type { AuthContextType } from '@/contexts/AuthContext';
import type { UserProfile } from '@/services/userService';
import useAuth from './useAuth';

interface AuthenticatedContextType extends AuthContextType {
  token: string;
  user: UserProfile;
  loading: false;
}

const useRequiredAuth = (): AuthenticatedContextType => {
  const context = useAuth();

  if (context.loading || !context.user) {
    throw new Error("'useRequiredAuth' must be used in an authenticated route");
  }

  return context as AuthenticatedContextType;
};

export default useRequiredAuth;
