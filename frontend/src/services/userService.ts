import api from '@/api';

export interface UserCredentials {
  [key: string]: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  full_name?: string;
  profile_pic?: string;
}

const loginUser = async (
  credentials: UserCredentials,
): Promise<TokenResponse | undefined> => {
  try {
    const params = new URLSearchParams();
    for (const key in credentials) {
      params.append(key, credentials[key]);
    }

    const response = await api.post<TokenResponse>('/auth/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (e) {
    console.error('Login error:', e);
    return undefined;
  }
};

const fetchUserProfile = async (): Promise<UserProfile | undefined> => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (e) {
    console.error('Profile fetch error:', e);
    return undefined;
  }
};

export { loginUser, fetchUserProfile };
