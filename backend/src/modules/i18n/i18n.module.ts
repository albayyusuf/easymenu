import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { I18n } from '../../database/models/i18n.model';
import { I18nService } from './i18n.service';
import { I18nController } from './i18n.controller';

@Module({
  imports: [SequelizeModule.forFeature([I18n])],
  controllers: [I18nController],
  providers: [I18nService],
  exports: [I18nService],
})
export class I18nModule {} 