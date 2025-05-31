import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatbotLog } from '../../database/models/chatbotlog.model';
import { ChatbotlogService } from './chatbotlog.service';
import { ChatbotlogController } from './chatbotlog.controller';

@Module({
  imports: [SequelizeModule.forFeature([ChatbotLog])],
  controllers: [ChatbotlogController],
  providers: [ChatbotlogService],
  exports: [ChatbotlogService],
})
export class ChatbotlogModule {} 