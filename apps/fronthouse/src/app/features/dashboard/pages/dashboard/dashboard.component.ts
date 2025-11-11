// apps/fronthouse/src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '@placemy/shared/auth';
// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Imports de la librería compartida
import { PermissionService } from '@placemy/shared/auth';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { HeaderComponent } from 'apps/fronthouse/src/app/shared/components/header/header.component';

/**
 * Interfaz para las tarjetas del menú
 */
interface MenuCard {
  title: string;
  description: string;
  icon: string;
  route: string;
  color: string;
  colorLight: string;
  colorDark: string;
  stats: { label: string; value: number };
  requiredPermission: string; // ← Nuevo campo
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);
  
  // Signals para estado reactivo
  currentUser = this.authService.currentUser;
  isLoading = signal(false);
  
  // Todas las tarjetas del menú (con permisos requeridos)
  private allMenuCards: MenuCard[] = [
    {
      title: 'Pedidos',
      description: 'Gestionar pedidos del restaurante',
      icon: 'receipt_long',
      route: '/pedidos',
      color: 'primary',
      colorLight: '#8B2635',
      colorDark: '#6e1721',
      stats: { label: 'Pendientes', value: 0 },
      requiredPermission: 'pedidos.ver' // Permiso requerido
    },
    {
      title: 'Mesas',
      description: 'Ver estado de las mesas',
      icon: 'table_restaurant',
      route: '/mesas',
      color: 'secondary',
      colorLight: '#17BEBB',
      colorDark: '#0e8f8c',
      stats: { label: 'Disponibles', value: 0 },
      requiredPermission: 'mesas.ver' // Permiso requerido
    },
    {
      title: 'Productos',
      description: 'Catálogo de productos',
      icon: 'restaurant_menu',
      route: '/productos',
      color: 'accent',
      colorLight: '#FF6B6B',
      colorDark: '#cc3d3d',
      stats: { label: 'En menú', value: 0 },
      requiredPermission: 'productos.ver' // Permiso requerido
    },
    {
      title: 'Platos',
      description: 'Gestionar platos del menú',
      icon: 'lunch_dining',
      route: '/platos',
      color: 'primary',
      colorLight: '#8B2635',
      colorDark: '#6e1721',
      stats: { label: 'Activos', value: 0 },
      requiredPermission: 'platos.ver' // Permiso requerido
    },
    {
      title: 'Staff',
      description: 'Gestión de personal',
      icon: 'people',
      route: '/staff',
      color: 'secondary',
      colorLight: '#17BEBB',
      colorDark: '#0e8f8c',
      stats: { label: 'Empleados', value: 0 },
      requiredPermission: 'staff.ver' // Permiso requerido
    },
    {
      title: 'Configuración',
      description: 'Configuración del sistema',
      icon: 'settings',
      route: '/configuracion',
      color: 'accent',
      colorLight: '#FF6B6B',
      colorDark: '#cc3d3d',
      stats: { label: 'Sistema', value: 1 },
      requiredPermission: 'core.configuraciones.ver' // Permiso requerido
    }
  ];

  /**
   * Signal computado que filtra las tarjetas según los permisos del usuario
   * Solo muestra las tarjetas para las que el usuario tiene permiso
   */
  menuCards = computed(() => {
    return this.allMenuCards.filter(card => 
      this.permissionService.hasPermission(card.requiredPermission)
    );
  });
  
  // Información de la aplicación
  appInfo = {
    name: 'PlaceMy',
    version: '1.0.0',
    year: new Date().getFullYear()
  };

  ngOnInit(): void {
    this.loadUserData();
    
    // Debug: Ver permisos del usuario (solo en desarrollo)
    if (!this.appInfo) {
      this.permissionService.debugPermissions();
    }
  }

  private loadUserData(): void {
    this.isLoading.set(true);
    
    this.authService.getMe().subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.isLoading.set(false);
        
        // Debug: mostrar tarjetas visibles
        console.log('Tarjetas visibles:', this.menuCards().length, 'de', this.allMenuCards.length);
      },
      error: (error) => {
        console.error('Error obteniendo información del usuario:', error);
        this.isLoading.set(false);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getUserDisplayName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    
    if (user.persona_natural?.nombres) {
      return user.persona_natural.nombres;
    }
    return user.username || 'Usuario';
  }

  getUserRole(): string {
    const user = this.currentUser();
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0].nombre;
    }
    return 'Sin rol asignado';
  }
}