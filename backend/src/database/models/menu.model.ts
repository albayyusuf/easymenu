import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Company } from './company.model';
import { Branch } from './branch.model';

@Table({
  tableName: 'menus',
  timestamps: true,
})
export class Menu extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Company)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  companyId: string;

  @BelongsTo(() => Company)
  company: Company;

  @ForeignKey(() => Branch)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  branchId: string;

  @BelongsTo(() => Branch)
  branch: Branch;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logoUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  colorCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  prompt: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive: boolean;
} 