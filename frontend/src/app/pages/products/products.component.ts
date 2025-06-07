import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductService, CategoryService, CompanyService, AuthService } from '../../services';
import { Product, CreateProductDto, UpdateProductDto, Category, Company } from '../../models';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  companies: Company[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  selectedProduct: Product | null = null;
  
  // Forms
  productForm!: FormGroup;
  searchForm!: FormGroup;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 12;
  totalPages = 0;
  
  // User info and filters
  currentUser: any = null;
  isAdmin = false;
  selectedCompanyId: string | null = null;
  selectedCategoryId: string | null = null;
  selectedBranchId: string | null = null;

  // Math reference for template
  Math = Math;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
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
    this.loadCategories();
    
    // Check for filters from query params
    this.route.queryParams.subscribe(params => {
      if (params['companyId']) {
        this.selectedCompanyId = params['companyId'];
        this.searchForm.patchValue({ companyId: this.selectedCompanyId });
      }
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.searchForm.patchValue({ categoryId: this.selectedCategoryId });
      }
      if (params['branchId']) {
        this.selectedBranchId = params['branchId'];
      }
      this.loadProducts();
    });
  }

  private initializeForms(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [''],
      categoryId: ['', [Validators.required]],
      companyId: ['', [Validators.required]],
      isAvailable: [true],
      ingredients: [''],
      allergens: [''],
      nutritionInfo: ['']
    });

    this.searchForm = this.fb.group({
      search: [''],
      companyId: [''],
      categoryId: [''],
      status: ['all'],
      priceMin: [''],
      priceMax: ['']
    });

    // Search functionality
    this.searchForm.valueChanges.subscribe(() => {
      this.filterProducts();
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
      
      // If user is not admin, set their company as default
      if (!this.isAdmin && this.currentUser?.companyId) {
        this.selectedCompanyId = this.currentUser.companyId;
        this.productForm.patchValue({ companyId: this.currentUser.companyId });
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
    } catch (error: any) {
      console.error('Error loading categories:', error);
    }
  }

  async loadProducts(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      if (this.selectedCategoryId) {
        this.products = await this.productService.getProductsByCategory(this.selectedCategoryId).toPromise() || [];
      } else if (this.selectedCompanyId) {
        this.products = await this.productService.getProductsByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.products = await this.productService.getAllProducts().toPromise() || [];
      } else {
        this.products = [];
      }
      
      this.filterProducts();
    } catch (error: any) {
      this.error = error.error?.message || 'Ürünler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterProducts(): void {
    const { search, companyId, categoryId, status, priceMin, priceMax } = this.searchForm.value;
    
    this.filteredProducts = this.products.filter(product => {
      const matchesSearch = !search || 
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCompany = !companyId || product.companyId === companyId;
      const matchesCategory = !categoryId || product.categoryId === categoryId;
      
      const matchesStatus = status === 'all' || 
        (status === 'available' && product.isAvailable) ||
        (status === 'unavailable' && !product.isAvailable);
      
      const matchesPriceMin = !priceMin || product.price >= parseFloat(priceMin);
      const matchesPriceMax = !priceMax || product.price <= parseFloat(priceMax);
      
      return matchesSearch && matchesCompany && matchesCategory && matchesStatus && matchesPriceMin && matchesPriceMax;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.productForm.reset();
    this.productForm.patchValue({ 
      isAvailable: true,
      price: 0,
      companyId: this.selectedCompanyId || (this.isAdmin ? '' : this.currentUser?.companyId),
      categoryId: this.selectedCategoryId || ''
    });
    this.error = null;
    this.success = null;
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.showEditModal = true;
    
    // Convert arrays to strings for form
    const formData = {
      ...product,
      ingredients: product.ingredients?.join(', ') || '',
      allergens: product.allergens?.join(', ') || '',
      nutritionInfo: product.nutritionInfo ? JSON.stringify(product.nutritionInfo) : ''
    };
    
    this.productForm.patchValue(formData);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.showDeleteModal = true;
    this.error = null;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedProduct = null;
    this.productForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createProduct(): Promise<void> {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formData = this.productForm.value;
      const productData: CreateProductDto = {
        ...formData,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
        nutritionInfo: formData.nutritionInfo ? JSON.parse(formData.nutritionInfo) : null
      };
      
      await this.productService.createProduct(productData).toPromise();
      
      this.success = 'Ürün başarıyla oluşturuldu!';
      await this.loadProducts();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Ürün oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateProduct(): Promise<void> {
    if (!this.productForm.valid || !this.selectedProduct) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const formData = this.productForm.value;
      const productData: UpdateProductDto = {
        ...formData,
        ingredients: formData.ingredients ? formData.ingredients.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
        allergens: formData.allergens ? formData.allergens.split(',').map((item: string) => item.trim()).filter((item: string) => item) : [],
        nutritionInfo: formData.nutritionInfo ? JSON.parse(formData.nutritionInfo) : null
      };
      
      await this.productService.updateProduct(this.selectedProduct.id, productData).toPromise();
      
      this.success = 'Ürün başarıyla güncellendi!';
      await this.loadProducts();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Ürün güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteProduct(): Promise<void> {
    if (!this.selectedProduct) return;

    this.loading = true;
    this.error = null;

    try {
      await this.productService.deleteProduct(this.selectedProduct.id).toPromise();
      
      this.success = 'Ürün başarıyla silindi!';
      await this.loadProducts();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Ürün silinirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async toggleAvailability(product: Product): Promise<void> {
    try {
      await this.productService.toggleAvailability(product.id).toPromise();
      await this.loadProducts();
    } catch (error: any) {
      this.error = error.error?.message || 'Ürün durumu güncellenirken bir hata oluştu.';
    }
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Utility methods
  getStatusBadgeClass(isAvailable: boolean): string {
    return isAvailable ? 'badge-success' : 'badge-danger';
  }

  getStatusText(isAvailable: boolean): string {
    return isAvailable ? 'Mevcut' : 'Mevcut Değil';
  }

  getCompanyName(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company?.name || 'Bilinmeyen Şirket';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Bilinmeyen Kategori';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }

  // Image handling
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.patchValue({ image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onImageError(event: any): void {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNzBDOTQuNDc3MiA3MCA5MCA3NC40NzcyIDkwIDgwVjEyMEM5MCA5NC40NzcyIDk0LjQ3NzIgOTAgMTAwIDkwSDEwMEMxMDUuNTIzIDkwIDExMCA5NC40NzcyIDExMCAxMDBWMTIwQzExMCAxMjUuNTIzIDEwNS41MjMgMTMwIDEwMCAxMzBIOTBWMTQwSDExMFYxMzBIMTIwQzEyNS41MjMgMTMwIDEzMCAxMjUuNTIzIDEzMCAxMjBWODBDMTMwIDc0LjQ3NzIgMTI1LjUyMyA3MCAxMjAgNzBIMTAwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
  }

  // Form getters
  get name() { return this.productForm.get('name'); }
  get description() { return this.productForm.get('description'); }
  get price() { return this.productForm.get('price'); }
  get image() { return this.productForm.get('image'); }
  get categoryId() { return this.productForm.get('categoryId'); }
  get companyId() { return this.productForm.get('companyId'); }
  get isAvailable() { return this.productForm.get('isAvailable'); }
  get ingredients() { return this.productForm.get('ingredients'); }
  get allergens() { return this.productForm.get('allergens'); }
  get nutritionInfo() { return this.productForm.get('nutritionInfo'); }
} 