import { IsNotEmpty, IsOptional, IsUUID, IsString } from 'class-validator';

export class CreateQrDto {
  @IsUUID()
  @IsNotEmpty()
  menuId: string;

  @IsString()
  @IsNotEmpty()
  qrUrl: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;
} 