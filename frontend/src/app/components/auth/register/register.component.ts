import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Kayıt Ol</h2>
        <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
          <div class="form-group">
            <label for="name">Ad Soyad</label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="registerData.name"
              required
              minlength="3"
            />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="registerData.email"
              required
              email
            />
          </div>
          <div class="form-group">
            <label for="password">Şifre</label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="registerData.password"
              required
              minlength="6"
            />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Şifre Tekrar</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              [(ngModel)]="registerData.confirmPassword"
              required
              minlength="6"
            />
          </div>
          <button type="submit" [disabled]="!registerForm.valid">Kayıt Ol</button>
        </form>
        <p class="auth-link">
          Zaten hesabınız var mı? <a routerLink="/auth/login">Giriş Yap</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
      padding: 20px;
    }

    .auth-card {
      background: white;
      padding: 40px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #1f2937;
      margin-bottom: 30px;
      font-size: 24px;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      color: #4b5563;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 16px;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #2563eb;
      }
    }

    button {
      width: 100%;
      padding: 14px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #1d4ed8;
      }

      &:disabled {
        background: #93c5fd;
        cursor: not-allowed;
      }
    }

    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: #4b5563;

      a {
        color: #2563eb;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent {
  registerData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  onSubmit() {
    // TODO: Implement register logic
    console.log('Register data:', this.registerData);
  }
}
