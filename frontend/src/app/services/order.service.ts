import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Order, CreateOrderDto, UpdateOrderDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private endpoint = '/orders';

  constructor(private apiService: ApiService) {}

  getAllOrders(): Observable<Order[]> {
    return this.apiService.get<Order[]>(this.endpoint);
  }

  getOrderById(id: string): Observable<Order> {
    return this.apiService.get<Order>(`${this.endpoint}/${id}`);
  }

  getOrdersByBranch(branchId: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  getOrdersByCompany(companyId: string): Observable<Order[]> {
    return this.apiService.get<Order[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  getOrdersByStatus(status: string, branchId?: string): Observable<Order[]> {
    const params: any = { status };
    if (branchId) params.branchId = branchId;
    return this.apiService.get<Order[]>(this.endpoint, params);
  }

  getTodaysOrders(branchId?: string): Observable<Order[]> {
    const params = branchId ? { branchId, date: 'today' } : { date: 'today' };
    return this.apiService.get<Order[]>(this.endpoint, params);
  }

  createOrder(orderData: CreateOrderDto): Observable<Order> {
    return this.apiService.post<Order>(this.endpoint, orderData);
  }

  updateOrder(id: string, orderData: UpdateOrderDto): Observable<Order> {
    return this.apiService.patch<Order>(`${this.endpoint}/${id}`, orderData);
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.apiService.patch<Order>(`${this.endpoint}/${id}`, { status });
  }

  updatePaymentStatus(id: string, paymentStatus: string): Observable<Order> {
    return this.apiService.patch<Order>(`${this.endpoint}/${id}`, { paymentStatus });
  }

  deleteOrder(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  getOrderStatistics(branchId?: string, dateRange?: { start: Date, end: Date }): Observable<any> {
    const params: any = {};
    if (branchId) params.branchId = branchId;
    if (dateRange) {
      params.startDate = dateRange.start.toISOString();
      params.endDate = dateRange.end.toISOString();
    }
    return this.apiService.get<any>(`${this.endpoint}/statistics`, params);
  }
} 