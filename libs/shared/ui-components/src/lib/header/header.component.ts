// libs/shared/ui-components/src/lib/header/header.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

// Importar desde la librería de auth
import { User } from '@placemy/shared/auth';

/**
 * Header Component Reutilizable
 * 
 * Componente de cabecera compartido entre todas las aplicaciones del workspace.
 * Muestra el logo PlaceMy, información del usuario y botón de logout.
 * 
 * @example
 * ```html
 * <app-header></app-header>
 * ```
 * 
 * @requires AuthService debe estar inyectado en la app que lo use
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  
  // El AuthService debe ser inyectado por la app que use este componente
  // Por eso usamos un Input para recibir el usuario
  currentUser = signal<User | null>(null);
  
  /**
   * Método para configurar el usuario actual desde la app que usa el header
   * @param user Usuario actual
   */
  setCurrentUser(user: User | null): void {
    this.currentUser.set(user);
  }

  /**
   * Obtener el nombre a mostrar del usuario
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
   * Obtener el rol principal del usuario
   */
  getUserRole(): string {
    const user = this.currentUser();
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0].nombre;
    }
    return 'Usuario';
  }

  /**
   * Obtener las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    
    if (user.persona_natural?.nombres && user.persona_natural?.apellidos) {
      const nombres = user.persona_natural.nombres.split(' ')[0];
      const apellidos = user.persona_natural.apellidos.split(' ')[0];
      return `${nombres[0]}${apellidos[0]}`.toUpperCase();
    }
    
    return user.username?.substring(0, 2).toUpperCase() || 'U';
  }

  /**
   * Logout con confirmación
   */
  onLogout(): void {
    Swal.fire({
      title: '¿Cerrar sesión?',
      text: '¿Estás seguro de que deseas cerrar tu sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8B2635',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        // Emitir evento para que la app maneje el logout
        window.dispatchEvent(new CustomEvent('header-logout'));
      }
    });
  }

  /**
   * Navegar al perfil del usuario
   */
  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  /**
   * Navegar al dashboard
   */
  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
