import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mesa } from '../../../../common/models/establecimiento/mesa.model';

// Interfaz para mesa con propiedades visuales adicionales
interface MesaVisual extends Mesa {
  tieneCuentaActiva: boolean;
  cuentaId?: number;
  numeroCuenta?: string;
  colorEstado: string;
}

@Component({
  selector: 'app-mesa-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="mesa-card" 
      [class.cuenta-activa]="mesa.tieneCuentaActiva" 
      [style.--estado-color]="mesa.colorEstado" 
      (click)="onSeleccionar()">
      
      <div class="mesa-numero">
        <span class="numero">{{ mesa.numero_mesa }}</span>
        <span class="capacidad">{{ mesa.capacidad }} 👤</span>
      </div>

      <div class="mesa-estado">
        <span class="estado-badge" [style.background-color]="mesa.colorEstado">
          {{ getEstadoLabel() }}
        </span>
      </div>

      <div class="cuenta-info" *ngIf="mesa.tieneCuentaActiva && mesa.numeroCuenta">
        <span class="cuenta-numero">{{ mesa.numeroCuenta }}</span>
      </div>

      <div class="mesa-zona" *ngIf="mesa.zona">
        <small>{{ mesa.zona.nombre }}</small>
      </div>

      <div class="mesa-acciones">
        <button 
          *ngIf="!mesa.tieneCuentaActiva && isDisponible()" 
          class="btn-accion btn-nueva" 
          (click)="onNuevaCuenta($event)">
          Nueva Cuenta
        </button>
        <button 
          *ngIf="mesa.tieneCuentaActiva" 
          class="btn-accion btn-ver" 
          (click)="onVerCuenta($event)">
          Ver Cuenta
        </button>
      </div>
    </div>
  `,
  styles: [`
    .mesa-card {
      background: var(--surface-card, #fff);
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.2s ease;
      border-left: 4px solid var(--estado-color, #6b7280);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 140px;
    }

    .mesa-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .mesa-card.cuenta-activa {
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    }

    .mesa-numero {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mesa-numero .numero {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-color, #333);
    }

    .mesa-numero .capacidad {
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .mesa-estado {
      margin: 0.25rem 0;
    }

    .estado-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      color: white;
      text-transform: uppercase;
    }

    .cuenta-info {
      background: rgba(245, 158, 11, 0.2);
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      text-align: center;
    }

    .cuenta-numero {
      font-size: 0.8rem;
      font-weight: 600;
      color: #b45309;
    }

    .mesa-zona {
      color: var(--text-color-secondary, #666);
    }

    .mesa-zona small {
      font-size: 0.75rem;
    }

    .mesa-acciones {
      margin-top: auto;
      display: flex;
      gap: 0.5rem;
    }

    .btn-accion {
      flex: 1;
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-nueva {
      background: var(--primary-color, #3b82f6);
      color: white;
    }

    .btn-nueva:hover {
      background: var(--primary-color-dark, #2563eb);
    }

    .btn-ver {
      background: #f59e0b;
      color: white;
    }

    .btn-ver:hover {
      background: #d97706;
    }
  `]
})
export class MesaCardComponent {
  @Input({ required: true }) mesa!: MesaVisual;

  @Output() seleccionar = new EventEmitter<MesaVisual>();
  @Output() verCuenta = new EventEmitter<MesaVisual>();
  @Output() nuevaCuenta = new EventEmitter<MesaVisual>();

  onSeleccionar(): void {
    this.seleccionar.emit(this.mesa);
  }

  onVerCuenta(event: Event): void {
    event.stopPropagation();
    this.verCuenta.emit(this.mesa);
  }

  onNuevaCuenta(event: Event): void {
    event.stopPropagation();
    this.nuevaCuenta.emit(this.mesa);
  }

  isDisponible(): boolean {
    return this.mesa.estado?.nombre?.toUpperCase() === 'DISPONIBLE';
  }

  getEstadoLabel(): string {
    if (this.mesa.tieneCuentaActiva) return 'Con cuenta';
    return this.mesa.estado?.nombre ?? 'Sin estado';
  }
}