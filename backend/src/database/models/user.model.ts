import { Column, Model, Table, DataType, BelongsTo, ForeignKey } from 'sequelize-typescript';
import { Company } from './company.model';

export enum UserRole {
  ADMIN = 'admin',
  COMPANY_OWNER = 'company_owner',
  BRANCH_MANAGER = 'branch_manager',
  STAFF = 'staff',
}

@Table({
  tableName: 'users',
  timestamps: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    defaultValue: UserRole.STAFF,
  })
  role: UserRole;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  lastLoginAt: Date;
} 