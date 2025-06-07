// Auth & User
export * from './user.model';

// Auth interfaces
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  companyId?: string;
}

export interface AuthResponse {
  access_token: string;
  user: any;
  token?: string; // Backward compatibility
}

// Company
export * from './company.model';

// Branch
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBranchDto {
  name: string;
  address: string;
  phone?: string;
  email?: string;
  companyId: string;
  isActive?: boolean;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {}

// Category
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  sortOrder: number;
  companyId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  image?: string;
  sortOrder?: number;
  companyId: string;
  isActive?: boolean;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

// Product
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  companyId: string;
  isAvailable: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  image?: string;
  categoryId: string;
  companyId: string;
  isAvailable?: boolean;
  ingredients?: string[];
  allergens?: string[];
  nutritionInfo?: any;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

// Menu
export interface Menu {
  id: string;
  name: string;
  description?: string;
  branchId: string;
  companyId: string;
  isActive: boolean;
  isPublished: boolean;
  menuType: 'regular' | 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'beverage';
  validFrom?: Date;
  validTo?: Date;
  menuItems?: any[];
  categories: Category[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMenuDto {
  name: string;
  description?: string;
  branchId: string;
  companyId: string;
  isActive?: boolean;
  isPublished?: boolean;
  menuType?: 'regular' | 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'beverage';
  validFrom?: Date;
  validTo?: Date;
}

export interface UpdateMenuDto extends Partial<CreateMenuDto> {}

// Order
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  branchId: string;
  companyId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrderDto {
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  items: OrderItem[];
  branchId: string;
  companyId: string;
  notes?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}

export interface UpdateOrderDto extends Partial<CreateOrderDto> {
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'online';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDto {
  orderId: string;
  amount: number;
  method: 'cash' | 'card' | 'online';
  transactionId?: string;
}

export interface UpdatePaymentDto extends Partial<CreatePaymentDto> {
  status?: 'pending' | 'completed' | 'failed' | 'refunded';
}

// QR Code
export interface QrCode {
  id: string;
  tableNumber: string;
  branchId: string;
  companyId: string;
  qrCodeUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQrDto {
  tableNumber: string;
  branchId: string;
  companyId: string;
}

export interface UpdateQrDto extends Partial<CreateQrDto> {
  isActive?: boolean;
}

// Chatbot Log
export interface ChatbotLog {
  id: string;
  sessionId: string;
  userMessage: string;
  botResponse: string;
  companyId: string;
  branchId?: string;
  createdAt: Date;
}

export interface CreateChatbotLogDto {
  sessionId: string;
  userMessage: string;
  botResponse: string;
  companyId: string;
  branchId?: string;
}

export interface UpdateChatbotLogDto extends Partial<CreateChatbotLogDto> {}

// I18n (Internationalization)
export interface I18n {
  key: string;
  tr: string;
  en: string;
  ar?: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateI18nDto {
  key: string;
  tr: string;
  en: string;
  ar?: string;
  companyId: string;
}

export interface UpdateI18nDto extends Partial<CreateI18nDto> {} 