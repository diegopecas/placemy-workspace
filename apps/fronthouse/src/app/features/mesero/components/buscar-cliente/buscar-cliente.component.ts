import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClienteService } from '../../../../common/services/cliente.service';
import { Cliente, CreateClienteCompletoDto, ClientesListResponse } from '../../../../common/models/cliente/cliente.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-buscar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="buscar-cliente">
      <!-- Tabs -->
      <div class="tabs">
        <button 
          class="tab" 
          [class.active]="modo() === 'buscar'" 
          (click)="cambiarModo('buscar')">
          Buscar
        </button>
        <button 
          class="tab" 
          [class.active]="modo() === 'crear'" 
          (click)="cambiarModo('crear')">
          Crear Nuevo
        </button>
      </div>

      <!-- Buscar -->
      <div class="buscar-form" *ngIf="modo() === 'buscar'">
        <div class="campo-busqueda">
          <label>Buscar por teléfono o documento</label>
          <input
            type="text"
            [(ngModel)]="terminoBusqueda"
            (ngModelChange)="onBuscar($event)"
            placeholder="Ingrese teléfono o documento"
            class="input-busqueda">
        </div>

        <div class="resultados" *ngIf="buscando() || resultados().length > 0">
          <div class="buscando" *ngIf="buscando()">Buscando...</div>

          <div 
            class="resultado-item" 
            *ngFor="let cliente of resultados()" 
            (click)="seleccionar(cliente)">
            <div class="cliente-info">
              <span class="nombre">{{ cliente.persona?.nombre_completo ?? cliente.sobrenombre }}</span>
              <span class="telefono" *ngIf="cliente.persona?.telefono">
                📱 {{ cliente.persona?.telefono }}
              </span>
            </div>
            <div class="cliente-doc" *ngIf="cliente.persona?.numero_documento">
              Doc: {{ cliente.persona?.numero_documento }}
            </div>
          </div>

          <div class="sin-resultados" *ngIf="!buscando() && resultados().length === 0 && terminoBusqueda.length >= 3">
            No se encontraron clientes
          </div>
        </div>
      </div>

      <!-- Crear -->
      <div class="crear-form" *ngIf="modo() === 'crear'">
        <div class="form-row">
          <div class="form-group">
            <label>Primer Nombre *</label>
            <input type="text" [(ngModel)]="nuevoCliente.primer_nombre" required>
          </div>
          <div class="form-group">
            <label>Segundo Nombre</label>
            <input type="text" [(ngModel)]="nuevoCliente.segundo_nombre">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Primer Apellido *</label>
            <input type="text" [(ngModel)]="nuevoCliente.primer_apellido" required>
          </div>
          <div class="form-group">
            <label>Segundo Apellido</label>
            <input type="text" [(ngModel)]="nuevoCliente.segundo_apellido">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Teléfono *</label>
            <input type="tel" [(ngModel)]="nuevoCliente.telefono" required>
          </div>
          <div class="form-group">
            <label>Tipo Documento</label>
            <select [(ngModel)]="nuevoCliente.tipo_documento_id">
              <option [value]="1">Cédula</option>
              <option [value]="2">Pasaporte</option>
              <option [value]="3">Otro</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group full">
            <label>Número Documento *</label>
            <input type="text" [(ngModel)]="nuevoCliente.numero_documento" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group full">
            <label>Email</label>
            <input type="email" [(ngModel)]="nuevoCliente.email">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group full">
            <label>Sobrenombre (cómo le gusta que lo llamen)</label>
            <input type="text" [(ngModel)]="nuevoCliente.sobrenombre">
          </div>
        </div>

        <div class="form-actions">
          <button 
            class="btn-crear" 
            [disabled]="!formularioValido() || creando()" 
            (click)="crearCliente()">
            {{ creando() ? 'Creando...' : 'Crear Cliente' }}
          </button>
        </div>

        <div class="error-mensaje" *ngIf="errorCrear()">{{ errorCrear() }}</div>
      </div>

      <!-- Cancelar -->
      <div class="actions">
        <button class="btn-cancelar" (click)="onCancelar()">Cancelar</button>
      </div>
    </div>
  `,
  styles: [`
    .buscar-cliente {
      background: var(--surface-card, #fff);
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 8px;
      padding: 1rem;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tab {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid var(--surface-border, #ddd);
      background: var(--surface-ground, #f5f5f5);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
    }

    .tab.active {
      background: var(--primary-color, #3b82f6);
      color: white;
      border-color: var(--primary-color, #3b82f6);
    }

    .campo-busqueda {
      margin-bottom: 1rem;
    }

    .campo-busqueda label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .input-busqueda {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      font-size: 0.9rem;
      box-sizing: border-box;
    }

    .resultados {
      max-height: 200px;
      overflow-y: auto;
    }

    .buscando,
    .sin-resultados {
      text-align: center;
      padding: 1rem;
      color: var(--text-color-secondary, #666);
    }

    .resultado-item {
      padding: 0.75rem;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .resultado-item:hover {
      background: var(--surface-hover, #f0f0f0);
      border-color: var(--primary-color, #3b82f6);
    }

    .resultado-item .nombre {
      font-weight: 500;
    }

    .resultado-item .telefono {
      margin-left: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .cliente-doc {
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
      margin-top: 0.25rem;
    }

    .crear-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .form-row {
      display: flex;
      gap: 0.75rem;
    }

    .form-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .form-group.full {
      flex: 1 1 100%;
    }

    .form-group label {
      font-size: 0.8rem;
      color: var(--text-color-secondary, #666);
    }

    .form-group input,
    .form-group select {
      padding: 0.5rem;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .form-actions {
      margin-top: 0.5rem;
    }

    .btn-crear {
      width: 100%;
      padding: 0.75rem;
      background: var(--primary-color, #3b82f6);
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
    }

    .btn-crear:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error-mensaje {
      color: #dc2626;
      font-size: 0.85rem;
      text-align: center;
      margin-top: 0.5rem;
    }

    .actions {
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--surface-border, #ddd);
    }

    .btn-cancelar {
      width: 100%;
      padding: 0.5rem;
      background: transparent;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      cursor: pointer;
    }
  `]
})
export class BuscarClienteComponent {
  @Output() clienteSeleccionado = new EventEmitter<Cliente>();
  @Output() cancelar = new EventEmitter<void>();

  private readonly clienteService = inject(ClienteService);
  private busqueda$ = new Subject<string>();

  modo = signal<'buscar' | 'crear'>('buscar');
  terminoBusqueda = '';
  buscando = signal(false);
  resultados = signal<Cliente[]>([]);
  creando = signal(false);
  errorCrear = signal<string | null>(null);

  nuevoCliente: Partial<CreateClienteCompletoDto> = {
    tipo_documento_id: 1,
    numero_documento: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    telefono: '',
    email: '',
    sobrenombre: ''
  };

  constructor() {
    this.busqueda$.pipe(debounceTime(300)).subscribe(termino => {
      this.realizarBusqueda(termino);
    });
  }

  cambiarModo(modo: 'buscar' | 'crear'): void {
    this.modo.set(modo);
    this.resultados.set([]);
    this.errorCrear.set(null);
  }

  onBuscar(termino: string): void {
    if (termino.length >= 3) {
      this.buscando.set(true);
      this.busqueda$.next(termino);
    } else {
      this.resultados.set([]);
    }
  }

  private realizarBusqueda(termino: string): void {
    this.clienteService.buscarClientes({ telefono: termino }).subscribe({
      next: (response) => {
        this.resultados.set(response.data);
        this.buscando.set(false);
      },
      error: () => {
        this.resultados.set([]);
        this.buscando.set(false);
      }
    });
  }

  seleccionar(cliente: Cliente): void {
    this.clienteSeleccionado.emit(cliente);
  }

  formularioValido(): boolean {
    return !!(
      this.nuevoCliente.primer_nombre &&
      this.nuevoCliente.primer_apellido &&
      this.nuevoCliente.numero_documento &&
      this.nuevoCliente.telefono
    );
  }

  crearCliente(): void {
    if (!this.formularioValido()) return;

    this.creando.set(true);
    this.errorCrear.set(null);

    this.clienteService.crearClienteCompleto(this.nuevoCliente as CreateClienteCompletoDto).subscribe({
      next: (response) => {
        this.creando.set(false);
        if (response.success) {
          this.clienteSeleccionado.emit(response.data);
        }
      },
      error: (error) => {
        this.creando.set(false);
        this.errorCrear.set(error?.error?.message ?? 'Error al crear el cliente');
      }
    });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}