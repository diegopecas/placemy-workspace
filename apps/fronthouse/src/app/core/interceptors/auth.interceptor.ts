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
  
  // ✅ NUEVO: Obtener establecimiento seleccionado
  const establecimiento = authService.getSelectedEstablecimiento();
  
  // Preparar headers a agregar
  const headers: { [key: string]: string } = {};
  
  // Agregar token si existe (excepto en login)
  if (token && !req.url.includes('/login')) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // ✅ NUEVO: Agregar establecimiento_id si existe
  if (establecimiento?.id) {
    headers['X-Establecimiento-Id'] = establecimiento.id.toString();
    console.log('🏢 Interceptor: establecimiento_id:', establecimiento.id);
  }
  
  // Clonar la request y agregar headers
  let authReq = req;
  if (Object.keys(headers).length > 0) {
    authReq = req.clone({
      setHeaders: headers
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
        localStorage.removeItem('selected_establecimiento'); // ✅ NUEVO
        authService.isAuthenticated.set(false);
        authService.currentUser.set(null);
        router.navigate(['/login']);
      }
      
      // ✅ NUEVO: Manejar error 400 por falta de establecimiento_id
      if (error.status === 400 && error.error?.message?.includes('establecimiento_id')) {
        console.error('❌ Error 400: Falta establecimiento_id');
        Swal.fire({
          icon: 'error',
          title: 'Establecimiento no seleccionado',
          text: 'Debes seleccionar un establecimiento para continuar.',
          confirmButtonText: 'Seleccionar'
        }).then(() => {
          router.navigate(['/select-establecimiento']);
        });
      }
      
      return throwError(() => error);
    })
  );
};