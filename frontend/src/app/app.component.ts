import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { User } from './models';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'EasyMenu';
  
  // Sidebar state
  sidebarCollapsed = false;
  isMobile = false;
  mobileMenuOpen = false;
  screenWidth = 0;
  
  // User state
  currentUser: User | null = null;
  isAdmin = false;
  
  // UI state
  showUserMenu = false;
  showNotifications = false;
  notificationCount = 0;
  pendingOrdersCount = 0;
  
  // Current page
  currentRoute = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Subscribe to auth state
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'admin' || user?.role === 'company_owner';
    });

    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.closeAllDropdowns();
    });

    // Load initial data
    this.loadNotifications();
    this.loadPendingOrders();

    if (this.isPlatformBrowser()) {
      // Load sidebar state from localStorage
      try {
        const savedState = localStorage.getItem('sidebarCollapsed');
        if (savedState !== null) {
          this.sidebarCollapsed = savedState === 'true';
        }
      } catch (error) {
        console.warn('Could not load sidebar state from localStorage:', error);
      }

      // Set initial screen width
      this.screenWidth = window.innerWidth;
      
      // Auto-collapse sidebar on smaller screens
      if (this.screenWidth <= 1200) {
        this.sidebarCollapsed = true;
      }

      // Update page title based on route
      this.updatePageTitle();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (this.isPlatformBrowser()) {
      this.screenWidth = window.innerWidth;
      
      // Auto-close mobile menu on desktop
      if (this.screenWidth > 768 && this.mobileMenuOpen) {
        this.closeMobileMenu();
      }
      
      // Auto-expand sidebar on large screens
      if (this.screenWidth > 1200 && this.sidebarCollapsed) {
        this.sidebarCollapsed = false;
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    if (!event.target.closest('.user-menu')) {
      this.showUserMenu = false;
    }
    if (!event.target.closest('.notification-dropdown')) {
      this.showNotifications = false;
    }
  }

  private checkScreenSize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  toggleSidebar(): void {
    if (this.isPlatformBrowser()) {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      
      // Store sidebar state in localStorage
      try {
        localStorage.setItem('sidebarCollapsed', this.sidebarCollapsed.toString());
      } catch (error) {
        console.warn('Could not save sidebar state to localStorage:', error);
      }
    }
  }

  toggleMobileMenu() {
    if (this.isPlatformBrowser()) {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      
      // Prevent body scroll when mobile menu is open
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }

  closeMobileMenu() {
    if (this.isPlatformBrowser()) {
      this.mobileMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    this.showNotifications = false;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
  }

  closeAllDropdowns(): void {
    this.showUserMenu = false;
    this.showNotifications = false;
  }

  getPageTitle(): string {
    const routeTitles: { [key: string]: string } = {
      '/dashboard': 'Dashboard',
      '/orders': 'Siparişler',
      '/menus': 'Menüler',
      '/products': 'Ürünler',
      '/categories': 'Kategoriler',
      '/branches': 'Şubeler',
      '/companies': 'Şirketler',
      '/qr-codes': 'QR Kodlar',
      '/reports': 'Raporlar',
      '/chat': 'AI Chat',
      '/settings': 'Ayarlar',
      '/profile': 'Profil'
    };

    return routeTitles[this.currentRoute] || 'EasyMenu';
  }

  getUserRoleText(role: string): string {
    const roleTexts: { [key: string]: string } = {
      'super_admin': 'Süper Admin',
      'company_owner': 'Şirket Sahibi',
      'branch_manager': 'Şube Müdürü',
      'staff': 'Personel'
    };

    return roleTexts[role] || role;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private loadNotifications(): void {
    // TODO: Implement notification loading
    this.notificationCount = 3; // Mock data
  }

  private loadPendingOrders(): void {
    // TODO: Implement pending orders loading
    this.pendingOrdersCount = 5; // Mock data
  }

  private updatePageTitle(): void {
    // Implement the logic to update the page title based on the current route
  }
}
