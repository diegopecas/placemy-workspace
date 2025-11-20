// apps/fronthouse/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

/**
 * Guard para verificar que el usuario está autenticado
 */
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.checkAuthStatus()) {
    return true;
  }
  
  return router.createUrlTree(['/login']);
};

/**
 * Guard para verificar que el usuario NO está autenticado (para login)
 */
const noAuthGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.checkAuthStatus()) {
    return true;
  }
  
  // Si ya está autenticado, verificar si tiene establecimiento seleccionado
  const selectedEst = authService.getSelectedEstablecimiento();
  if (selectedEst) {
    return router.createUrlTree(['/dashboard']);
  }
  
  return router.createUrlTree(['/select-establecimiento']);
};

/**
 * Guard para verificar que el usuario tiene un establecimiento seleccionado
 */
const establecimientoGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.checkAuthStatus()) {
    return router.createUrlTree(['/login']);
  }
  
  const selectedEst = authService.getSelectedEstablecimiento();
  if (selectedEst) {
    return true;
  }
  
  return router.createUrlTree(['/select-establecimiento']);
};

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => 
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard]
  },
  {
    path: 'select-establecimiento',
    loadComponent: () => 
      import('./features/auth/pages/select-establecimiento/select-establecimiento.component').then(m => m.SelectEstablecimientoComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => 
      import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [establecimientoGuard]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
