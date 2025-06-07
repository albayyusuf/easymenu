import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Menu, CreateMenuDto, UpdateMenuDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private endpoint = '/menus';

  constructor(private apiService: ApiService) {}

  getAllMenus(): Observable<Menu[]> {
    return this.apiService.get<Menu[]>(this.endpoint);
  }

  getMenuById(id: string): Observable<Menu> {
    return this.apiService.get<Menu>(`${this.endpoint}/${id}`);
  }

  getMenusByBranch(branchId: string): Observable<Menu[]> {
    return this.apiService.get<Menu[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  getMenusByCompany(companyId: string): Observable<Menu[]> {
    return this.apiService.get<Menu[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  createMenu(menuData: CreateMenuDto): Observable<Menu> {
    return this.apiService.post<Menu>(this.endpoint, menuData);
  }

  updateMenu(id: string, menuData: UpdateMenuDto): Observable<Menu> {
    return this.apiService.patch<Menu>(`${this.endpoint}/${id}`, menuData);
  }

  deleteMenu(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  toggleStatus(id: string): Observable<Menu> {
    return this.apiService.patch<Menu>(`${this.endpoint}/${id}/toggle-status`, {});
  }

  togglePublished(id: string): Observable<Menu> {
    return this.apiService.patch<Menu>(`${this.endpoint}/${id}/toggle-published`, {});
  }

  getPublicMenu(branchId: string, tableNumber?: string): Observable<Menu> {
    const params = tableNumber ? { tableNumber } : {};
    return this.apiService.get<Menu>(`${this.endpoint}/public/${branchId}`, params);
  }
} 