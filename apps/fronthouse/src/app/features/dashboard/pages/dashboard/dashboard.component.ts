// apps/fronthouse/src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  ViewChild,
  effect,
} from '@angular/core';
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
import {
  HeaderComponent,
  ThemeService,
  ButtonBurstDirective,
} from '@placemy/shared/ui-components';

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
    HeaderComponent,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    ButtonBurstDirective,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(HeaderComponent) header!: HeaderComponent;

  private authService = inject(AuthService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);
  private themeService = inject(ThemeService);

  // Signals para estado reactivo
  currentUser = this.authService.currentUser;
  selectedEstablecimiento = this.authService.selectedEstablecimiento;
  isLoading = signal(false);
  currentTheme = this.themeService.currentTheme;

  // ✨ Partículas flotantes basadas en el tema actual
  floatingParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      icon: theme.decorativeElements[
        Math.floor(Math.random() * theme.decorativeElements.length)
      ],
    }));
  });

  // ✨ Estrellas de fondo
  stars = Array.from({ length: 80 }, () => ({
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 3 + 2,
  }));

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
      requiredPermission: 'pedidos.ver',
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
      requiredPermission: 'mesas.ver',
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
      requiredPermission: 'productos.ver',
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
      requiredPermission: 'platos.ver',
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
      requiredPermission: 'staff.ver',
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
      requiredPermission: 'core.configuraciones.ver',
    },
  ];

  /**
   * Signal computado que filtra las tarjetas según los permisos del usuario
   * en el establecimiento seleccionado
   */
  menuCards = computed(() => {
    return this.allMenuCards.filter((card) =>
      this.permissionService.hasPermission(card.requiredPermission)
    );
  });

  // Información de la aplicación
  appInfo = {
    name: 'PlaceMy',
    version: '1.0.0',
    year: new Date().getFullYear(),
  };

  constructor() {
    // Configurar el usuario y establecimiento en el header reactivamente
    effect(() => {
      const user = this.currentUser();
      const establecimiento = this.selectedEstablecimiento();

      setTimeout(() => {
        if (this.header) {
          this.header.setCurrentUser(user);
          this.header.setSelectedEstablecimiento(establecimiento);
        }
      }, 0);
    });

    // Escuchar el evento de logout del header
    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });

    // Escuchar evento de cambio de establecimiento
    window.addEventListener('header-change-establecimiento', () => {
      this.authService.clearSelectedEstablecimiento();
      this.permissionService.clearActiveEstablecimiento();
      this.router.navigate(['/select-establecimiento']);
    });
  }

  ngOnInit(): void {
    // Verificar que hay establecimiento seleccionado
    const selectedEst = this.selectedEstablecimiento();
    console.log('🏢 Establecimiento seleccionado:', selectedEst);
    if (!selectedEst) {
      this.router.navigate(['/select-establecimiento']);
      return;
    }

    // Configurar el establecimiento activo en el PermissionService
    this.permissionService.setActiveEstablecimiento(selectedEst.id);

    // 🎄 Forzar tema de navidad para probar
    //this.themeService.setTheme('christmas');

    this.loadUserData();

    // Debug
    console.log('🎨 Dashboard - Tema actual:', this.currentTheme().name);
    console.log('🎨 Título:', this.currentTheme().title);
    console.log('🏢 Establecimiento activo:', selectedEst.nombre);
  }

  private loadUserData(): void {
    this.isLoading.set(true);

    this.authService.getMe().subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.isLoading.set(false);

        // Debug: mostrar tarjetas visibles
        console.log(
          'Tarjetas visibles:',
          this.menuCards().length,
          'de',
          this.allMenuCards.length
        );

        // Debug de permisos
        this.permissionService.debugPermissions();
      },
      error: (error) => {
        console.error('Error obteniendo información del usuario:', error);
        this.isLoading.set(false);
      },
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
    const selectedEst = this.selectedEstablecimiento();
    if (!selectedEst) return 'Sin rol asignado';

    // Obtener el primer rol del establecimiento seleccionado
    if (selectedEst.roles && selectedEst.roles.length > 0) {
      return selectedEst.roles[0].nombre;
    }

    return 'Sin rol asignado';
  }

  /**
   * Obtener el nombre del establecimiento activo
   */
  getEstablecimientoName(): string {
    const selectedEst = this.selectedEstablecimiento();
    return selectedEst?.nombre || 'Sin establecimiento';
  }
}
