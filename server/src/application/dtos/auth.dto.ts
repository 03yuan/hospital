export interface RegisterRequest {
  phone: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface UserInfo {
  id: number;
  phone: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}
