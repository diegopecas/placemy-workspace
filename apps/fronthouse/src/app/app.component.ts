// apps/fronthouse/src/app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PermissionService } from '@placemy/shared/auth';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: []
})
export class AppComponent implements OnInit {
  title = 'fronthouse';
  
  private permissionService = inject(PermissionService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Configurar el signal del usuario
    this.permissionService.setCurrentUserSignal(this.authService.currentUser);
    console.log('🔐 PermissionService configurado correctamente');
  }
}