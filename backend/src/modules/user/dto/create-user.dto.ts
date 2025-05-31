import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../database/models/user.model';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'password123' })
  password: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.STAFF })
  role?: UserRole;

  @ApiProperty({ example: '11111111-1111-1111-1111-111111111111', required: false })
  companyId?: string;
} 