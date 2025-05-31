import { IsNotEmpty, IsOptional, IsUUID, IsString, IsEnum, IsArray } from 'class-validator';
import { OrderStatus } from '../../../database/models/order.model';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @IsString()
  @IsOptional()
  tableNumber?: string;

  @IsString()
  @IsOptional()
  customerName?: string;

  @IsString()
  @IsOptional()
  customerPhone?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsArray()
  @IsNotEmpty()
  items: Array<{ productId: string; qty: number; price: number; currency: string }>;
} 