import { IsNotEmpty, IsOptional, IsUUID, IsString, IsNumber, IsEnum } from 'class-validator';
import { PaymentStatus } from '../../../database/models/payment.model';

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @IsString()
  @IsNotEmpty()
  plan: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  stripeSessionId?: string;
} 