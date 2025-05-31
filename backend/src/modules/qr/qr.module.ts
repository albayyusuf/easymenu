import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { QR } from '../../database/models/qr.model';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';

@Module({
  imports: [SequelizeModule.forFeature([QR])],
  controllers: [QrController],
  providers: [QrService],
  exports: [QrService],
})
export class QrModule {} 