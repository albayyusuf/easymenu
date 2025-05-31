import { IsNotEmpty, IsOptional, IsUUID, IsObject } from 'class-validator';

export class CreateChatbotlogDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  menuId?: string;

  @IsObject()
  @IsNotEmpty()
  request: any;

  @IsObject()
  @IsNotEmpty()
  response: any;
} 