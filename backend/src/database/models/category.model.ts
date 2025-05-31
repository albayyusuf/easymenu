import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Company } from './company.model';

@Table({
  tableName: 'categories',
  timestamps: true,
})
export class Category extends Model {
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

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  name: Record<string, string>; // { tr: '...', en: '...' }

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  order: number;
} 