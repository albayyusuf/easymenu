import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { ChatbotlogService } from './chatbotlog.service';
import { CreateChatbotlogDto } from './dto/create-chatbotlog.dto';
import { UpdateChatbotlogDto } from './dto/update-chatbotlog.dto';

@Controller('chatbotlogs')
export class ChatbotlogController {
  constructor(private readonly chatbotlogService: ChatbotlogService) {}

  @Post()
  create(@Body() createChatbotlogDto: CreateChatbotlogDto) {
    return this.chatbotlogService.create(createChatbotlogDto);
  }

  @Get()
  findAll() {
    return this.chatbotlogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatbotlogService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatbotlogDto: UpdateChatbotlogDto) {
    return this.chatbotlogService.update(id, updateChatbotlogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatbotlogService.remove(id);
  }
} 