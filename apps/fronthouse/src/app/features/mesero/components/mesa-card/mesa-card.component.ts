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
    return this.mesa.estado?.nombre?.toUpperCase() === 'DISPONIBLE';
  }

  getEstadoLabel(): string {
    if (this.mesa.tieneCuentaActiva) return 'Con cuenta';
    return this.mesa.estado?.nombre ?? 'Sin estado';
  }

  getEstadoIcon(): string {
    if (this.mesa.tieneCuentaActiva) return '🍽️';
    
    const estado = this.mesa.estado?.nombre?.toUpperCase() ?? '';
    switch (estado) {
      case 'DISPONIBLE': return '✅';
      case 'OCUPADA': return '🔵';
      case 'RESERVADA': return '📅';
      case 'MANTENIMIENTO': return '🔧';
      default: return '❓';
    }
  }
}