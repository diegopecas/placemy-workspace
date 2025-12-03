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
  template: `
    <div class="items-list">
      <!-- Sin items -->
      <div class="sin-items" *ngIf="items.length === 0">
        <div class="icono">🍽️</div>
        <p>Agrega platos o productos del menú</p>
      </div>

      <!-- Lista -->
      <div 
        class="item" 
        *ngFor="let item of items; let i = index" 
        [class.con-alergia]="item.tieneConflictoAlergia" 
        [class.guardado]="item.id">
        
        <div class="item-main">
          <div class="item-nombre">
            <span class="tipo-icon">{{ item.tipo === 'plato' ? '🍽️' : '🥤' }}</span>
            <span class="nombre">{{ item.plato?.nombre || item.producto?.nombre }}</span>
            <span class="alergia-badge" *ngIf="item.tieneConflictoAlergia">⚠️</span>
          </div>
          <div class="item-precio">
            {{ item.precioUnitario | currency:'COP':'symbol-narrow':'1.0-0' }}
          </div>
        </div>

        <!-- Controles cantidad -->
        <div class="item-controles" *ngIf="editando && !item.id">
          <button class="btn-cantidad" (click)="decrementar(i)">−</button>
          <span class="cantidad">{{ item.cantidad }}</span>
          <button class="btn-cantidad" (click)="incrementar(i)">+</button>
        </div>
        
        <div class="item-cantidad-fija" *ngIf="!editando || item.id">
          <span>x{{ item.cantidad }}</span>
        </div>

        <!-- Subtotal -->
        <div class="item-subtotal">
          {{ (item.precioUnitario * item.cantidad) | currency:'COP':'symbol-narrow':'1.0-0' }}
        </div>

        <!-- Estado -->
        <div 
          class="item-estado" 
          *ngIf="item.estado" 
          [style.background-color]="item.estado.color || '#6b7280'">
          {{ item.estado.nombre }}
        </div>

        <!-- Notas -->
        <div class="item-notas" *ngIf="editando && !item.id">
          <input
            type="text"
            [(ngModel)]="item.notasEspeciales"
            (ngModelChange)="onNotasChange(i, $event)"
            placeholder="Notas especiales (ej: sin cebolla)"
            class="input-notas">
        </div>
        
        <div class="item-notas-texto" *ngIf="item.notasEspeciales && (item.id || !editando)">
          📝 {{ item.notasEspeciales }}
        </div>

        <!-- Eliminar -->
        <button 
          class="btn-eliminar" 
          *ngIf="editando && !item.id" 
          (click)="onEliminar(i)" 
          title="Eliminar">
          🗑️
        </button>
      </div>
    </div>
  `,
  styles: [`
    .items-list {
      flex: 1;
      overflow-y: auto;
    }

    .sin-items {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      color: var(--text-color-secondary, #666);
    }

    .sin-items .icono {
      font-size: 3rem;
      margin-bottom: 0.5rem;
      opacity: 0.5;
    }

    .item {
      display: grid;
      grid-template-columns: 1fr auto auto auto;
      gap: 0.5rem;
      align-items: center;
      padding: 0.75rem;
      border-bottom: 1px solid var(--surface-border, #eee);
      position: relative;
    }

    .item:last-child {
      border-bottom: none;
    }

    .item.con-alergia {
      background: #fffbeb;
    }

    .item.guardado {
      opacity: 0.8;
    }

    .item-main {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .item-nombre {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tipo-icon {
      font-size: 0.9rem;
    }

    .nombre {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .alergia-badge {
      font-size: 0.9rem;
    }

    .item-precio {
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
    }

    .item-controles {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-cantidad {
      width: 28px;
      height: 28px;
      border: 1px solid var(--surface-border, #ddd);
      background: var(--surface-card, #fff);
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-cantidad:hover {
      background: var(--surface-hover, #f0f0f0);
    }

    .cantidad {
      min-width: 24px;
      text-align: center;
      font-weight: 600;
    }

    .item-cantidad-fija {
      font-weight: 500;
      color: var(--text-color-secondary, #666);
    }

    .item-subtotal {
      font-weight: 600;
      color: var(--primary-color, #3b82f6);
      min-width: 80px;
      text-align: right;
    }

    .item-estado {
      position: absolute;
      top: 0.25rem;
      right: 0.25rem;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-size: 0.65rem;
      font-weight: 500;
      color: white;
      text-transform: uppercase;
    }

    .item-notas {
      grid-column: 1 / -1;
      margin-top: 0.25rem;
    }

    .input-notas {
      width: 100%;
      padding: 0.375rem 0.5rem;
      border: 1px dashed var(--surface-border, #ddd);
      border-radius: 4px;
      font-size: 0.8rem;
      background: var(--surface-ground, #f9f9f9);
      box-sizing: border-box;
    }

    .item-notas-texto {
      grid-column: 1 / -1;
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
      padding-left: 1.5rem;
    }

    .btn-eliminar {
      position: absolute;
      top: 50%;
      right: -8px;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border: none;
      background: #fee2e2;
      border-radius: 50%;
      cursor: pointer;
      font-size: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .item:hover .btn-eliminar {
      opacity: 1;
    }

    .btn-eliminar:hover {
      background: #fecaca;
    }
  `]
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
}