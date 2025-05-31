import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsBoolean, IsHexColor } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Albayrak Restaurant' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'albayrak-restaurant' })
  @IsString()
  slug: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({ example: '#FF0000', required: false })
  @IsHexColor()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ example: '#0000FF', required: false })
  @IsHexColor()
  @IsOptional()
  secondaryColor?: string;

  @ApiProperty({ example: 'Best Turkish cuisine in town', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'info@albayrak.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+90 555 123 4567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '123 Main St, Istanbul', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
