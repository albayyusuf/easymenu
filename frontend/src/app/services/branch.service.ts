import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Branch, CreateBranchDto, UpdateBranchDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  private endpoint = '/branches';

  constructor(private apiService: ApiService) {}

  getAllBranches(): Observable<Branch[]> {
    return this.apiService.get<Branch[]>(this.endpoint);
  }

  getBranchById(id: string): Observable<Branch> {
    return this.apiService.get<Branch>(`${this.endpoint}/${id}`);
  }

  getBranchesByCompany(companyId: string): Observable<Branch[]> {
    return this.apiService.get<Branch[]>(`${this.endpoint}?companyId=${companyId}`);
  }

  createBranch(branchData: CreateBranchDto): Observable<Branch> {
    return this.apiService.post<Branch>(this.endpoint, branchData);
  }

  updateBranch(id: string, branchData: UpdateBranchDto): Observable<Branch> {
    return this.apiService.patch<Branch>(`${this.endpoint}/${id}`, branchData);
  }

  deleteBranch(id: string): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }
} 