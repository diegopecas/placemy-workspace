import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alergeno } from '../../../../common/models/establecimiento/alergeno.model';

@Component({
  selector: 'app-alerta-alergia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onCancelar()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-icon">⚠️</div>

        <h2 class="modal-titulo">Advertencia de Alergia</h2>

        <p class="modal-mensaje">
          El cliente tiene alergia a ingredientes de <strong>{{ nombreItem }}</strong>:
        </p>

        <div class="alergenos-lista">
          <span class="alergeno-tag" *ngFor="let alergeno of alergenos">
            {{ alergeno.icono || '⚠️' }} {{ alergeno.nombre }}
          </span>
        </div>

        <p class="modal-pregunta">¿Desea agregar este plato de todas formas?</p>

        <div class="modal-acciones">
          <button class="btn-cancelar" (click)="onCancelar()">No, cancelar</button>
          <button class="btn-continuar" (click)="onContinuar()">Sí, agregar</button>
        </div>

        <p class="modal-nota">
          💡 El mesero debe informar al cliente sobre los alérgenos antes de confirmar el pedido.
        </p>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      max-width: 420px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      animation: bounce 0.5s ease;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .modal-titulo {
      margin: 0 0 1rem;
      font-size: 1.5rem;
      font-weight: 700;
      color: #b45309;
    }

    .modal-mensaje {
      margin: 0 0 1rem;
      color: var(--text-color, #333);
      line-height: 1.5;
    }

    .modal-mensaje strong {
      color: var(--primary-color, #3b82f6);
    }

    .alergenos-lista {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 1.5rem;
    }

    .alergeno-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 0.75rem;
      background: #fef3c7;
      color: #b45309;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .modal-pregunta {
      margin: 0 0 1.5rem;
      font-weight: 500;
      color: var(--text-color, #333);
    }

    .modal-acciones {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .btn-cancelar,
    .btn-continuar {
      flex: 1;
      padding: 0.875rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cancelar {
      background: var(--surface-ground, #f5f5f5);
      color: var(--text-color, #333);
      border: 1px solid var(--surface-border, #ddd);
    }

    .btn-cancelar:hover {
      background: var(--surface-hover, #e5e5e5);
    }

    .btn-continuar {
      background: #f59e0b;
      color: white;
    }

    .btn-continuar:hover {
      background: #d97706;
    }

    .modal-nota {
      margin: 0;
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
      padding: 0.75rem;
      background: var(--surface-ground, #f9fafb);
      border-radius: 8px;
      line-height: 1.4;
    }
  `]
})
export class AlertaAlergiaComponent {
  @Input() alergenos: Alergeno[] = [];
  @Input() nombreItem = '';

  @Output() continuar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onContinuar(): void {
    this.continuar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}