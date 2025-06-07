import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ChatbotLog, CreateChatbotLogDto, UpdateChatbotLogDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private endpoint = '/chatbotlogs';

  constructor(private apiService: ApiService) {}

  getAllChatbotLogs(): Observable<ChatbotLog[]> {
    return this.apiService.get<ChatbotLog[]>(this.endpoint);
  }

  getChatbotLogById(id: string): Observable<ChatbotLog> {
    return this.apiService.get<ChatbotLog>(`${this.endpoint}/${id}`);
  }

  getChatbotLogsBySession(sessionId: string): Observable<ChatbotLog[]> {
    return this.apiService.get<ChatbotLog[]>(`${this.endpoint}?sessionId=${sessionId}`);
  }

  getChatbotLogsByCompany(companyId: string): Observable<ChatbotLog[]> {
    return this.apiService.get<ChatbotLog[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  createChatbotLog(logData: CreateChatbotLogDto): Observable<ChatbotLog> {
    return this.apiService.post<ChatbotLog>(this.endpoint, logData);
  }

  updateChatbotLog(id: string, logData: UpdateChatbotLogDto): Observable<ChatbotLog> {
    return this.apiService.patch<ChatbotLog>(`${this.endpoint}/${id}`, logData);
  }

  deleteChatbotLog(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
} 