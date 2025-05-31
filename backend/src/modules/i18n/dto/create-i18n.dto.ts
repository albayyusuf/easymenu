import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateI18nDto {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsObject()
  @IsNotEmpty()
  translations: Record<string, string>;
} 