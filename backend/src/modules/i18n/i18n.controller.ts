import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { I18nService } from './i18n.service';
import { CreateI18nDto } from './dto/create-i18n.dto';
import { UpdateI18nDto } from './dto/update-i18n.dto';

@Controller('i18n')
export class I18nController {
  constructor(private readonly i18nService: I18nService) {}

  @Post()
  create(@Body() createI18nDto: CreateI18nDto) {
    return this.i18nService.create(createI18nDto);
  }

  @Get()
  findAll() {
    return this.i18nService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.i18nService.findOne(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body() updateI18nDto: UpdateI18nDto) {
    return this.i18nService.update(key, updateI18nDto);
  }

  @Delete(':key')
  remove(@Param('key') key: string) {
    return this.i18nService.remove(key);
  }
} 