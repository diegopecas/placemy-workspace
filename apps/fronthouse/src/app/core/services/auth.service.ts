// src/app/core/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, Establecimiento } from '@placemy/shared/auth';
import { AuthResponse, LoginRequest, TokenData } from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
  private readonly TOKEN_KEY = 'placemy_token';
  private readonly REFRESH_TOKEN_KEY = 'placemy_refresh_token';
  private readonly USER_KEY = 'placemy_user';
  
  private apiUrl = `${environment.apiUrl}/auth`;
  
  // Signals para estado reactivo
  isAuthenticated = signal<boolean>(false);
  currentUser = signal<User | null>(null);
  
  // BehaviorSubject para compatibilidad
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  /**
   * Login del usuario
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('Intentando login con:', credentials);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Respuesta del servidor:', response);
          
          if (response.success && response.data) {
            // Guardar tokens
            this.saveTokenData(response.data);
            
            // Normalizar usuario incluyendo establecimientos
            const normalizedUser = this.normalizeUser(response.data.user, response.data.establecimientos);
            this.saveUserData(normalizedUser);
            
            this.isAuthenticated.set(true);
            this.isAuthenticatedSubject.next(true);
            this.currentUser.set(normalizedUser);
            
            console.log('Token guardado:', this.getToken());
            console.log('Usuario guardado:', normalizedUser);
          }
        }),
        catchError(error => {
          console.error('Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout del usuario
   */
  logout(): Observable<any> {
    const token = this.getToken();
    
    if (!token) {
      this.clearAuth();
      this.router.navigate(['/login']);
      return of(null);
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/logout`, {}, { headers })
      .pipe(
        tap(() => {
          this.clearAuth();
          this.snackBar.open('Sesión cerrada correctamente', '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.router.navigate(['/login']);
        }),
        catchError(error => {
          // Incluso si hay error, limpiamos la sesión local
          this.clearAuth();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
  }

  /**
   * Refrescar el token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No hay refresh token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${refreshToken}`
    });

    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { headers })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.saveTokenData(response.data);
          }
        }),
        catchError(error => {
          this.clearAuth();
          this.router.navigate(['/login']);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtener información del usuario actual
   */
  getMe(): Observable<any> {
    const token = this.getToken();
    
    if (!token) {
      return throwError(() => new Error('No hay token'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/me`, { headers })
      .pipe(
        tap((response: any) => {
          console.log('Respuesta de /me:', response);
          if (response.success && response.data) {
            const normalizedUser = this.normalizeUser(response.data, response.data.establecimientos);
            this.saveUserData(normalizedUser);
            this.currentUser.set(normalizedUser);
            console.log('Usuario actualizado:', normalizedUser);
          }
        })
      );
  }

  /**
   * Verificar el estado de autenticación
   */
  checkAuthStatus(): boolean {
    const token = this.getToken();
    console.log('Verificando auth status, token:', token);
    
    if (token && this.isTokenValid(token)) {
      const user = this.getUserData();
      this.isAuthenticated.set(true);
      this.isAuthenticatedSubject.next(true);
      this.currentUser.set(user);
      console.log('Usuario autenticado:', user);
      return true;
    } else {
      console.log('No hay token válido');
      this.clearAuth();
      return false;
    }
  }

  /**
   * Obtener el token almacenado
   */
  getToken(): string | null {
    const tokenData = localStorage.getItem(this.TOKEN_KEY);
    if (tokenData) {
      try {
        const data: TokenData = JSON.parse(tokenData);
        return data.access_token;
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Obtener el refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Verificar si el token es válido
   */
  private isTokenValid(token: string): boolean {
    try {
      // Para tokens de Laravel Sanctum, no podemos decodificar como JWT
      // Simplemente verificamos que existe
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Guardar datos del token
   */
  private saveTokenData(data: any): void {
    const tokenData: TokenData = {
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
      expiry_date: Date.now() + (data.expires_in * 1000)
    };
    
    localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
    
    // Guardar refresh token si existe
    if (data.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, data.refresh_token);
    }
    
    console.log('Tokens guardados en localStorage');
  }

  /**
   * Guardar datos del usuario
   */
  private saveUserData(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log('Usuario guardado en localStorage');
  }

  /**
   * Obtener datos del usuario almacenado
   */
  getUserData(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Normalizar usuario del backend al modelo frontend
   */
  private normalizeUser(backendUser: any, backendEstablecimientos?: any[]): User {
    // Normalizar establecimientos con sus roles
    const establecimientos: Establecimiento[] = (backendEstablecimientos || []).map((est: any) => ({
      id: est.id,
      nombre: est.nombre,
      slug: est.slug,
      logo_url: est.logo_url,
      roles: (est.roles || []).map((rol: any) => ({
        id: rol.id,
        nombre: rol.nombre,
        permisos: rol.permisos || []
      }))
    }));

    return {
      id: backendUser.id,
      username: backendUser.username,
      email: backendUser.email,
      persona_natural: backendUser.persona ? {
        id: backendUser.persona.id,
        tipo_documento_id: backendUser.persona.tipo_documento_id || 0,
        numero_documento: backendUser.persona.numero_documento,
        nombres: backendUser.persona.nombre_completo?.split(' ').slice(0, -2).join(' ') || '',
        apellidos: backendUser.persona.nombre_completo?.split(' ').slice(-2).join(' ') || '',
        nombre_completo: backendUser.persona.nombre_completo,
        telefono: backendUser.persona.telefono,
        direccion: backendUser.persona.direccion,
        ciudad_id: backendUser.persona.ciudad_id
      } : undefined,
      establecimientos
    };
  }

  /**
   * Obtener todos los permisos del usuario en todos los establecimientos
   */
  getAllPermissions(): string[] {
    const user = this.currentUser();
    if (!user) return [];
    
    const permisos = new Set<string>();
    
    user.establecimientos?.forEach(est => {
      est.roles.forEach(rol => {
        rol.permisos?.forEach(permiso => {
          permisos.add(permiso);
        });
      });
    });
    
    return Array.from(permisos);
  }

  /**
   * Obtener permisos en un establecimiento específico
   */
  getPermissionsInEstablecimiento(establecimientoId: number): string[] {
    const user = this.currentUser();
    if (!user) return [];
    
    const establecimiento = user.establecimientos?.find(e => e.id === establecimientoId);
    if (!establecimiento) return [];
    
    const permisos = new Set<string>();
    
    establecimiento.roles.forEach(rol => {
      rol.permisos?.forEach(permiso => {
        permisos.add(permiso);
      });
    });
    
    return Array.from(permisos);
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  hasPermission(permiso: string): boolean {
    return this.getAllPermissions().includes(permiso);
  }

  /**
   * Verificar si el usuario tiene un permiso en un establecimiento específico
   */
  hasPermissionInEstablecimiento(permiso: string, establecimientoId: number): boolean {
    return this.getPermissionsInEstablecimiento(establecimientoId).includes(permiso);
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuth(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isAuthenticated.set(false);
    this.isAuthenticatedSubject.next(false);
    this.currentUser.set(null);
    console.log('Autenticación limpiada');
  }
}