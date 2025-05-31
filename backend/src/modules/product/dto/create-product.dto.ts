import { IsNotEmpty, IsOptional, IsUUID, IsNumber, IsObject, IsString, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsObject()
  @IsNotEmpty()
  name: Record<string, string>;

  @IsObject()
  @IsOptional()
  description?: Record<string, string>;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 