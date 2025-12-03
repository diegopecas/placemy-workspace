import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatoMenu, CategoriaMenu } from '../../../../common/models/establecimiento/plato.model';
import { ProductoMenu } from '../../../../common/models/establecimiento/producto.model';
import { Alergeno } from '../../../../common/models/establecimiento/alergeno.model';

@Component({
  selector: 'app-menu-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="menu-selector">
      <!-- Buscador -->
      <div class="buscador">
        <input
          type="text"
          [(ngModel)]="terminoBusqueda"
          (ngModelChange)="onBuscar($event)"
          placeholder="Buscar en el menú..."
          class="input-busqueda">
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="vista === 'platos'" 
          (click)="vista = 'platos'">
          🍽️ Platos ({{ platos.length }})
        </button>
        <button 
          class="tab" 
          [class.active]="vista === 'productos'" 
          (click)="vista = 'productos'">
          🥤 Productos ({{ productos.length }})
        </button>
      </div>

      <!-- Categorías -->
      <div class="categorias" *ngIf="vista === 'platos' && categorias.length > 0">
        <button 
          class="categoria-btn" 
          [class.active]="categoriaSeleccionada === null" 
          (click)="onSeleccionarCategoria(null)">
          Todas
        </button>
        <button 
          *ngFor="let cat of categorias" 
          class="categoria-btn" 
          [class.active]="categoriaSeleccionada === cat.id" 
          (click)="onSeleccionarCategoria(cat.id)">
          {{ cat.nombre }}
        </button>
      </div>

      <!-- Platos -->
      <div class="items-grid" *ngIf="vista === 'platos'">
        <div 
          class="item-card" 
          *ngFor="let plato of platos" 
          [class.tiene-alergia]="tieneAlergiaConflicto(plato)" 
          (click)="onAgregarPlato(plato)">
          
          <div class="item-imagen" *ngIf="plato.foto_url">
            <img [src]="plato.foto_url" [alt]="plato.nombre">
          </div>
          <div class="item-imagen placeholder" *ngIf="!plato.foto_url">🍽️</div>

          <div class="item-info">
            <h4>{{ plato.nombre }}</h4>
            <p class="descripcion" *ngIf="plato.descripcion">
              {{ plato.descripcion | slice:0:50 }}{{ plato.descripcion.length > 50 ? '...' : '' }}
            </p>
            <div class="alergenos" *ngIf="plato.alergenos?.length">
              <span 
                class="alergeno-icon" 
                *ngFor="let a of plato.alergenos" 
                [class.conflicto]="clienteEsAlergicoA(a.id)" 
                [title]="a.nombre">
                {{ a.icono || '⚠️' }}
              </span>
            </div>
          </div>

          <div class="item-precio">
            <span class="precio">{{ plato.precio | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
            <span class="tiempo" *ngIf="plato.tiempo_preparacion_min">
              ⏱️ {{ plato.tiempo_preparacion_min }} min
            </span>
          </div>

          <div class="alergia-warning" *ngIf="tieneAlergiaConflicto(plato)">
            ⚠️ Contiene alérgenos del cliente
          </div>
        </div>

        <div class="sin-items" *ngIf="platos.length === 0">No se encontraron platos</div>
      </div>

      <!-- Productos -->
      <div class="items-grid" *ngIf="vista === 'productos'">
        <div 
          class="item-card producto" 
          *ngFor="let producto of productos" 
          (click)="onAgregarProducto(producto)">
          
          <div class="item-imagen" *ngIf="producto.foto_url">
            <img [src]="producto.foto_url" [alt]="producto.nombre">
          </div>
          <div class="item-imagen placeholder" *ngIf="!producto.foto_url">🥤</div>

          <div class="item-info">
            <h4>{{ producto.nombre }}</h4>
            <p class="descripcion" *ngIf="producto.descripcion">
              {{ producto.descripcion | slice:0:50 }}{{ producto.descripcion.length > 50 ? '...' : '' }}
            </p>
          </div>

          <div class="item-precio">
            <span class="precio">{{ producto.precio_individual | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
          </div>
        </div>

        <div class="sin-items" *ngIf="productos.length === 0">No se encontraron productos</div>
      </div>
    </div>
  `,
  styles: [`
    .menu-selector {
      padding: 1rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .buscador {
      margin-bottom: 1rem;
    }

    .input-busqueda {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tab {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid var(--surface-border, #ddd);
      background: var(--surface-card, #fff);
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .tab:hover {
      background: var(--surface-hover, #f0f0f0);
    }

    .tab.active {
      background: var(--primary-color, #3b82f6);
      color: white;
      border-color: var(--primary-color, #3b82f6);
    }

    .categorias {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    .categoria-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--surface-border, #ddd);
      background: var(--surface-card, #fff);
      border-radius: 16px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
    }

    .categoria-btn:hover {
      background: var(--surface-hover, #f0f0f0);
    }

    .categoria-btn.active {
      background: var(--primary-color, #3b82f6);
      color: white;
      border-color: var(--primary-color, #3b82f6);
    }

    .items-grid {
      flex: 1;
      overflow-y: auto;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      align-content: start;
    }

    .item-card {
      background: var(--surface-card, #fff);
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 10px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
    }

    .item-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-color: var(--primary-color, #3b82f6);
    }

    .item-card.tiene-alergia {
      border-color: #f59e0b;
      background: #fffbeb;
    }

    .item-imagen {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--surface-ground, #f5f5f5);
    }

    .item-imagen img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-imagen.placeholder {
      font-size: 2rem;
    }

    .item-info {
      padding: 0.75rem;
    }

    .item-info h4 {
      margin: 0 0 0.25rem;
      font-size: 0.95rem;
      font-weight: 600;
    }

    .descripcion {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
      line-height: 1.3;
    }

    .alergenos {
      display: flex;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .alergeno-icon {
      font-size: 0.9rem;
      opacity: 0.7;
    }

    .alergeno-icon.conflicto {
      opacity: 1;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    .item-precio {
      padding: 0.5rem 0.75rem;
      border-top: 1px solid var(--surface-border, #ddd);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .precio {
      font-weight: 700;
      color: var(--primary-color, #3b82f6);
    }

    .tiempo {
      font-size: 0.75rem;
      color: var(--text-color-secondary, #666);
    }

    .alergia-warning {
      position: absolute;
      bottom: 40px;
      left: 0;
      right: 0;
      background: #fef3c7;
      color: #b45309;
      font-size: 0.7rem;
      padding: 0.25rem 0.5rem;
      text-align: center;
    }

    .sin-items {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      color: var(--text-color-secondary, #666);
    }
  `]
})
export class MenuSelectorComponent {
  @Input() categorias: CategoriaMenu[] = [];
  @Input() platos: PlatoMenu[] = [];
  @Input() productos: ProductoMenu[] = [];
  @Input() categoriaSeleccionada: number | null = null;
  @Input() clienteAlergenos: Alergeno[] = [];

  @Output() seleccionarCategoria = new EventEmitter<number | null>();
  @Output() buscar = new EventEmitter<string>();
  @Output() agregarPlato = new EventEmitter<PlatoMenu>();
  @Output() agregarProducto = new EventEmitter<ProductoMenu>();

  vista: 'platos' | 'productos' = 'platos';
  terminoBusqueda = '';
  private clienteAlergenoIds = new Set<number>();

  ngOnChanges(): void {
    this.clienteAlergenoIds = new Set(this.clienteAlergenos.map(a => a.id));
  }

  onBuscar(termino: string): void {
    this.buscar.emit(termino);
  }

  onSeleccionarCategoria(categoriaId: number | null): void {
    this.seleccionarCategoria.emit(categoriaId);
  }

  onAgregarPlato(plato: PlatoMenu): void {
    this.agregarPlato.emit(plato);
  }

  onAgregarProducto(producto: ProductoMenu): void {
    this.agregarProducto.emit(producto);
  }

  clienteEsAlergicoA(alergenoId: number): boolean {
    return this.clienteAlergenoIds.has(alergenoId);
  }

  tieneAlergiaConflicto(plato: PlatoMenu): boolean {
    if (!plato.alergenos?.length || !this.clienteAlergenoIds.size) {
      return false;
    }
    return plato.alergenos.some(a => this.clienteAlergenoIds.has(a.id));
  }
}