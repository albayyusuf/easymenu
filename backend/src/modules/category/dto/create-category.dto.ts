import { IsNotEmpty, IsOptional, IsUUID, IsNumber, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsObject()
  @IsNotEmpty()
  name: Record<string, string>;

  @IsNumber()
  @IsOptional()
  order?: number;
} 