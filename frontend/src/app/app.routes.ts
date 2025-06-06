import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./pages/landing').then(m => m.LANDING_ROUTES)
  },
  { 
    path: 'chat', 
    loadChildren: () => import('./pages/chat').then(m => m.CHAT_ROUTES)
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./components/auth').then(m => m.AUTH_ROUTES)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
