import { PartialType } from '@nestjs/mapped-types';
import { CreateChatbotlogDto } from './create-chatbotlog.dto';

export class UpdateChatbotlogDto extends PartialType(CreateChatbotlogDto) {} 