// libs/shared/ui-components/src/lib/header/header.component.ts
import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

import { User, Establecimiento } from '@placemy/shared/auth';
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
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  private themeService = inject(ThemeService);
  
  currentUser = signal<User | null>(null);
  selectedEstablecimiento = signal<Establecimiento | null>(null);
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

  // Verificar si el usuario tiene múltiples establecimientos
  hasMultipleEstablecimientos = computed(() => {
    const user = this.currentUser();
    return (user?.establecimientos?.length || 0) > 1;
  });

  // Lista de establecimientos del usuario
  userEstablecimientos = computed(() => {
    const user = this.currentUser();
    return user?.establecimientos || [];
  });
  
  setCurrentUser(user: User | null): void {
    this.currentUser.set(user);
  }

  setSelectedEstablecimiento(establecimiento: Establecimiento | null): void {
    this.selectedEstablecimiento.set(establecimiento);
  }

  getUserDisplayName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    if (user.persona_natural?.nombres) return user.persona_natural.nombres;
    return user.username || 'Usuario';
  }

  getUserRole(): string {
    const selectedEst = this.selectedEstablecimiento();
    if (!selectedEst) {
      // Fallback al primer establecimiento si no hay seleccionado
      const user = this.currentUser();
      if (user?.establecimientos?.[0]?.roles?.[0]) {
        return user.establecimientos[0].roles[0].nombre;
      }
      return 'Usuario';
    }
    
    // Obtener el primer rol del establecimiento seleccionado
    if (selectedEst.roles && selectedEst.roles.length > 0) {
      return selectedEst.roles[0].nombre;
    }
    
    return 'Usuario';
  }

  getEstablecimientoName(): string {
    const selectedEst = this.selectedEstablecimiento();
    return selectedEst?.nombre || 'Sin establecimiento';
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

  getEstablecimientoInitials(nombre: string): string {
    return nombre
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }

  onChangeEstablecimiento(): void {
    Swal.fire({
      title: '¿Cambiar de establecimiento?',
      text: 'Serás redirigido a la selección de establecimiento',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8B2635',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        window.dispatchEvent(new CustomEvent('header-change-establecimiento'));
      }
    });
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
