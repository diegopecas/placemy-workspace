// apps/fronthouse/src/app/features/mesero/pages/mesero-dashboard/mesero-dashboard.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MesaService } from '../../../../common/services/mesa.service';
import { CuentaService } from '../../../../common/services/cuenta.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Mesa, ZonaEstablecimiento } from '../../../../common/models/establecimiento/mesa.model';
import { MesaCardComponent } from '../../components/mesa-card/mesa-card.component';
import { ThemeService } from '@placemy/shared/ui-components';

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
    MesaCardComponent
  ],
  templateUrl: './mesero-dashboard.component.html',
  styleUrl: './mesero-dashboard.component.scss'
})
export class MeseroDashboardComponent implements OnInit {
  private readonly mesaService = inject(MesaService);
  private readonly cuentaService = inject(CuentaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly themeService = inject(ThemeService);

  // Estado
  cargando = signal(true);
  private cuentasActivas = signal<Map<number, { cuentaId: number; numeroCuenta: string }>>(new Map());

  // Theme
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

  ngOnInit(): void {
    console.log('🟢 MeseroDashboard ngOnInit');
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
        console.log('✅ Mesas cargadas');
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('❌ Error cargando mesas:', error);
        this.cargando.set(false);
      }
    });
  }

  filtrarPorZona(zonaId: number | null): void {
    this.mesaService.seleccionarZona(zonaId);
  }

  onSeleccionarMesa(mesa: MesaVisual): void {
    console.log('➕ Click en mesa - Navegando a crear-cuenta');
    this.router.navigate(['/mesero/crear-cuenta', mesa.id]);
  }

  onVerCuenta(mesa: MesaVisual): void {
    console.log('👁️ Ver cuenta - Navegando a crear-cuenta');
    this.router.navigate(['/mesero/crear-cuenta', mesa.id]);
  }

  onNuevaCuenta(mesa: MesaVisual): void {
    console.log('➕ Nueva cuenta - Navegando a crear-cuenta');
    this.router.navigate(['/mesero/crear-cuenta', mesa.id]);
  }

  private getColorEstado(estadoId: number | undefined, tieneCuenta: boolean): string {
    if (tieneCuenta) return '#FFEAA7';
    switch (estadoId) {
      case 1: return '#A8E6CF';
      case 2: return '#FFB3BA';
      case 3: return '#FFD8B1';
      case 4: return '#BAE1FF';
      case 5: return '#D5D5D5';
      default: return '#E8E8E8';
    }
  }
}