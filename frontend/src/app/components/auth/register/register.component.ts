import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, CompanyService } from '../../../services';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  companyForm!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showPassword = false;
  showConfirmPassword = false;
  registrationType = 'user';
  step = 1; // 1: Company Info, 2: User Info
  
  roles = [
    { value: 'company_owner', label: 'Şirket Sahibi', description: 'Tüm yetkilere sahip' },
    { value: 'branch_manager', label: 'Şube Müdürü', description: 'Şube yönetimi yetkisi' },
    { value: 'staff', label: 'Personel', description: 'Temel kullanım yetkisi' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private companyService: CompanyService,
    private router: Router
  ) {
    this.initializeForms();
  }

  private initializeForms(): void {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      description: ['']
    });

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['company_owner', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    // Auto-generate slug from company name
    this.companyForm.get('name')?.valueChanges.subscribe(name => {
      if (name) {
        const slug = this.generateSlug(name);
        this.companyForm.patchValue({ slug }, { emitEvent: false });
      }
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors!['passwordMismatch'];
      if (Object.keys(confirmPassword.errors!).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  // Getters for form controls
  get companyName() { return this.companyForm.get('name'); }
  get companySlug() { return this.companyForm.get('slug'); }
  get companyEmail() { return this.companyForm.get('email'); }
  
  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get role() { return this.registerForm.get('role'); }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  setRegistrationType(type: string): void {
    this.registrationType = type;
    this.step = type === 'company' ? 1 : 2;
    this.error = null;
    this.success = null;
  }

  isUserRegistration(): boolean {
    return this.registrationType === 'user';
  }

  isCompanyRegistration(): boolean {
    return this.registrationType === 'company';
  }

  nextStep(): void {
    if (this.step === 1 && this.companyForm.valid) {
      this.step = 2;
      // Copy company email to user email if empty
      if (!this.email?.value && this.companyEmail?.value) {
        this.registerForm.patchValue({ email: this.companyEmail.value });
      }
    }
  }

  previousStep(): void {
    if (this.step === 2) {
      this.step = 1;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registrationType === 'company') {
      await this.registerCompanyAndUser();
    } else {
      await this.registerUser();
    }
  }

  private async registerCompanyAndUser(): Promise<void> {
    if (!this.companyForm.valid || !this.registerForm.valid) {
      this.markAllFormsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      // First create the company
      const companyData = {
        ...this.companyForm.value,
        isActive: true
      };

      const company = await this.companyService.createCompany(companyData).toPromise();
      
      if (company) {
        // Then register the user with company ID
        const userData = {
          ...this.registerForm.value,
          companyId: company.id,
          role: 'company_owner'
        };
        delete userData.confirmPassword;

        const response = await this.authService.register(userData).toPromise();
        
        if (response) {
          this.success = 'Şirket ve kullanıcı kaydı başarıyla tamamlandı! Dashboard\'a yönlendiriliyorsunuz...';
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        }
      }
    } catch (error: any) {
      this.error = error.error?.message || 'Kayıt işlemi sırasında bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private async registerUser(): Promise<void> {
    if (!this.registerForm.valid) {
      this.markAllFormsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    try {
      const userData = { ...this.registerForm.value };
      delete userData.confirmPassword;

      const response = await this.authService.register(userData).toPromise();
      
      if (response) {
        this.success = 'Kullanıcı kaydı başarıyla tamamlandı! Dashboard\'a yönlendiriliyorsunuz...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      }
    } catch (error: any) {
      this.error = error.error?.message || 'Kayıt işlemi sırasında bir hata oluştu.';
    } finally {
      this.loading = false;
    }
  }

  private markAllFormsTouched(): void {
    this.companyForm.markAllAsTouched();
    this.registerForm.markAllAsTouched();
  }

  async checkSlugAvailability(): Promise<void> {
    const slug = this.companySlug?.value;
    if (slug && slug.length > 2) {
      try {
        const result = await this.companyService.checkSlugAvailability(slug).toPromise();
        if (!result?.available) {
          this.companySlug?.setErrors({ unavailable: true });
        }
      } catch (error) {
        console.error('Slug availability check failed:', error);
      }
    }
  }
}
