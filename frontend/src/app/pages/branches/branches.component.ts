import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { BranchService, CompanyService, AuthService } from '../../services';
import { Branch, CreateBranchDto, UpdateBranchDto, Company } from '../../models';

@Component({
  selector: 'app-branches',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {
  branches: Branch[] = [];
  filteredBranches: Branch[] = [];
  companies: Company[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedBranch: Branch | null = null;
  
  // Forms
  branchForm!: FormGroup;
  searchForm!: FormGroup;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  
  // User info and filters
  currentUser: any = null;
  isAdmin = false;
  selectedCompanyId: string | null = null;

  // Math reference for template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private branchService: BranchService,
    private companyService: CompanyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCompanies();
    
    // Check for company filter from query params
    this.route.queryParams.subscribe(params => {
      if (params['companyId']) {
        this.selectedCompanyId = params['companyId'];
        this.searchForm.patchValue({ companyId: this.selectedCompanyId });
      }
      this.loadBranches();
    });
  }

  private initializeForms(): void {
    this.branchForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      phone: [''],
      email: ['', [Validators.email]],
      companyId: ['', [Validators.required]],
      isActive: [true]
    });

    this.searchForm = this.fb.group({
      search: [''],
      companyId: [''],
      status: ['all']
    });

    // Search functionality
    this.searchForm.valueChanges.subscribe(() => {
      this.filterBranches();
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
      
      // If user is not admin, set their company as default
      if (!this.isAdmin && this.currentUser?.companyId) {
        this.selectedCompanyId = this.currentUser.companyId;
        this.branchForm.patchValue({ companyId: this.currentUser.companyId });
        this.searchForm.patchValue({ companyId: this.currentUser.companyId });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  async loadCompanies(): Promise<void> {
    if (!this.isAdmin) return;
    
    try {
      this.companies = await this.companyService.getAllCompanies().toPromise() || [];
    } catch (error: any) {
      console.error('Error loading companies:', error);
    }
  }

  async loadBranches(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      if (this.selectedCompanyId) {
        this.branches = await this.branchService.getBranchesByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.branches = await this.branchService.getAllBranches().toPromise() || [];
      } else {
        this.branches = [];
      }
      this.filterBranches();
    } catch (error: any) {
      this.error = error.error?.message || 'Şubeler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterBranches(): void {
    const { search, companyId, status } = this.searchForm.value;
    
    this.filteredBranches = this.branches.filter(branch => {
      const matchesSearch = !search || 
        branch.name.toLowerCase().includes(search.toLowerCase()) ||
        branch.address.toLowerCase().includes(search.toLowerCase()) ||
        (branch.phone && branch.phone.includes(search)) ||
        (branch.email && branch.email.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCompany = !companyId || branch.companyId === companyId;
      
      const matchesStatus = status === 'all' || 
        (status === 'active' && branch.isActive) ||
        (status === 'inactive' && !branch.isActive);
      
      return matchesSearch && matchesCompany && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredBranches.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedBranches(): Branch[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredBranches.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.branchForm.reset();
    this.branchForm.patchValue({ 
      isActive: true,
      companyId: this.selectedCompanyId || (this.isAdmin ? '' : this.currentUser?.companyId)
    });
    this.error = null;
    this.success = null;
  }

  openEditModal(branch: Branch): void {
    this.selectedBranch = branch;
    this.showEditModal = true;
    this.branchForm.patchValue(branch);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(branch: Branch): void {
    this.selectedBranch = branch;
    this.showDeleteModal = true;
    this.error = null;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedBranch = null;
    this.branchForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createBranch(): Promise<void> {
    if (!this.branchForm.valid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const branchData: CreateBranchDto = this.branchForm.value;
      await this.branchService.createBranch(branchData).toPromise();
      
      this.success = 'Şube başarıyla oluşturuldu!';
      await this.loadBranches();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şube oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateBranch(): Promise<void> {
    if (!this.branchForm.valid || !this.selectedBranch) {
      this.branchForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const branchData: UpdateBranchDto = this.branchForm.value;
      await this.branchService.updateBranch(this.selectedBranch.id, branchData).toPromise();
      
      this.success = 'Şube başarıyla güncellendi!';
      await this.loadBranches();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şube güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteBranch(): Promise<void> {
    if (!this.selectedBranch) return;

    this.loading = true;
    this.error = null;

    try {
      await this.branchService.deleteBranch(this.selectedBranch.id).toPromise();
      
      this.success = 'Şube başarıyla silindi!';
      await this.loadBranches();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şube silinirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Utility methods
  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
  }

  getStatusText(isActive: boolean): string {
    return isActive ? 'Aktif' : 'Pasif';
  }

  getCompanyName(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company?.name || 'Bilinmeyen Şirket';
  }

  // Form getters
  get name() { return this.branchForm.get('name'); }
  get address() { return this.branchForm.get('address'); }
  get phone() { return this.branchForm.get('phone'); }
  get email() { return this.branchForm.get('email'); }
  get companyId() { return this.branchForm.get('companyId'); }
  get isActive() { return this.branchForm.get('isActive'); }
} 