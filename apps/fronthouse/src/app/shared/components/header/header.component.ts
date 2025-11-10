import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import Swal from 'sweetalert2';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);
  currentUser = this.authService.currentUser;
  appInfo = { name: 'PlaceMy', tagline: 'Front House' };

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
    if (user.persona_natural?.nombres) return user.persona_natural.nombres;
    return user.username || 'Usuario';
  }

  getUserRole(): string {
    const user = this.currentUser();
    if (user?.roles && user.roles.length > 0) return user.roles[0].nombre;
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