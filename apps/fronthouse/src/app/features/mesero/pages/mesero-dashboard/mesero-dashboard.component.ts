import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MesaService } from '../../../../common/services/mesa.service';
import { CuentaService } from '../../../../common/services/cuenta.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Mesa, ZonaEstablecimiento } from '../../../../common/models/establecimiento/mesa.model';
import { MesaCardComponent } from '../../components/mesa-card/mesa-card.component';

interface MesaVisual extends Mesa {
  tieneCuentaActiva: boolean;
  cuentaId?: number;
  numeroCuenta?: string;
  colorEstado: string;
}

@Component({
  selector: 'app-mesero-dashboard',
  standalone: true,
  imports: [CommonModule, MesaCardComponent],
  template: `
    <div class="mesero-dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <h1>Mis Mesas</h1>
        <div class="header-actions">
          <span class="establecimiento-nombre">{{ establecimientoNombre() }}</span>
        </div>
      </header>

      <!-- Filtros por zona -->
      <div class="zonas-filter" *ngIf="zonasComputed().length > 0">
        <button 
          class="zona-btn" 
          [class.active]="zonaSeleccionadaComputed() === null" 
          (click)="filtrarPorZona(null)">
          Todas
        </button>
        <button 
          *ngFor="let zona of zonasComputed()" 
          class="zona-btn" 
          [class.active]="zonaSeleccionadaComputed() === zona.id" 
          (click)="filtrarPorZona(zona.id)">
          {{ zona.nombre }}
        </button>
      </div>

      <!-- Loading -->
      <div class="loading" *ngIf="cargando()">
        <span class="loading-spinner"></span>
        <p>Cargando mesas...</p>
      </div>

      <!-- Grid de mesas -->
      <div class="mesas-grid" *ngIf="!cargando()">
        <app-mesa-card 
          *ngFor="let mesa of mesasVisuales()" 
          [mesa]="mesa" 
          (seleccionar)="onSeleccionarMesa($event)" 
          (verCuenta)="onVerCuenta($event)" 
          (nuevaCuenta)="onNuevaCuenta($event)">
        </app-mesa-card>
      </div>

      <!-- Sin mesas -->
      <div class="sin-mesas" *ngIf="!cargando() && mesasVisuales().length === 0">
        <p>No hay mesas asignadas</p>
      </div>

      <!-- Leyenda de estados -->
      <footer class="estados-leyenda">
        <div class="leyenda-item">
          <span class="color-dot disponible"></span>
          <span>Disponible</span>
        </div>
        <div class="leyenda-item">
          <span class="color-dot ocupada"></span>
          <span>Ocupada</span>
        </div>
        <div class="leyenda-item">
          <span class="color-dot cuenta-activa"></span>
          <span>Con cuenta activa</span>
        </div>
        <div class="leyenda-item">
          <span class="color-dot reservada"></span>
          <span>Reservada</span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .mesero-dashboard {
      padding: 1rem;
      min-height: 100vh;
      background: var(--surface-ground, #f5f5f5);
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--surface-border, #ddd);
    }

    .dashboard-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color, #333);
      margin: 0;
    }

    .establecimiento-nombre {
      font-size: 0.9rem;
      color: var(--text-color-secondary, #666);
    }

    .zonas-filter {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .zona-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--surface-border, #ddd);
      background: var(--surface-card, #fff);
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .zona-btn:hover {
      background: var(--surface-hover, #f0f0f0);
    }

    .zona-btn.active {
      background: var(--primary-color, #3b82f6);
      color: white;
      border-color: var(--primary-color, #3b82f6);
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--surface-border, #ddd);
      border-top-color: var(--primary-color, #3b82f6);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .mesas-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }

    .sin-mesas {
      text-align: center;
      padding: 3rem;
      color: var(--text-color-secondary, #666);
    }

    .estados-leyenda {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border, #ddd);
      flex-wrap: wrap;
    }

    .leyenda-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .color-dot.disponible { background: #22c55e; }
    .color-dot.ocupada { background: #3b82f6; }
    .color-dot.cuenta-activa { background: #f59e0b; }
    .color-dot.reservada { background: #a855f7; }
  `]
})
export class MeseroDashboardComponent implements OnInit {
  private readonly mesaService = inject(MesaService);
  private readonly cuentaService = inject(CuentaService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Estado
  cargando = signal(true);
  private cuentasActivas = signal<Map<number, { cuentaId: number; numeroCuenta: string }>>(new Map());

  // Computed desde servicios (wrapeados para evitar unknown)
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
      const estadoNombre = mesa.estado?.nombre?.toUpperCase() ?? '';

      return {
        ...mesa,
        tieneCuentaActiva: !!cuentaInfo,
        cuentaId: cuentaInfo?.cuentaId,
        numeroCuenta: cuentaInfo?.numeroCuenta,
        colorEstado: this.getColorEstado(estadoNombre, !!cuentaInfo)
      };
    });
  });

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

  private getColorEstado(estadoNombre: string, tieneCuenta: boolean): string {
    if (tieneCuenta) return '#f59e0b';

    switch (estadoNombre) {
      case 'DISPONIBLE': return '#22c55e';
      case 'OCUPADA': return '#3b82f6';
      case 'RESERVADA': return '#a855f7';
      case 'MANTENIMIENTO': return '#ef4444';
      default: return '#6b7280';
    }
  }
}