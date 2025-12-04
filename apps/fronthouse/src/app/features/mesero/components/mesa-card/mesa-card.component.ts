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
  templateUrl: './mesa-card.component.html',
  styleUrl: './mesa-card.component.scss'
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
    // ID 1 = Libre (estado disponible)
    return this.mesa.estado?.id === 1;
  }

  getEstadoLabel(): string {
    if (this.mesa.tieneCuentaActiva) return 'Con cuenta';
    return this.mesa.estado?.nombre ?? 'Sin estado';
  }

  getEstadoIcon(): string {
    if (this.mesa.tieneCuentaActiva) return '🍽️';
    
    const estadoId = this.mesa.estado?.id;
    
    switch (estadoId) {
      case 1: return '✅';  // Libre
      case 2: return '👥';  // Ocupada
      case 3: return '📅';  // Reservada
      case 4: return '🧹';  // En Limpieza
      case 5: return '🚫';  // Fuera de Servicio
      default: return '❓'; // Sin estado
    }
  }
}