// apps/fronthouse/src/app/features/mesero/layout/mesero-layout/mesero-layout.component.ts
import { Component, ViewChild, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent, ThemeService } from '@placemy/shared/ui-components';
import { PermissionService } from '@placemy/shared/auth';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-mesero-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './mesero-layout.component.html',
  styleUrl: './mesero-layout.component.scss'
})
export class MeseroLayoutComponent {
  @ViewChild(HeaderComponent) header!: HeaderComponent;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);
  private readonly themeService = inject(ThemeService);

  currentUser = this.authService.currentUser;
  selectedEstablecimiento = this.authService.selectedEstablecimiento;
  currentTheme = this.themeService.currentTheme;

  constructor() {
    console.log('🟢 MeseroLayout - Constructor');
    
    // Configurar header reactivamente
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

    // Listener para logout desde el header
    window.addEventListener('header-logout', () => {
      console.log('🔴 Logout desde header');
      this.authService.logout().subscribe();
    });

    // Listener para cambio de establecimiento
    window.addEventListener('header-change-establecimiento', () => {
      console.log('🔄 Cambio de establecimiento');
      this.authService.clearSelectedEstablecimiento();
      this.permissionService.clearActiveEstablecimiento();
      this.router.navigate(['/select-establecimiento']);
    });
  }
}