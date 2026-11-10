export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string; // Placeholder for future token (e.g. JWT)
}
