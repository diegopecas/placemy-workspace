// apps/fronthouse/src/app/features/mesero/pages/mesero-dashboard/mesero-dashboard.component.ts
import { Component, OnInit, inject, signal, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MesaService } from '../../../../common/services/mesa.service';
import { CuentaService } from '../../../../common/services/cuenta.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Mesa, ZonaEstablecimiento } from '../../../../common/models/establecimiento/mesa.model';
import { MesaCardComponent } from '../../components/mesa-card/mesa-card.component';

// Imports del header
import { HeaderComponent, ThemeService } from '@placemy/shared/ui-components';
import { PermissionService } from '@placemy/shared/auth';

interface MesaVisual extends Mesa {
  tieneCuentaActiva: boolean;
  cuentaId?: number;
  numeroCuenta?: string;
  colorEstado: string;
}

@Component({
  selector: 'app-mesero-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MesaCardComponent,
    HeaderComponent
  ],
  templateUrl: './mesero-dashboard.component.html',
  styleUrl: './mesero-dashboard.component.scss'
})
export class MeseroDashboardComponent implements OnInit {
  @ViewChild(HeaderComponent) header!: HeaderComponent;

  private readonly mesaService = inject(MesaService);
  private readonly cuentaService = inject(CuentaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly permissionService = inject(PermissionService);
  private readonly themeService = inject(ThemeService);

  // Estado
  cargando = signal(true);
  private cuentasActivas = signal<Map<number, { cuentaId: number; numeroCuenta: string }>>(new Map());

  // Signals para header
  currentUser = this.authService.currentUser;
  selectedEstablecimiento = this.authService.selectedEstablecimiento;
  currentTheme = this.themeService.currentTheme;

  // Computed desde servicios
  zonasComputed = computed((): ZonaEstablecimiento[] => this.mesaService.zonas());
  zonaSeleccionadaComputed = computed((): number | null => this.mesaService.zonaSeleccionada());

  // Computed local
  establecimientoNombre = computed(() => {
    const est = this.authService.getSelectedEstablecimiento();
    return est?.nombre ?? 'Sin establecimiento';
  });

  mesasVisuales = computed((): MesaVisual[] => {
    const mesas: Mesa[] = this.mesaService.mesasFiltradas();
    const cuentas = this.cuentasActivas();

    return mesas.map((mesa: Mesa) => {
      const cuentaInfo = cuentas.get(mesa.id);
      const estadoId = mesa.estado?.id;

      return {
        ...mesa,
        tieneCuentaActiva: !!cuentaInfo,
        cuentaId: cuentaInfo?.cuentaId,
        numeroCuenta: cuentaInfo?.numeroCuenta,
        colorEstado: this.getColorEstado(estadoId, !!cuentaInfo)
      };
    });
  });

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
    this.cargarDatos();
  }

  private cargarDatos(): void {
    const establecimiento = this.authService.getSelectedEstablecimiento();
    if (!establecimiento) {
      this.router.navigate(['/select-establecimiento']);
      return;
    }

    this.cargando.set(true);

    forkJoin({
      mesas: this.mesaService.cargarMesas(establecimiento.id),
      estados: this.mesaService.cargarEstadosMesa()
    }).subscribe({
      next: () => {
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('Error cargando mesas:', error);
        this.cargando.set(false);
      }
    });
  }

  filtrarPorZona(zonaId: number | null): void {
    this.mesaService.seleccionarZona(zonaId);
  }

  onSeleccionarMesa(mesa: MesaVisual): void {
    if (mesa.tieneCuentaActiva) {
      this.onVerCuenta(mesa);
    } else {
      this.onNuevaCuenta(mesa);
    }
  }

  onVerCuenta(mesa: MesaVisual): void {
    if (mesa.cuentaId) {
      this.router.navigate(['/mesero/cuenta', mesa.id, 'ver', mesa.cuentaId]);
    }
  }

  onNuevaCuenta(mesa: MesaVisual): void {
    this.router.navigate(['/mesero/cuenta', mesa.id]);
  }

  private getColorEstado(estadoId: number | undefined, tieneCuenta: boolean): string {
    // Si tiene cuenta activa, usar color amarillo pastel
    if (tieneCuenta) return '#FFEAA7';

    // Usar colores pastel hermosos según el ID del estado
    switch (estadoId) {
      case 1: return '#A8E6CF';  // Libre - Verde menta suave
      case 2: return '#FFB3BA';  // Ocupada - Rosa coral suave
      case 3: return '#FFD8B1';  // Reservada - Melocotón suave
      case 4: return '#BAE1FF';  // En Limpieza - Azul cielo suave
      case 5: return '#D5D5D5';  // Fuera de Servicio - Gris perla
      default: return '#E8E8E8'; // Sin estado - Gris muy claro
    }
  }
}