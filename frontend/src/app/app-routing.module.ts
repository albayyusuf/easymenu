import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { ChatComponent } from './pages/chat/chat.component';
import { AUTH_ROUTES } from './components/auth/auth.routes';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'auth', children: AUTH_ROUTES },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 