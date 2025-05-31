import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { I18n } from '../../database/models/i18n.model';
import { CreateI18nDto } from './dto/create-i18n.dto';
import { UpdateI18nDto } from './dto/update-i18n.dto';

@Injectable()
export class I18nService {
  constructor(
    @InjectModel(I18n)
    private readonly i18nModel: typeof I18n,
  ) {}

  async create(createI18nDto: CreateI18nDto): Promise<I18n> {
    return this.i18nModel.create(createI18nDto as any);
  }

  async findAll(): Promise<I18n[]> {
    return this.i18nModel.findAll();
  }

  async findOne(key: string): Promise<I18n> {
    const i18n = await this.i18nModel.findByPk(key);
    if (!i18n) throw new NotFoundException('I18n key not found');
    return i18n;
  }

  async update(key: string, updateI18nDto: UpdateI18nDto): Promise<I18n> {
    const i18n = await this.findOne(key);
    return i18n.update(updateI18nDto as any);
  }

  async remove(key: string): Promise<void> {
    const i18n = await this.findOne(key);
    await i18n.destroy();
  }
} 