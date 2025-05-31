import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatbotLog } from '../../database/models/chatbotlog.model';
import { CreateChatbotlogDto } from './dto/create-chatbotlog.dto';
import { UpdateChatbotlogDto } from './dto/update-chatbotlog.dto';

@Injectable()
export class ChatbotlogService {
  constructor(
    @InjectModel(ChatbotLog)
    private readonly chatbotlogModel: typeof ChatbotLog,
  ) {}

  async create(createChatbotlogDto: CreateChatbotlogDto): Promise<ChatbotLog> {
    return this.chatbotlogModel.create(createChatbotlogDto as any);
  }

  async findAll(): Promise<ChatbotLog[]> {
    return this.chatbotlogModel.findAll();
  }

  async findOne(id: string): Promise<ChatbotLog> {
    const log = await this.chatbotlogModel.findByPk(id);
    if (!log) throw new NotFoundException('ChatbotLog not found');
    return log;
  }

  async update(id: string, updateChatbotlogDto: UpdateChatbotlogDto): Promise<ChatbotLog> {
    const log = await this.findOne(id);
    return log.update(updateChatbotlogDto as any);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await log.destroy();
  }
} 