import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Product, CreateProductDto, UpdateProductDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private endpoint = '/products';

  constructor(private apiService: ApiService) {}

  getAllProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.endpoint);
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.apiService.get<Product[]>(`${this.endpoint}?categoryId=${categoryId}`);
  }

  getProductsByCompany(companyId: string): Observable<Product[]> {
    return this.apiService.get<Product[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  searchProducts(query: string, companyId?: string): Observable<Product[]> {
    const params: any = { search: query };
    if (companyId) params.companyId = companyId;
    return this.apiService.get<Product[]>(this.endpoint, params);
  }

  createProduct(productData: CreateProductDto): Observable<Product> {
    return this.apiService.post<Product>(this.endpoint, productData);
  }

  updateProduct(id: string, productData: UpdateProductDto): Observable<Product> {
    return this.apiService.patch<Product>(`${this.endpoint}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleAvailability(id: string): Observable<Product> {
    return this.apiService.patch<Product>(`${this.endpoint}/${id}/toggle-availability`, {});
  }
} 