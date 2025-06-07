import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MenuService, ProductService, CategoryService, CompanyService, BranchService, AuthService } from '../../services';
import { Menu, CreateMenuDto, UpdateMenuDto, Product, Category, Company, Branch } from '../../models';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.scss']
})
export class MenusComponent implements OnInit {
  menus: Menu[] = [];
  filteredMenus: Menu[] = [];
  products: Product[] = [];
  categories: Category[] = [];
  companies: Company[] = [];
  branches: Branch[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showItemsModal = false;
  selectedMenu: Menu | null = null;
  
  // Forms
  menuForm!: FormGroup;
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
    private menuService: MenuService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadCurrentUser();
    this.loadCompanies();
    this.loadBranches();
    this.loadCategories();
    this.loadProducts();
    
    // Check for filters from query params
    this.route.queryParams.subscribe(params => {
      if (params['companyId']) {
        this.selectedCompanyId = params['companyId'];
        this.searchForm.patchValue({ companyId: this.selectedCompanyId });
      }
      if (params['branchId']) {
        this.selectedBranchId = params['branchId'];
        this.searchForm.patchValue({ branchId: this.selectedBranchId });
      }
      this.loadMenus();
    });
  }

  private initializeForms(): void {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      companyId: ['', [Validators.required]],
      branchId: [''],
      isActive: [true],
      isPublished: [false],
      validFrom: [''],
      validTo: [''],
      menuType: ['regular', [Validators.required]]
    });

    this.searchForm = this.fb.group({
      search: [''],
      companyId: [''],
      branchId: [''],
      status: ['all'],
      menuType: ['all'],
      published: ['all']
    });

    // Search functionality
    this.searchForm.valueChanges.subscribe(() => {
      this.filterMenus();
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
      
      // If user is not admin, set their company as default
      if (!this.isAdmin && this.currentUser?.companyId) {
        this.selectedCompanyId = this.currentUser.companyId;
        this.menuForm.patchValue({ companyId: this.currentUser.companyId });
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
    try {
      if (this.selectedCompanyId) {
        this.branches = await this.branchService.getBranchesByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.branches = await this.branchService.getAllBranches().toPromise() || [];
      } else {
        this.branches = [];
      }
    } catch (error: any) {
      console.error('Error loading branches:', error);
    }
  }

  async loadCategories(): Promise<void> {
    try {
      if (this.selectedCompanyId) {
        this.categories = await this.categoryService.getCategoriesByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.categories = await this.categoryService.getAllCategories().toPromise() || [];
      } else {
        this.categories = [];
      }
    } catch (error: any) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProducts(): Promise<void> {
    try {
      if (this.selectedCompanyId) {
        this.products = await this.productService.getProductsByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.products = await this.productService.getAllProducts().toPromise() || [];
      } else {
        this.products = [];
      }
    } catch (error: any) {
      console.error('Error loading products:', error);
    }
  }

  async loadMenus(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      if (this.selectedBranchId) {
        this.menus = await this.menuService.getMenusByBranch(this.selectedBranchId).toPromise() || [];
      } else if (this.selectedCompanyId) {
        this.menus = await this.menuService.getMenusByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.menus = await this.menuService.getAllMenus().toPromise() || [];
      } else {
        this.menus = [];
      }
      
      this.filterMenus();
    } catch (error: any) {
      this.error = error.error?.message || 'Menüler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterMenus(): void {
    const { search, companyId, branchId, status, menuType, published } = this.searchForm.value;
    
    this.filteredMenus = this.menus.filter(menu => {
      const matchesSearch = !search || 
        menu.name.toLowerCase().includes(search.toLowerCase()) ||
        (menu.description && menu.description.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCompany = !companyId || menu.companyId === companyId;
      const matchesBranch = !branchId || menu.branchId === branchId;
      
      const matchesStatus = status === 'all' || 
        (status === 'active' && menu.isActive) ||
        (status === 'inactive' && !menu.isActive);
      
      const matchesType = menuType === 'all' || menu.menuType === menuType;
      
      const matchesPublished = published === 'all' || 
        (published === 'published' && menu.isPublished) ||
        (published === 'unpublished' && !menu.isPublished);
      
      return matchesSearch && matchesCompany && matchesBranch && matchesStatus && matchesType && matchesPublished;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredMenus.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedMenus(): Menu[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredMenus.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.menuForm.reset();
    this.menuForm.patchValue({ 
      isActive: true,
      isPublished: false,
      menuType: 'regular',
      companyId: this.selectedCompanyId || (this.isAdmin ? '' : this.currentUser?.companyId),
      branchId: this.selectedBranchId || ''
    });
    this.error = null;
    this.success = null;
  }

  openEditModal(menu: Menu): void {
    this.selectedMenu = menu;
    this.showEditModal = true;
    
    // Format dates for form
    const formData = {
      ...menu,
      validFrom: menu.validFrom ? new Date(menu.validFrom).toISOString().split('T')[0] : '',
      validTo: menu.validTo ? new Date(menu.validTo).toISOString().split('T')[0] : ''
    };
    
    this.menuForm.patchValue(formData);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(menu: Menu): void {
    this.selectedMenu = menu;
    this.showDeleteModal = true;
    this.error = null;
  }

  openItemsModal(menu: Menu): void {
    this.selectedMenu = menu;
    this.showItemsModal = true;
    this.error = null;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showItemsModal = false;
    this.selectedMenu = null;
    this.menuForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createMenu(): Promise<void> {
    if (!this.menuForm.valid) {
      this.menuForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formData = this.menuForm.value;
      const menuData: CreateMenuDto = {
        ...formData,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
        validTo: formData.validTo ? new Date(formData.validTo) : null
      };
      
      await this.menuService.createMenu(menuData).toPromise();
      
      this.success = 'Menü başarıyla oluşturuldu!';
      await this.loadMenus();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Menü oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateMenu(): Promise<void> {
    if (!this.menuForm.valid || !this.selectedMenu) {
      this.menuForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formData = this.menuForm.value;
      const menuData: UpdateMenuDto = {
        ...formData,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : null,
        validTo: formData.validTo ? new Date(formData.validTo) : null
      };
      
      await this.menuService.updateMenu(this.selectedMenu.id, menuData).toPromise();
      
      this.success = 'Menü başarıyla güncellendi!';
      await this.loadMenus();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Menü güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteMenu(): Promise<void> {
    if (!this.selectedMenu) return;

    this.loading = true;
    this.error = null;

    try {
      await this.menuService.deleteMenu(this.selectedMenu.id).toPromise();
      
      this.success = 'Menü başarıyla silindi!';
      await this.loadMenus();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Menü silinirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async toggleStatus(menu: Menu): Promise<void> {
    try {
      await this.menuService.toggleStatus(menu.id).toPromise();
      await this.loadMenus();
    } catch (error: any) {
      this.error = error.error?.message || 'Menü durumu güncellenirken bir hata oluştu.';
    }
  }

  async togglePublished(menu: Menu): Promise<void> {
    try {
      await this.menuService.togglePublished(menu.id).toPromise();
      await this.loadMenus();
    } catch (error: any) {
      this.error = error.error?.message || 'Menü yayın durumu güncellenirken bir hata oluştu.';
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

  getPublishedBadgeClass(isPublished: boolean): string {
    return isPublished ? 'badge-primary' : 'badge-warning';
  }

  getPublishedText(isPublished: boolean): string {
    return isPublished ? 'Yayında' : 'Taslak';
  }

  getMenuTypeBadgeClass(menuType: string): string {
    switch (menuType) {
      case 'breakfast': return 'badge-orange';
      case 'lunch': return 'badge-blue';
      case 'dinner': return 'badge-purple';
      case 'drinks': return 'badge-cyan';
      case 'desserts': return 'badge-pink';
      default: return 'badge-gray';
    }
  }

  getMenuTypeText(menuType: string): string {
    switch (menuType) {
      case 'breakfast': return 'Kahvaltı';
      case 'lunch': return 'Öğle Yemeği';
      case 'dinner': return 'Akşam Yemeği';
      case 'drinks': return 'İçecekler';
      case 'desserts': return 'Tatlılar';
      default: return 'Genel';
    }
  }

  getCompanyName(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company?.name || 'Bilinmeyen Şirket';
  }

  getBranchName(branchId: string): string {
    const branch = this.branches.find(b => b.id === branchId);
    return branch?.name || 'Tüm Şubeler';
  }

  formatDate(date: string | Date): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  }

  isMenuValid(menu: Menu): boolean {
    const now = new Date();
    const validFrom = menu.validFrom ? new Date(menu.validFrom) : null;
    const validTo = menu.validTo ? new Date(menu.validTo) : null;
    
    if (validFrom && now < validFrom) return false;
    if (validTo && now > validTo) return false;
    
    return true;
  }

  // Form getters
  get name() { return this.menuForm.get('name'); }
  get description() { return this.menuForm.get('description'); }
  get companyId() { return this.menuForm.get('companyId'); }
  get branchId() { return this.menuForm.get('branchId'); }
  get isActive() { return this.menuForm.get('isActive'); }
  get isPublished() { return this.menuForm.get('isPublished'); }
  get validFrom() { return this.menuForm.get('validFrom'); }
  get validTo() { return this.menuForm.get('validTo'); }
  get menuType() { return this.menuForm.get('menuType'); }
} 