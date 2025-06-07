import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  AuthService, 
  CompanyService, 
  BranchService, 
  OrderService,
  ProductService,
  CategoryService 
} from '../../services';
import { 
  User, 
  Company, 
  Branch, 
  Order, 
  Product, 
  Category 
} from '../../models';

interface DashboardStats {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalProducts: number;
  totalCategories: number;
  totalBranches: number;
  pendingOrders: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  currentCompany: Company | null = null;
  branches: Branch[] = [];
  recentOrders: Order[] = [];
  stats: DashboardStats = {
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalBranches: 0,
    pendingOrders: 0
  };
  
  loading = true;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private orderService: OrderService,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private async loadDashboardData(): Promise<void> {
    try {
      this.loading = true;
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      // Kullanıcının şirket bilgilerini yükle
      if (this.currentUser.companyId) {
        await this.loadCompanyData();
        await this.loadBranchData();
        await this.loadOrderData();
        await this.loadProductData();
        await this.loadCategoryData();
      }

    } catch (error) {
      console.error('Dashboard data loading error:', error);
      this.error = 'Dashboard verileri yüklenirken bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private async loadCompanyData(): Promise<void> {
    if (!this.currentUser?.companyId) return;
    
    try {
      this.currentCompany = await this.companyService.getCompanyById(this.currentUser.companyId).toPromise() || null;
    } catch (error) {
      console.error('Company data loading error:', error);
    }
  }

  private async loadBranchData(): Promise<void> {
    if (!this.currentUser?.companyId) return;
    
    try {
      this.branches = await this.branchService.getBranchesByCompany(this.currentUser.companyId).toPromise() || [];
      this.stats.totalBranches = this.branches.length;
    } catch (error) {
      console.error('Branch data loading error:', error);
    }
  }

  private async loadOrderData(): Promise<void> {
    if (!this.currentUser?.companyId) return;
    
    try {
      // Tüm siparişleri yükle
      const allOrders = await this.orderService.getOrdersByCompany(this.currentUser.companyId).toPromise() || [];
      this.stats.totalOrders = allOrders.length;
      this.stats.totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      // Bugünkü siparişleri yükle
      const todayOrders = await this.orderService.getTodaysOrders().toPromise() || [];
      this.stats.todayOrders = todayOrders.length;
      this.stats.todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

      // Bekleyen siparişleri yükle
      const pendingOrders = await this.orderService.getOrdersByStatus('pending').toPromise() || [];
      this.stats.pendingOrders = pendingOrders.length;

      // Son siparişleri al (en son 5 sipariş)
      this.recentOrders = allOrders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    } catch (error) {
      console.error('Order data loading error:', error);
    }
  }

  private async loadProductData(): Promise<void> {
    if (!this.currentUser?.companyId) return;
    
    try {
      const products = await this.productService.getProductsByCompany(this.currentUser.companyId).toPromise() || [];
      this.stats.totalProducts = products.length;
    } catch (error) {
      console.error('Product data loading error:', error);
    }
  }

  private async loadCategoryData(): Promise<void> {
    if (!this.currentUser?.companyId) return;
    
    try {
      const categories = await this.categoryService.getCategoriesByCompany(this.currentUser.companyId).toPromise() || [];
      this.stats.totalCategories = categories.length;
    } catch (error) {
      console.error('Category data loading error:', error);
    }
  }

  refreshDashboard(): void {
    this.loadDashboardData();
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }

  navigateToProducts(): void {
    this.router.navigate(['/products']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/categories']);
  }

  navigateToBranches(): void {
    this.router.navigate(['/branches']);
  }

  getOrderStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'confirmed': return 'status-confirmed';
      case 'preparing': return 'status-preparing';
      case 'ready': return 'status-ready';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  getOrderStatusText(status: string): string {
    switch (status) {
      case 'pending': return 'Bekliyor';
      case 'confirmed': return 'Onaylandı';
      case 'preparing': return 'Hazırlanıyor';
      case 'ready': return 'Hazır';
      case 'delivered': return 'Teslim Edildi';
      case 'cancelled': return 'İptal Edildi';
      default: return status;
    }
  }

  getUserRoleText(role?: string): string {
    if (!role) return '';
    
    const roleTexts: { [key: string]: string } = {
      'admin': 'Yönetici',
      'company_owner': 'Şirket Sahibi',
      'branch_manager': 'Şube Müdürü',
      'staff': 'Personel'
    };

    return roleTexts[role] || role;
  }
} 