import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';
import { I18n, CreateI18nDto, UpdateI18nDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private endpoint = '/i18n';
  private currentLanguageSubject = new BehaviorSubject<string>('tr');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(private apiService: ApiService) {
    const savedLanguage = localStorage.getItem('language') || 'tr';
    this.currentLanguageSubject.next(savedLanguage);
  }

  getAllTranslations(): Observable<I18n[]> {
    return this.apiService.get<I18n[]>(this.endpoint);
  }

  getTranslationByKey(key: string): Observable<I18n> {
    return this.apiService.get<I18n>(`${this.endpoint}/${key}`);
  }

  getTranslationsByCompany(companyId: string): Observable<I18n[]> {
    return this.apiService.get<I18n[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  createTranslation(translationData: CreateI18nDto): Observable<I18n> {
    return this.apiService.post<I18n>(this.endpoint, translationData);
  }

  updateTranslation(key: string, translationData: UpdateI18nDto): Observable<I18n> {
    return this.apiService.patch<I18n>(`${this.endpoint}/${key}`, translationData);
  }

  deleteTranslation(key: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${key}`);
  }

  setCurrentLanguage(language: string): void {
    localStorage.setItem('language', language);
    this.currentLanguageSubject.next(language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  translate(key: string, translations: I18n[]): string {
    const translation = translations.find(t => t.key === key);
    if (!translation) return key;

    const currentLang = this.getCurrentLanguage();
    switch (currentLang) {
      case 'en':
        return translation.en || translation.tr || key;
      case 'ar':
        return translation.ar || translation.tr || key;
      default:
        return translation.tr || key;
    }
  }
} 