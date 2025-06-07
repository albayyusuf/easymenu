import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/companies/companies.component').then(m => m.CompaniesComponent)
  },
  {
    path: 'branches',
    loadComponent: () => import('./pages/branches/branches.component').then(m => m.BranchesComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'menus',
    loadComponent: () => import('./pages/menus/menus.component').then(m => m.MenusComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'test-api',
    loadComponent: () => import('./pages/test-api/test-api.component').then(m => m.TestApiComponent)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/landing/landing.component').then(m => m.LandingComponent)
  }
];
