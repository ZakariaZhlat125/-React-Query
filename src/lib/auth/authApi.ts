import type { AuthUser, LoginCredentials, LoginResponse } from '../../types';
import { api } from '../api/client';

interface LoginApiResponse {
  data: {
    token: string;
    refreshToken: string;
    userData: AuthUser;
  };
}

export async function loginWithCredentials(credentials: LoginCredentials): Promise<LoginResponse> {
  const { data } = await api.post<LoginApiResponse>('/auth/login', credentials);
  const { token, refreshToken, userData } = data.data;
  return { access_token: token, refresh_token: refreshToken, user: userData };
}
