// src/app/features/dashboard/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
      icon: 'clipboard-list',
      route: '/pedidos',
      gradient: 'from-primary-500 to-primary-600',
      stats: { label: 'Pendientes', value: 0 }
    },
    {
      title: 'Mesas',
      description: 'Ver estado de las mesas',
      icon: 'home',
      route: '/mesas',
      gradient: 'from-secondary-400 to-secondary-500',
      stats: { label: 'Disponibles', value: 0 }
    },
    {
      title: 'Productos',
      description: 'Catálogo de productos',
      icon: 'box',
      route: '/productos',
      gradient: 'from-accent to-red-500',
      stats: { label: 'En menú', value: 0 }
    }
  ];
  
  // Información de la aplicación
  appInfo = {
    name: 'PlaceMy',
    tagline: 'Front House',
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

  logout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8B2635',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe();
      }
    });
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

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    
    if (user.persona_natural?.nombres && user.persona_natural?.apellidos) {
      const firstNameInitial = user.persona_natural.nombres.charAt(0);
      const lastNameInitial = user.persona_natural.apellidos.charAt(0);
      return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
    }
    
    return user.username ? user.username.charAt(0).toUpperCase() : 'U';
  }
}
