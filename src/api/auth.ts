import { request } from '../utils/request';

export interface LoginParams {
  username: string;
  password: string; // Base64(RSA_Encrypt(password))
}

export interface LoginResult {
  token: string;
  userInfo: UserInfo;
}

export interface UserInfo {
  id: string;
  username: string;
  avatar?: string;
}

export const login = (data: LoginParams) => {
  return request.post<LoginResult>('/v1/backstage/auth/login', data);
};

export const getUserInfo = () => {
  return request.get<UserInfo>('/v1/backstage/auth/me');
};

export const logout = () => {
  return request.post<void>('/v1/backstage/auth/logout');
};

export const getPublicKey = () => {
  return request.get<{ publicKey: string }>('/v1/backstage/auth/public-key');
};
