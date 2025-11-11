// src/app/core/models/auth.model.ts
export interface LoginRequest {
  identifier : string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token?: string;
    user: any;
  };
}

export interface TokenData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expiry_date?: number;
}
