// apps/fronthouse/src/app/features/auth/pages/select-establecimiento/select-establecimiento.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

// Imports de librerías compartidas
import { Establecimiento, PermissionService } from '@placemy/shared/auth';
import { ThemeService, ButtonBurstDirective } from '@placemy/shared/ui-components';

@Component({
  selector: 'app-select-establecimiento',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ButtonBurstDirective
  ],
  templateUrl: './select-establecimiento.component.html',
  styleUrl: './select-establecimiento.component.scss'
})
export class SelectEstablecimientoComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private themeService = inject(ThemeService);
  private permissionService = inject(PermissionService);
  
  // Signals para estado reactivo
  isLoading = signal(false);
  currentUser = this.authService.currentUser;
  
  // Tema actual
  currentTheme = this.themeService.currentTheme;
  
  // Partículas flotantes basadas en el tema
  floatingParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      icon: theme.decorativeElements[
        Math.floor(Math.random() * theme.decorativeElements.length)
      ]
    }));
  });
  
  // Establecimientos del usuario
  establecimientos = computed(() => {
    const user = this.currentUser();
    return user?.establecimientos || [];
  });
  
  // Información de la aplicación
  appInfo = {
    name: 'PlaceMy',
    tagline: 'Front House',
    version: '1.0.0',
    year: new Date().getFullYear()
  };

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.checkAuthStatus()) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Si el usuario ya tiene un establecimiento seleccionado, ir al dashboard
    const selectedEst = this.authService.getSelectedEstablecimiento();
    if (selectedEst) {
      this.router.navigate(['/dashboard']);
      return;
    }
    
    // Auto-seleccionar si solo tiene un establecimiento
    const establecimientos = this.establecimientos();
    if (establecimientos.length === 1) {
      this.selectEstablecimiento(establecimientos[0]);
      return;
    }
    
    // Si no tiene establecimientos, mostrar mensaje
    if (establecimientos.length === 0) {
      this.snackBar.open('No tienes acceso a ningún establecimiento', 'Cerrar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
    
    console.log('🏢 Establecimientos disponibles:', establecimientos.length);
  }

  /**
   * Seleccionar un establecimiento y navegar al dashboard
   */
  selectEstablecimiento(establecimiento: Establecimiento): void {
    this.isLoading.set(true);
    
    // Guardar el establecimiento seleccionado
    this.authService.setSelectedEstablecimiento(establecimiento);
    
    // Configurar los permisos del establecimiento en el PermissionService
    this.permissionService.setActiveEstablecimiento(establecimiento.id);
    
    this.snackBar.open(`Ingresando a ${establecimiento.nombre}...`, '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
    
    // Navegar al dashboard después de un pequeño delay para la animación
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 800);
  }

  /**
   * Obtener el nombre para mostrar del usuario
   */
  getUserDisplayName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    
    if (user.persona_natural?.nombres) {
      return user.persona_natural.nombres;
    }
    return user.username || 'Usuario';
  }

  /**
   * Obtener los roles del usuario en un establecimiento
   */
  getRolesInEstablecimiento(establecimiento: Establecimiento): string {
    if (!establecimiento.roles || establecimiento.roles.length === 0) {
      return 'Sin rol asignado';
    }
    return establecimiento.roles.map(r => r.nombre).join(', ');
  }

  /**
   * Obtener el conteo de permisos en un establecimiento
   */
  getPermissionCount(establecimiento: Establecimiento): number {
    const permisos = new Set<string>();
    establecimiento.roles?.forEach(rol => {
      rol.permisos?.forEach(permiso => permisos.add(permiso));
    });
    return permisos.size;
  }

  /**
   * Obtener iniciales del establecimiento para avatar
   */
  getEstablecimientoInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    this.authService.logout().subscribe();
  }
}
