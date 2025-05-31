import { Column, Model, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'i18n',
  timestamps: false,
})
export class I18n extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  key: string;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  translations: Record<string, string>; // { tr: '...', en: '...' }
} 