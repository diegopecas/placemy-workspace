// apps/fronthouse/src/app/features/mesero/components/items-list/items-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ItemPedidoDisplay {
  id?: number;
  tipo: 'plato' | 'producto';
  plato?: { id: number; nombre: string; foto_url?: string | null };
  producto?: { id: number; nombre: string; foto_url?: string | null };
  cantidad: number;
  precioUnitario: number;
  notasEspeciales: string;
  estado?: { nombre: string; color?: string | null };
  tieneConflictoAlergia?: boolean;
}

interface ItemPedido {
  id?: number;
  tipo: 'plato' | 'producto';
  plato?: { id: number; nombre: string; foto_url?: string | null };
  producto?: { id: number; nombre: string; foto_url?: string | null };
  cantidad: number;
  precioUnitario: number;
  notasEspeciales: string;
  estado?: { nombre: string; color?: string | null };
  tieneConflictoAlergia?: boolean;
}

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './items-list.component.html',
  styleUrl: './items-list.component.scss'
})
export class ItemsListComponent {
  @Input() items: ItemPedido[] = [];
  @Input() editando = true;

  @Output() eliminarItem = new EventEmitter<number>();
  @Output() actualizarCantidad = new EventEmitter<{ index: number; cantidad: number }>();
  @Output() actualizarNotas = new EventEmitter<{ index: number; notas: string }>();

  incrementar(index: number): void {
    const nuevaCantidad = this.items[index].cantidad + 1;
    this.actualizarCantidad.emit({ index, cantidad: nuevaCantidad });
  }

  decrementar(index: number): void {
    const nuevaCantidad = this.items[index].cantidad - 1;
    if (nuevaCantidad <= 0) {
      this.eliminarItem.emit(index);
    } else {
      this.actualizarCantidad.emit({ index, cantidad: nuevaCantidad });
    }
  }

  onEliminar(index: number): void {
    this.eliminarItem.emit(index);
  }

  onNotasChange(index: number, notas: string): void {
    this.actualizarNotas.emit({ index, notas });
  }

  getNombreItem(item: ItemPedido): string {
    return item.plato?.nombre || item.producto?.nombre || '';
  }

  getSubtotal(item: ItemPedido): number {
    return item.precioUnitario * item.cantidad;
  }
}