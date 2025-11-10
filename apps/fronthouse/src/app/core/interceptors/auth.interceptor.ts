// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Obtener el token
  const token = authService.getToken();
  
  // Clonar la request y agregar el token si existe
  let authReq = req;
  if (token && !req.url.includes('/login')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  // Manejar la respuesta
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login')) {
        // Token expirado o inválido
        Swal.fire({
          icon: 'warning',
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
          timer: 3000,
          showConfirmButton: false
        });
        
        // Limpiar autenticación y redirigir
        localStorage.removeItem('placemy_token');
        localStorage.removeItem('placemy_user');
        authService.isAuthenticated.set(false);
        authService.currentUser.set(null);
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
