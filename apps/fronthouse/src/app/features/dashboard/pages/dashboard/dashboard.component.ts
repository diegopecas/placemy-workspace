// apps/fronthouse/src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

// Angular Material imports (solo los que necesitas ahora)
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { HeaderComponent } from 'apps/fronthouse/src/app/shared/components/header/header.component';



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
  
  // Signals para estado reactivo
  currentUser = this.authService.currentUser;
  isLoading = signal(false);
  
  // Datos para las tarjetas del dashboard
  menuCards = [
    {
      title: 'Pedidos',
      description: 'Gestionar pedidos del restaurante',
      icon: 'receipt_long',
      route: '/pedidos',
      color: 'primary',
      colorLight: '#8B2635',
      colorDark: '#6e1721',
      stats: { label: 'Pendientes', value: 0 }
    },
    {
      title: 'Mesas',
      description: 'Ver estado de las mesas',
      icon: 'table_restaurant',
      route: '/mesas',
      color: 'secondary',
      colorLight: '#17BEBB',
      colorDark: '#0e8f8c',
      stats: { label: 'Disponibles', value: 0 }
    },
    {
      title: 'Productos',
      description: 'Catálogo de productos',
      icon: 'restaurant_menu',
      route: '/productos',
      color: 'accent',
      colorLight: '#FF6B6B',
      colorDark: '#cc3d3d',
      stats: { label: 'En menú', value: 0 }
    }
  ];
  
  // Información de la aplicación
  appInfo = {
    name: 'PlaceMy',
    version: '1.0.0',
    year: new Date().getFullYear()
  };

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    this.isLoading.set(true);
    
    this.authService.getMe().subscribe({
      next: (response) => {
        console.log('Usuario actualizado:', response);
        this.isLoading.set(false);
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