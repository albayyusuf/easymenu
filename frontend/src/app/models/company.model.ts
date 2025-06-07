export interface Company {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCompanyDto {
  name: string;
  slug: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  description?: string;
  email: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

export interface UpdateCompanyDto extends Partial<CreateCompanyDto> {} 