import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-cuenta',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="resumen-cuenta">
      <!-- Totales -->
      <div class="totales">
        <div class="linea-total">
          <span>Subtotal</span>
          <span>{{ subtotal | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>
        
        <div class="linea-total" *ngIf="impuestos > 0">
          <span>Impuestos (8%)</span>
          <span>{{ impuestos | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>
        
        <div class="linea-total descuento" *ngIf="descuentos > 0">
          <span>Descuentos</span>
          <span>-{{ descuentos | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>
        
        <div class="linea-total propina" *ngIf="propina > 0">
          <span>Propina</span>
          <span>{{ propina | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>
        
        <div class="linea-total total">
          <span>TOTAL</span>
          <span class="total-valor">{{ total | currency:'COP':'symbol-narrow':'1.0-0' }}</span>
        </div>
      </div>

      <!-- Acciones -->
      <div class="acciones">
        <button 
          *ngIf="!cuentaCreada" 
          class="btn-principal" 
          [disabled]="guardando || subtotal === 0" 
          (click)="onCrearCuenta()">
          {{ guardando ? 'Creando...' : 'Crear Cuenta' }}
        </button>

        <button 
          *ngIf="cuentaCreada" 
          class="btn-principal" 
          [disabled]="guardando" 
          (click)="onGuardarCambios()">
          {{ guardando ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .resumen-cuenta {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .totales {
      flex: 1;
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .linea-total {
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }

    .linea-total span:first-child {
      font-size: 0.75rem;
      color: var(--text-color-secondary, #666);
      text-transform: uppercase;
    }

    .linea-total span:last-child {
      font-size: 0.95rem;
      font-weight: 500;
    }

    .linea-total.descuento span:last-child {
      color: #22c55e;
    }

    .linea-total.total {
      padding-left: 1.5rem;
      border-left: 2px solid var(--surface-border, #ddd);
    }

    .linea-total.total span:first-child {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .total-valor {
      font-size: 1.5rem !important;
      font-weight: 700 !important;
      color: var(--primary-color, #3b82f6);
    }

    .acciones {
      display: flex;
      gap: 0.75rem;
    }

    .btn-principal {
      padding: 0.875rem 2rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-principal:hover:not(:disabled) {
      background: var(--primary-color-dark, #2563eb);
      transform: translateY(-1px);
    }

    .btn-principal:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .resumen-cuenta {
        flex-direction: column;
        gap: 1rem;
      }

      .totales {
        width: 100%;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .acciones {
        width: 100%;
      }

      .btn-principal {
        flex: 1;
      }
    }
  `]
})
export class ResumenCuentaComponent {
  @Input() subtotal = 0;
  @Input() impuestos = 0;
  @Input() descuentos = 0;
  @Input() propina = 0;
  @Input() total = 0;
  @Input() cuentaCreada = false;
  @Input() guardando = false;

  @Output() crearCuenta = new EventEmitter<void>();
  @Output() guardarCambios = new EventEmitter<void>();

  onCrearCuenta(): void {
    this.crearCuenta.emit();
  }

  onGuardarCambios(): void {
    this.guardarCambios.emit();
  }
}