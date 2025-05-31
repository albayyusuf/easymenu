import { IsNotEmpty, IsOptional, IsUUID, IsString, IsBoolean } from 'class-validator';

export class CreateMenuDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsUUID()
  @IsNotEmpty()
  branchId: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  colorCode?: string;

  @IsString()
  @IsOptional()
  prompt?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 