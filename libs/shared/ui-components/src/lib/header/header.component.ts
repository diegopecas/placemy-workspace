// libs/shared/ui-components/src/lib/header/header.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

import { User } from '@placemy/shared/auth';
import { ThemeService } from '../services/theme.service';

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
  private themeService = inject(ThemeService);
  
  currentUser = signal<User | null>(null);
  currentTheme = this.themeService.currentTheme;
  
  // Gradiente con 3 colores (como el dashboard)
  headerBackground = computed(() => {
    const theme = this.currentTheme();
    return `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.accentColor} 50%, ${theme.primaryColor} 100%)`;
  });
  
  // Colores para el avatar
  avatarColors = computed(() => {
    const theme = this.currentTheme();
    return {
      primary: theme.primaryColor,
      accent: theme.accentColor
    };
  });
  
  setCurrentUser(user: User | null): void {
    this.currentUser.set(user);
  }

  getUserDisplayName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    if (user.persona_natural?.nombres) return user.persona_natural.nombres;
    return user.username || 'Usuario';
  }

  getUserRole(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    
    // Obtener el primer rol del primer establecimiento
    if (user.establecimientos && user.establecimientos.length > 0) {
      const primerEstablecimiento = user.establecimientos[0];
      if (primerEstablecimiento.roles && primerEstablecimiento.roles.length > 0) {
        return primerEstablecimiento.roles[0].nombre;
      }
    }
    
    return 'Usuario';
  }

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
        window.dispatchEvent(new CustomEvent('header-logout'));
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/perfil']);
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}