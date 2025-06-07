import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrderService, ProductService, CompanyService, BranchService, AuthService } from '../../services';
import { Order, CreateOrderDto, UpdateOrderDto, Product, Company, Branch } from '../../models';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  products: Product[] = [];
  companies: Company[] = [];
  branches: Branch[] = [];
  loading = false;
  error: string | null = null;
  success: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showDetailsModal = false;
  selectedOrder: Order | null = null;
  
  // Forms
  orderForm!: FormGroup;
  searchForm!: FormGroup;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  
  // User info and filters
  currentUser: any = null;
  isAdmin = false;
  selectedCompanyId: string | null = null;
  selectedBranchId: string | null = null;

  // Math reference for template
  Math = Math;

  // Order statuses
  orderStatuses = [
    { value: 'pending', label: 'Beklemede', color: 'warning', icon: 'clock' },
    { value: 'confirmed', label: 'Onaylandı', color: 'info', icon: 'check-circle' },
    { value: 'preparing', label: 'Hazırlanıyor', color: 'primary', icon: 'utensils' },
    { value: 'ready', label: 'Hazır', color: 'success', icon: 'bell' },
    { value: 'delivered', label: 'Teslim Edildi', color: 'success', icon: 'check-double' },
    { value: 'cancelled', label: 'İptal Edildi', color: 'danger', icon: 'times-circle' }
  ];

  // Payment statuses
  paymentStatuses = [
    { value: 'pending', label: 'Beklemede', color: 'warning' },
    { value: 'paid', label: 'Ödendi', color: 'success' },
    { value: 'failed', label: 'Başarısız', color: 'danger' },
    { value: 'refunded', label: 'İade Edildi', color: 'info' }
  ];

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
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
      this.loadOrders();
    });
  }

  private initializeForms(): void {
    this.orderForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      customerPhone: [''],
      customerEmail: ['', [Validators.email]],
      tableNumber: [''],
      notes: [''],
      companyId: ['', [Validators.required]],
      branchId: [''],
      orderItems: this.fb.array([]),
      totalAmount: [0, [Validators.required, Validators.min(0)]],
      status: ['pending', [Validators.required]],
      paymentStatus: ['pending', [Validators.required]]
    });

    this.searchForm = this.fb.group({
      search: [''],
      companyId: [''],
      branchId: [''],
      status: ['all'],
      paymentStatus: ['all'],
      dateFrom: [''],
      dateTo: [''],
      tableNumber: ['']
    });

    // Search functionality
    this.searchForm.valueChanges.subscribe(() => {
      this.filterOrders();
    });
  }

  private async loadCurrentUser(): Promise<void> {
    try {
      this.currentUser = this.authService.getCurrentUser();
      this.isAdmin = this.currentUser?.role === 'super_admin';
      
      // If user is not admin, set their company as default
      if (!this.isAdmin && this.currentUser?.companyId) {
        this.selectedCompanyId = this.currentUser.companyId;
        this.orderForm.patchValue({ companyId: this.currentUser.companyId });
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

  async loadOrders(): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      if (this.selectedBranchId) {
        this.orders = await this.orderService.getOrdersByBranch(this.selectedBranchId).toPromise() || [];
      } else if (this.selectedCompanyId) {
        this.orders = await this.orderService.getOrdersByCompany(this.selectedCompanyId).toPromise() || [];
      } else if (this.isAdmin) {
        this.orders = await this.orderService.getAllOrders().toPromise() || [];
      } else {
        this.orders = [];
      }
      
      // Sort by creation date (newest first)
      this.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      this.filterOrders();
    } catch (error: any) {
      this.error = error.error?.message || 'Siparişler yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private filterOrders(): void {
    const { search, companyId, branchId, status, paymentStatus, dateFrom, dateTo, tableNumber } = this.searchForm.value;
    
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !search || 
        order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        order.customerPhone?.includes(search) ||
        order.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
        order.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesCompany = !companyId || order.companyId === companyId;
      const matchesBranch = !branchId || order.branchId === branchId;
      const matchesStatus = status === 'all' || order.status === status;
      const matchesPaymentStatus = paymentStatus === 'all' || order.paymentStatus === paymentStatus;
      const matchesTableNumber = !tableNumber || order.tableNumber?.toString().includes(tableNumber);
      
      const orderDate = new Date(order.createdAt);
      const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
      const matchesDateTo = !dateTo || orderDate <= new Date(dateTo + 'T23:59:59');
      
      return matchesSearch && matchesCompany && matchesBranch && matchesStatus && 
             matchesPaymentStatus && matchesTableNumber && matchesDateFrom && matchesDateTo;
    });

    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = 1;
    }
  }

  get paginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  // Modal operations
  openCreateModal(): void {
    this.showCreateModal = true;
    this.orderForm.reset();
    this.orderForm.patchValue({ 
      status: 'pending',
      paymentStatus: 'pending',
      totalAmount: 0,
      companyId: this.selectedCompanyId || (this.isAdmin ? '' : this.currentUser?.companyId),
      branchId: this.selectedBranchId || ''
    });
    this.error = null;
    this.success = null;
  }

  openEditModal(order: Order): void {
    this.selectedOrder = order;
    this.showEditModal = true;
    this.orderForm.patchValue(order);
    this.error = null;
    this.success = null;
  }

  openDeleteModal(order: Order): void {
    this.selectedOrder = order;
    this.showDeleteModal = true;
    this.error = null;
  }

  openDetailsModal(order: Order): void {
    this.selectedOrder = order;
    this.showDetailsModal = true;
  }

  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showDetailsModal = false;
    this.selectedOrder = null;
    this.orderForm.reset();
    this.error = null;
    this.success = null;
  }

  // CRUD Operations
  async createOrder(): Promise<void> {
    if (!this.orderForm.valid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const orderData: CreateOrderDto = this.orderForm.value;
      await this.orderService.createOrder(orderData).toPromise();
      
      this.success = 'Sipariş başarıyla oluşturuldu!';
      await this.loadOrders();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Sipariş oluşturulurken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateOrder(): Promise<void> {
    if (!this.orderForm.valid || !this.selectedOrder) {
      this.orderForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const orderData: UpdateOrderDto = this.orderForm.value;
      await this.orderService.updateOrder(this.selectedOrder.id, orderData).toPromise();
      
      this.success = 'Sipariş başarıyla güncellendi!';
      await this.loadOrders();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Sipariş güncellenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async deleteOrder(): Promise<void> {
    if (!this.selectedOrder) return;

    this.loading = true;
    this.error = null;

    try {
      await this.orderService.deleteOrder(this.selectedOrder.id).toPromise();
      
      this.success = 'Sipariş başarıyla silindi!';
      await this.loadOrders();
      
      setTimeout(() => {
        this.closeModals();
      }, 1500);
    } catch (error: any) {
      this.error = error.error?.message || 'Sipariş silinirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  async updateOrderStatus(order: Order, newStatus: string): Promise<void> {
    try {
      await this.orderService.updateOrderStatus(order.id, newStatus).toPromise();
      await this.loadOrders();
      this.success = 'Sipariş durumu güncellendi!';
      setTimeout(() => this.success = null, 3000);
    } catch (error: any) {
      this.error = error.error?.message || 'Sipariş durumu güncellenirken bir hata oluştu.';
      setTimeout(() => this.error = null, 5000);
    }
  }

  async updatePaymentStatus(order: Order, newStatus: string): Promise<void> {
    try {
      await this.orderService.updatePaymentStatus(order.id, newStatus).toPromise();
      await this.loadOrders();
      this.success = 'Ödeme durumu güncellendi!';
      setTimeout(() => this.success = null, 3000);
    } catch (error: any) {
      this.error = error.error?.message || 'Ödeme durumu güncellenirken bir hata oluştu.';
      setTimeout(() => this.error = null, 5000);
    }
  }

  // Pagination
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Utility methods
  getStatusInfo(status: string) {
    return this.orderStatuses.find(s => s.value === status) || this.orderStatuses[0];
  }

  getPaymentStatusInfo(status: string) {
    return this.paymentStatuses.find(s => s.value === status) || this.paymentStatuses[0];
  }

  getCompanyName(companyId: string): string {
    const company = this.companies.find(c => c.id === companyId);
    return company?.name || 'Bilinmeyen Şirket';
  }

  getBranchName(branchId: string): string {
    const branch = this.branches.find(b => b.id === branchId);
    return branch?.name || 'Bilinmeyen Şube';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  }

  formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  // Form getters
  get customerName() { return this.orderForm.get('customerName'); }
  get customerPhone() { return this.orderForm.get('customerPhone'); }
  get customerEmail() { return this.orderForm.get('customerEmail'); }
  get tableNumber() { return this.orderForm.get('tableNumber'); }
  get notes() { return this.orderForm.get('notes'); }
  get companyId() { return this.orderForm.get('companyId'); }
  get branchId() { return this.orderForm.get('branchId'); }
  get totalAmount() { return this.orderForm.get('totalAmount'); }
  get status() { return this.orderForm.get('status'); }
  get paymentStatus() { return this.orderForm.get('paymentStatus'); }
} 