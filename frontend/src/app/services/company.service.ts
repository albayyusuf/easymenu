import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private endpoint = '/companies';

  constructor(private apiService: ApiService) {}

  // Tüm şirketleri getir
  getAllCompanies(): Observable<Company[]> {
    return this.apiService.get<Company[]>(this.endpoint);
  }

  // ID ile şirket getir
  getCompanyById(id: string): Observable<Company> {
    return this.apiService.get<Company>(`${this.endpoint}/${id}`);
  }

  // Slug ile şirket getir
  getCompanyBySlug(slug: string): Observable<Company> {
    return this.apiService.get<Company>(`${this.endpoint}/slug/${slug}`);
  }

  // Yeni şirket oluştur
  createCompany(companyData: CreateCompanyDto): Observable<Company> {
    return this.apiService.post<Company>(this.endpoint, companyData);
  }

  // Şirket güncelle
  updateCompany(id: string, companyData: UpdateCompanyDto): Observable<Company> {
    return this.apiService.patch<Company>(`${this.endpoint}/${id}`, companyData);
  }

  // Şirket sil
  deleteCompany(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Şirket slug'ı kontrol et (benzersizlik için)
  checkSlugAvailability(slug: string, excludeId?: string): Observable<{ available: boolean }> {
    const params = excludeId ? { excludeId } : {};
    return this.apiService.get<{ available: boolean }>(`${this.endpoint}/check-slug/${slug}`, params);
  }
} 