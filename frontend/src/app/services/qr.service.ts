import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { QrCode, CreateQrDto, UpdateQrDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private endpoint = '/qrs';

  constructor(private apiService: ApiService) {}

  getAllQrCodes(): Observable<QrCode[]> {
    return this.apiService.get<QrCode[]>(this.endpoint);
  }

  getQrCodeById(id: string): Observable<QrCode> {
    return this.apiService.get<QrCode>(`${this.endpoint}/${id}`);
  }

  getQrCodesByBranch(branchId: string): Observable<QrCode[]> {
    return this.apiService.get<QrCode[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  createQrCode(qrData: CreateQrDto): Observable<QrCode> {
    return this.apiService.post<QrCode>(this.endpoint, qrData);
  }

  updateQrCode(id: string, qrData: UpdateQrDto): Observable<QrCode> {
    return this.apiService.patch<QrCode>(`${this.endpoint}/${id}`, qrData);
  }

  deleteQrCode(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  generateBulkQrCodes(branchId: string, companyId: string, tableCount: number): Observable<QrCode[]> {
    return this.apiService.post<QrCode[]>(`${this.endpoint}/bulk`, {
      branchId,
      companyId,
      tableCount
    });
  }
} 