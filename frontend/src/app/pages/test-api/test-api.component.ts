import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  AuthService, 
  CompanyService, 
  BranchService, 
  CategoryService,
  ProductService,
  MenuService,
  OrderService,
  PaymentService,
  QrService,
  I18nService,
  ChatbotService
} from '../../services';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="test-container">
      <h1>API Test Sayfası</h1>
      
      <!-- Auth Test -->
      <div class="test-section">
        <h2>Authentication Test</h2>
        <div class="test-controls">
          <input [(ngModel)]="loginData.email" placeholder="Email" type="email">
          <input [(ngModel)]="loginData.password" placeholder="Password" type="password">
          <button (click)="testLogin()">Login Test</button>
          <button (click)="testGetProfile()">Get Profile</button>
          <button (click)="testLogout()">Logout</button>
        </div>
        <div class="test-result" *ngIf="authResult">
          <pre>{{ authResult | json }}</pre>
        </div>
      </div>

      <!-- Company Test -->
      <div class="test-section">
        <h2>Company Test</h2>
        <div class="test-controls">
          <button (click)="testGetCompanies()">Get All Companies</button>
          <input [(ngModel)]="testCompanyId" placeholder="Company ID">
          <button (click)="testGetCompanyById()">Get Company by ID</button>
        </div>
        <div class="test-result" *ngIf="companyResult">
          <pre>{{ companyResult | json }}</pre>
        </div>
      </div>

      <!-- Branch Test -->
      <div class="test-section">
        <h2>Branch Test</h2>
        <div class="test-controls">
          <button (click)="testGetBranches()">Get All Branches</button>
          <input [(ngModel)]="testBranchCompanyId" placeholder="Company ID for Branches">
          <button (click)="testGetBranchesByCompany()">Get Branches by Company</button>
        </div>
        <div class="test-result" *ngIf="branchResult">
          <pre>{{ branchResult | json }}</pre>
        </div>
      </div>

      <!-- Category Test -->
      <div class="test-section">
        <h2>Category Test</h2>
        <div class="test-controls">
          <button (click)="testGetCategories()">Get All Categories</button>
          <input [(ngModel)]="testCategoryCompanyId" placeholder="Company ID for Categories">
          <button (click)="testGetCategoriesByCompany()">Get Categories by Company</button>
        </div>
        <div class="test-result" *ngIf="categoryResult">
          <pre>{{ categoryResult | json }}</pre>
        </div>
      </div>

      <!-- Product Test -->
      <div class="test-section">
        <h2>Product Test</h2>
        <div class="test-controls">
          <button (click)="testGetProducts()">Get All Products</button>
          <input [(ngModel)]="testProductCompanyId" placeholder="Company ID for Products">
          <button (click)="testGetProductsByCompany()">Get Products by Company</button>
        </div>
        <div class="test-result" *ngIf="productResult">
          <pre>{{ productResult | json }}</pre>
        </div>
      </div>

      <!-- Menu Test -->
      <div class="test-section">
        <h2>Menu Test</h2>
        <div class="test-controls">
          <button (click)="testGetMenus()">Get All Menus</button>
          <input [(ngModel)]="testMenuCompanyId" placeholder="Company ID for Menus">
          <button (click)="testGetMenusByCompany()">Get Menus by Company</button>
        </div>
        <div class="test-result" *ngIf="menuResult">
          <pre>{{ menuResult | json }}</pre>
        </div>
      </div>

      <!-- Order Test -->
      <div class="test-section">
        <h2>Order Test</h2>
        <div class="test-controls">
          <button (click)="testGetOrders()">Get All Orders</button>
          <button (click)="testGetTodaysOrders()">Get Today's Orders</button>
          <input [(ngModel)]="testOrderCompanyId" placeholder="Company ID for Orders">
          <button (click)="testGetOrdersByCompany()">Get Orders by Company</button>
        </div>
        <div class="test-result" *ngIf="orderResult">
          <pre>{{ orderResult | json }}</pre>
        </div>
      </div>

      <!-- Payment Test -->
      <div class="test-section">
        <h2>Payment Test</h2>
        <div class="test-controls">
          <button (click)="testGetPayments()">Get All Payments</button>
        </div>
        <div class="test-result" *ngIf="paymentResult">
          <pre>{{ paymentResult | json }}</pre>
        </div>
      </div>

      <!-- QR Test -->
      <div class="test-section">
        <h2>QR Code Test</h2>
        <div class="test-controls">
          <button (click)="testGetQrCodes()">Get All QR Codes</button>
        </div>
        <div class="test-result" *ngIf="qrResult">
          <pre>{{ qrResult | json }}</pre>
        </div>
      </div>

      <!-- I18n Test -->
      <div class="test-section">
        <h2>I18n Test</h2>
        <div class="test-controls">
          <button (click)="testGetTranslations()">Get All Translations</button>
          <select [(ngModel)]="selectedLanguage" (change)="changeLanguage()">
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
        </div>
        <div class="test-result" *ngIf="i18nResult">
          <pre>{{ i18nResult | json }}</pre>
        </div>
      </div>

      <!-- Chatbot Test -->
      <div class="test-section">
        <h2>Chatbot Test</h2>
        <div class="test-controls">
          <button (click)="testGetChatbotLogs()">Get All Chatbot Logs</button>
        </div>
        <div class="test-result" *ngIf="chatbotResult">
          <pre>{{ chatbotResult | json }}</pre>
        </div>
      </div>

      <!-- Global Error Display -->
      <div class="error-section" *ngIf="globalError">
        <h3>Error:</h3>
        <pre>{{ globalError | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .test-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .test-section {
      margin-bottom: 30px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
    }

    .test-section h2 {
      margin-top: 0;
      color: #333;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    .test-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .test-controls input, .test-controls select {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .test-controls button {
      padding: 8px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .test-controls button:hover {
      background: #0056b3;
    }

    .test-result {
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 4px;
      padding: 15px;
      max-height: 300px;
      overflow-y: auto;
    }

    .test-result pre {
      margin: 0;
      font-size: 12px;
      white-space: pre-wrap;
    }

    .error-section {
      background: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
      padding: 15px;
      margin-top: 20px;
    }

    .error-section h3 {
      margin-top: 0;
      color: #721c24;
    }

    .error-section pre {
      color: #721c24;
      font-size: 12px;
    }
  `]
})
export class TestApiComponent implements OnInit {
  // Test data
  loginData = { email: 'test@example.com', password: 'password123' };
  testCompanyId = '';
  testBranchCompanyId = '';
  testCategoryCompanyId = '';
  testProductCompanyId = '';
  testMenuCompanyId = '';
  testOrderCompanyId = '';
  selectedLanguage = 'tr';

  // Results
  authResult: any = null;
  companyResult: any = null;
  branchResult: any = null;
  categoryResult: any = null;
  productResult: any = null;
  menuResult: any = null;
  orderResult: any = null;
  paymentResult: any = null;
  qrResult: any = null;
  i18nResult: any = null;
  chatbotResult: any = null;
  globalError: any = null;

  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    private branchService: BranchService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private menuService: MenuService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private qrService: QrService,
    private i18nService: I18nService,
    private chatbotService: ChatbotService
  ) {}

  ngOnInit(): void {
    console.log('API Test Component initialized');
  }

  // Auth Tests
  testLogin(): void {
    this.authService.login(this.loginData).subscribe({
      next: (result) => {
        this.authResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.authResult = null;
      }
    });
  }

  testGetProfile(): void {
    this.authService.getProfile().subscribe({
      next: (result) => {
        this.authResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.authResult = null;
      }
    });
  }

  testLogout(): void {
    this.authService.logout();
    this.authResult = { message: 'Logged out successfully' };
  }

  // Company Tests
  testGetCompanies(): void {
    this.companyService.getAllCompanies().subscribe({
      next: (result) => {
        this.companyResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.companyResult = null;
      }
    });
  }

  testGetCompanyById(): void {
    if (!this.testCompanyId) {
      this.globalError = { message: 'Please enter a Company ID' };
      return;
    }
    
    this.companyService.getCompanyById(this.testCompanyId).subscribe({
      next: (result) => {
        this.companyResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.companyResult = null;
      }
    });
  }

  // Branch Tests
  testGetBranches(): void {
    this.branchService.getAllBranches().subscribe({
      next: (result) => {
        this.branchResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.branchResult = null;
      }
    });
  }

  testGetBranchesByCompany(): void {
    if (!this.testBranchCompanyId) {
      this.globalError = { message: 'Please enter a Company ID for branches' };
      return;
    }
    
    this.branchService.getBranchesByCompany(this.testBranchCompanyId).subscribe({
      next: (result) => {
        this.branchResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.branchResult = null;
      }
    });
  }

  // Category Tests
  testGetCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (result) => {
        this.categoryResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.categoryResult = null;
      }
    });
  }

  testGetCategoriesByCompany(): void {
    if (!this.testCategoryCompanyId) {
      this.globalError = { message: 'Please enter a Company ID for categories' };
      return;
    }
    
    this.categoryService.getCategoriesByCompany(this.testCategoryCompanyId).subscribe({
      next: (result) => {
        this.categoryResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.categoryResult = null;
      }
    });
  }

  // Product Tests
  testGetProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.productResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.productResult = null;
      }
    });
  }

  testGetProductsByCompany(): void {
    if (!this.testProductCompanyId) {
      this.globalError = { message: 'Please enter a Company ID for products' };
      return;
    }
    
    this.productService.getProductsByCompany(this.testProductCompanyId).subscribe({
      next: (result) => {
        this.productResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.productResult = null;
      }
    });
  }

  // Menu Tests
  testGetMenus(): void {
    this.menuService.getAllMenus().subscribe({
      next: (result) => {
        this.menuResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.menuResult = null;
      }
    });
  }

  testGetMenusByCompany(): void {
    if (!this.testMenuCompanyId) {
      this.globalError = { message: 'Please enter a Company ID for menus' };
      return;
    }
    
    this.menuService.getMenusByCompany(this.testMenuCompanyId).subscribe({
      next: (result) => {
        this.menuResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.menuResult = null;
      }
    });
  }

  // Order Tests
  testGetOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (result) => {
        this.orderResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.orderResult = null;
      }
    });
  }

  testGetTodaysOrders(): void {
    this.orderService.getTodaysOrders().subscribe({
      next: (result) => {
        this.orderResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.orderResult = null;
      }
    });
  }

  testGetOrdersByCompany(): void {
    if (!this.testOrderCompanyId) {
      this.globalError = { message: 'Please enter a Company ID for orders' };
      return;
    }
    
    this.orderService.getOrdersByCompany(this.testOrderCompanyId).subscribe({
      next: (result) => {
        this.orderResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.orderResult = null;
      }
    });
  }

  // Payment Tests
  testGetPayments(): void {
    this.paymentService.getAllPayments().subscribe({
      next: (result) => {
        this.paymentResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.paymentResult = null;
      }
    });
  }

  // QR Tests
  testGetQrCodes(): void {
    this.qrService.getAllQrCodes().subscribe({
      next: (result) => {
        this.qrResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.qrResult = null;
      }
    });
  }

  // I18n Tests
  testGetTranslations(): void {
    this.i18nService.getAllTranslations().subscribe({
      next: (result) => {
        this.i18nResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.i18nResult = null;
      }
    });
  }

  changeLanguage(): void {
    this.i18nService.setCurrentLanguage(this.selectedLanguage);
    this.i18nResult = { message: `Language changed to: ${this.selectedLanguage}` };
  }

  // Chatbot Tests
  testGetChatbotLogs(): void {
    this.chatbotService.getAllChatbotLogs().subscribe({
      next: (result) => {
        this.chatbotResult = result;
        this.globalError = null;
      },
      error: (error) => {
        this.globalError = error;
        this.chatbotResult = null;
      }
    });
  }
} 