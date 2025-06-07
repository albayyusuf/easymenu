export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'company_owner' | 'branch_manager' | 'staff';
  companyId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'company_owner' | 'branch_manager' | 'staff';
  companyId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
} 