import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Menu } from './menu.model';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Table({
  tableName: 'orders',
  timestamps: true,
})
export class Order extends Model {
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
    allowNull: true,
  })
  tableNumber: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  customerPhone: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    defaultValue: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  items: Array<{ productId: string; qty: number; price: number; currency: string }>;
} 