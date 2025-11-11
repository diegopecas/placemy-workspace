// apps/fronthouse/src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Angular Material imports
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

// Imports de las librerías compartidas
import { PermissionService } from '@placemy/shared/auth';
import { HeaderComponent } from '@placemy/shared/ui-components'; // ← NUEVO IMPORT

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
  requiredPermission: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent, // ← AHORA DESDE LA LIBRERÍA
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
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  
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
      requiredPermission: 'pedidos.ver'
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
      requiredPermission: 'mesas.ver'
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
      requiredPermission: 'productos.ver'
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
      requiredPermission: 'platos.ver'
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
      requiredPermission: 'staff.ver'
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
      requiredPermission: 'core.configuraciones.ver'
    }
  ];

  /**
   * Signal computado que filtra las tarjetas según los permisos del usuario
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

  constructor() {
    // Configurar el usuario en el header reactivamente
    effect(() => {
      if (this.header) {
        this.header.setCurrentUser(this.currentUser());
      }
    });

    // Escuchar el evento de logout del header
    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });
  }

  ngOnInit(): void {
    this.loadUserData();
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