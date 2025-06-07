import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService, AuthService } from '../../services';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../../models';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedCompany: Company | null = null;
  
  // Forms
  companyForm!: FormGroup;
  searchForm!: FormGroup;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  
  // User info
  currentUser: any = null;
  isAdmin = false;

  // Math reference for template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private authService: AuthService
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCompanies();
  }

  private initializeForms(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      description: [''],
      isActive: [true]
    });

    this.searchForm = this.fb.group({
      search: [''],
      status: ['all']
    });

    // Auto-generate slug from company name
    this.companyForm.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.showEditModal) {
        const slug = this.generateSlug(name);
        this.companyForm.patchValue({ slug }, { emitEvent: false });
      }
    });

    // Search functionality
    this.searchForm.valueChanges.subscribe(() => {
      this.filterCompanies();
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  }

  async loadCompanies(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.companies = await this.companyService.getAllCompanies().toPromise() || [];
      this.filterCompanies();
    } catch (error: any) {
      this.error = error.error?.message || 'Şirketler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterCompanies(): void {
    const { search, status } = this.searchForm.value;
    
    this.filteredCompanies = this.companies.filter(company => {
      const matchesSearch = !search || 
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        company.email.toLowerCase().includes(search.toLowerCase()) ||
        company.slug.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = status === 'all' || 
        (status === 'active' && company.isActive) ||
        (status === 'inactive' && !company.isActive);
      
      return matchesSearch && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCompanies.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedCompanies(): Company[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCompanies.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.companyForm.reset();
    this.companyForm.patchValue({ isActive: true });
    this.error = null;
    this.success = null;
  }

  openEditModal(company: Company): void {
    this.selectedCompany = company;
    this.showEditModal = true;
    this.companyForm.patchValue(company);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(company: Company): void {
    this.selectedCompany = company;
    this.showDeleteModal = true;
    this.error = null;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedCompany = null;
    this.companyForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createCompany(): Promise<void> {
    if (!this.companyForm.valid) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const companyData: CreateCompanyDto = this.companyForm.value;
      await this.companyService.createCompany(companyData).toPromise();
      
      this.success = 'Şirket başarıyla oluşturuldu!';
      await this.loadCompanies();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şirket oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateCompany(): Promise<void> {
    if (!this.companyForm.valid || !this.selectedCompany) {
      this.companyForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const companyData: UpdateCompanyDto = this.companyForm.value;
      await this.companyService.updateCompany(this.selectedCompany.id, companyData).toPromise();
      
      this.success = 'Şirket başarıyla güncellendi!';
      await this.loadCompanies();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şirket güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteCompany(): Promise<void> {
    if (!this.selectedCompany) return;

    this.loading = true;
    this.error = null;

    try {
      await this.companyService.deleteCompany(this.selectedCompany.id).toPromise();
      
      this.success = 'Şirket başarıyla silindi!';
      await this.loadCompanies();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Şirket silinirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async checkSlugAvailability(): Promise<void> {
    const slug = this.companyForm.get('slug')?.value;
    if (slug && slug.length > 2) {
      try {
        const excludeId = this.selectedCompany?.id;
        const result = await this.companyService.checkSlugAvailability(slug, excludeId).toPromise();
        if (!result?.available) {
          this.companyForm.get('slug')?.setErrors({ unavailable: true });
        }
      } catch (error) {
        console.error('Slug availability check failed:', error);
      }
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

  // Form getters
  get name() { return this.companyForm.get('name'); }
  get slug() { return this.companyForm.get('slug'); }
  get email() { return this.companyForm.get('email'); }
  get phone() { return this.companyForm.get('phone'); }
  get address() { return this.companyForm.get('address'); }
  get description() { return this.companyForm.get('description'); }
  get isActive() { return this.companyForm.get('isActive'); }
} 