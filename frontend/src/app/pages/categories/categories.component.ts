import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CategoryService, CompanyService, AuthService } from '../../services';
import { Category, CreateCategoryDto, UpdateCategoryDto, Company } from '../../models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  companies: Company[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedCategory: Category | null = null;
  
  // Forms
  categoryForm!: FormGroup;
  searchForm!: FormGroup;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;
  
  // User info and filters
  currentUser: any = null;
  isAdmin = false;
  selectedCompanyId: string | null = null;
  selectedBranchId: string | null = null;

  // Math reference for template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private companyService: CompanyService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCompanies();
    
    // Check for filters from query params
    this.route.queryParams.subscribe(params => {
      if (params['companyId']) {
        this.selectedCompanyId = params['companyId'];
        this.searchForm.patchValue({ companyId: this.selectedCompanyId });
      }
      if (params['branchId']) {
        this.selectedBranchId = params['branchId'];
      }
      this.loadCategories();
    });
  }

  private initializeForms(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      image: [''],
      sortOrder: [0, [Validators.min(0)]],
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
      this.filterCategories();
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
      
      // If user is not admin, set their company as default
      if (!this.isAdmin && this.currentUser?.companyId) {
        this.selectedCompanyId = this.currentUser.companyId;
        this.categoryForm.patchValue({ companyId: this.currentUser.companyId });
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

  async loadCategories(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      if (this.selectedCompanyId) {
        this.categories = await this.categoryService.getCategoriesByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.categories = await this.categoryService.getAllCategories().toPromise() || [];
      } else {
        this.categories = [];
      }
      
      // Sort by sortOrder
      this.categories.sort((a, b) => a.sortOrder - b.sortOrder);
      this.filterCategories();
    } catch (error: any) {
      this.error = error.error?.message || 'Kategoriler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterCategories(): void {
    const { search, companyId, status } = this.searchForm.value;
    
    this.filteredCategories = this.categories.filter(category => {
      const matchesSearch = !search || 
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCompany = !companyId || category.companyId === companyId;
      
      const matchesStatus = status === 'all' || 
        (status === 'active' && category.isActive) ||
        (status === 'inactive' && !category.isActive);
      
      return matchesSearch && matchesCompany && matchesStatus;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedCategories(): Category[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredCategories.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.categoryForm.reset();
    this.categoryForm.patchValue({ 
      isActive: true,
      sortOrder: this.categories.length,
      companyId: this.selectedCompanyId || (this.isAdmin ? '' : this.currentUser?.companyId)
    });
    this.error = null;
    this.success = null;
  }

  openEditModal(category: Category): void {
    this.selectedCategory = category;
    this.showEditModal = true;
    this.categoryForm.patchValue(category);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(category: Category): void {
    this.selectedCategory = category;
    this.showDeleteModal = true;
    this.error = null;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createCategory(): Promise<void> {
    if (!this.categoryForm.valid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const categoryData: CreateCategoryDto = this.categoryForm.value;
      await this.categoryService.createCategory(categoryData).toPromise();
      
      this.success = 'Kategori başarıyla oluşturuldu!';
      await this.loadCategories();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Kategori oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateCategory(): Promise<void> {
    if (!this.categoryForm.valid || !this.selectedCategory) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const categoryData: UpdateCategoryDto = this.categoryForm.value;
      await this.categoryService.updateCategory(this.selectedCategory.id, categoryData).toPromise();
      
      this.success = 'Kategori başarıyla güncellendi!';
      await this.loadCategories();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Kategori güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteCategory(): Promise<void> {
    if (!this.selectedCategory) return;

    this.loading = true;
    this.error = null;

    try {
      await this.categoryService.deleteCategory(this.selectedCategory.id).toPromise();
      
      this.success = 'Kategori başarıyla silindi!';
      await this.loadCategories();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Kategori silinirken bir hata oluştu.';
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

  // Image handling
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.categoryForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTQuNDc3MiA3MCA5MCA3NC40NzcyIDkwIDgwVjEyMEM5MCA5NC40NzcyIDk0LjQ3NzIgOTAgMTAwIDkwSDEwMEMxMDUuNTIzIDkwIDExMCA5NC40NzcyIDExMCAxMDBWMTIwQzExMCAxMjUuNTIzIDEwNS41MjMgMTMwIDEwMCAxMzBIOTBWMTQwSDExMFYxMzBIMTIwQzEyNS41MjMgMTMwIDEzMCAxMjUuNTIzIDEzMCAxMjBWODBDMTMwIDc0LjQ3NzIgMTI1LjUyMyA3MCAxMjAgNzBIMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }

  // Form getters
  get name() { return this.categoryForm.get('name'); }
  get description() { return this.categoryForm.get('description'); }
  get image() { return this.categoryForm.get('image'); }
  get sortOrder() { return this.categoryForm.get('sortOrder'); }
  get companyId() { return this.categoryForm.get('companyId'); }
  get isActive() { return this.categoryForm.get('isActive'); }
} 