// apps/fronthouse/src/app/features/mesero/pages/crear-cuenta/crear-cuenta.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@placemy/shared/ui-components';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private themeService = inject(ThemeService);

  // Tema actual
  currentTheme = this.themeService.currentTheme;
  
  // Mesa ID
  mesaId = signal<string | null>(null);

  constructor() {
    console.log('🟢 CrearCuenta - Constructor');
  }

  ngOnInit(): void {
    console.log('🟢 CrearCuenta - ngOnInit');
    
    const id = this.route.snapshot.paramMap.get('mesaId');
    this.mesaId.set(id);
    
    console.log('📋 Mesa ID recibido:', id);
  }

  volver(): void {
    console.log('🔙 Volviendo a mesero dashboard');
    this.router.navigate(['/mesero']);
  }
}