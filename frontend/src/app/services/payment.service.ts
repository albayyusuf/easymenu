import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Payment, CreatePaymentDto, UpdatePaymentDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private endpoint = '/payments';

  constructor(private apiService: ApiService) {}

  getAllPayments(): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(this.endpoint);
  }

  getPaymentById(id: string): Observable<Payment> {
    return this.apiService.get<Payment>(`${this.endpoint}/${id}`);
  }

  getPaymentsByOrder(orderId: string): Observable<Payment[]> {
    return this.apiService.get<Payment[]>(`${this.endpoint}?orderId=${orderId}`);
  }

  createPayment(paymentData: CreatePaymentDto): Observable<Payment> {
    return this.apiService.post<Payment>(this.endpoint, paymentData);
  }

  updatePayment(id: string, paymentData: UpdatePaymentDto): Observable<Payment> {
    return this.apiService.patch<Payment>(`${this.endpoint}/${id}`, paymentData);
  }

  deletePayment(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  processPayment(paymentId: string): Observable<Payment> {
    return this.apiService.post<Payment>(`${this.endpoint}/${paymentId}/process`, {});
  }

  refundPayment(paymentId: string, amount?: number): Observable<Payment> {
    const data = amount ? { amount } : {};
    return this.apiService.post<Payment>(`${this.endpoint}/${paymentId}/refund`, data);
  }
} 