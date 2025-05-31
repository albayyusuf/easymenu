import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QR } from '../../database/models/qr.model';
import { CreateQrDto } from './dto/create-qr.dto';
import { UpdateQrDto } from './dto/update-qr.dto';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(QR)
    private readonly qrModel: typeof QR,
  ) {}

  async create(createQrDto: CreateQrDto): Promise<QR> {
    return this.qrModel.create(createQrDto as any);
  }

  async findAll(): Promise<QR[]> {
    return this.qrModel.findAll();
  }

  async findOne(id: string): Promise<QR> {
    const qr = await this.qrModel.findByPk(id);
    if (!qr) throw new NotFoundException('QR not found');
    return qr;
  }

  async update(id: string, updateQrDto: UpdateQrDto): Promise<QR> {
    const qr = await this.findOne(id);
    return qr.update(updateQrDto as any);
  }

  async remove(id: string): Promise<void> {
    const qr = await this.findOne(id);
    await qr.destroy();
  }
} 