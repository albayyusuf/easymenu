import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private endpoint = '/categories';

  constructor(private apiService: ApiService) {}

  getAllCategories(): Observable<Category[]> {
    return this.apiService.get<Category[]>(this.endpoint);
  }

  getCategoryById(id: string): Observable<Category> {
    return this.apiService.get<Category>(`${this.endpoint}/${id}`);
  }

  getCategoriesByCompany(companyId: string): Observable<Category[]> {
    return this.apiService.get<Category[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  createCategory(categoryData: CreateCategoryDto): Observable<Category> {
    return this.apiService.post<Category>(this.endpoint, categoryData);
  }

  updateCategory(id: string, categoryData: UpdateCategoryDto): Observable<Category> {
    return this.apiService.patch<Category>(`${this.endpoint}/${id}`, categoryData);
  }

  deleteCategory(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  reorderCategories(companyId: string, categoryIds: string[]): Observable<void> {
    return this.apiService.post<void>(`${this.endpoint}/reorder`, { companyId, categoryIds });
  }
} 