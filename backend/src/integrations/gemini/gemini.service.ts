import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeminiService {
  async askGemini(prompt: string) {
    // Burada gerçek Gemini API endpoint ve key kullanılmalı
    const response = await axios.post('https://gemini.api/ask', { prompt });
    return response.data;
  }
}