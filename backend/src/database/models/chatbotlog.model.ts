import { Column, Model, Table, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Company } from './company.model';
import { User } from './user.model';
import { Menu } from './menu.model';

@Table({
  tableName: 'chatbot_logs',
  timestamps: true,
})
export class ChatbotLog extends Model {
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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Menu)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  menuId: string;

  @BelongsTo(() => Menu)
  menu: Menu;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  request: any;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  response: any;
} 