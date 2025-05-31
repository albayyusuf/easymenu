import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Menu } from './menu.model';

@Table({
  tableName: 'qrs',
  timestamps: true,
})
export class QR extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  menuId: string;

  @BelongsTo(() => Menu)
  menu: Menu;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qrUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  pdfUrl: string;
} 