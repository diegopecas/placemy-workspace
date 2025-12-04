// apps/fronthouse/src/app/features/mesero/components/buscar-cliente/buscar-cliente.component.ts
import { Component, Output, EventEmitter, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClienteService } from '../../../../common/services/cliente.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Cliente, CreateClienteCompletoDto, ClientesListResponse } from '../../../../common/models/cliente/cliente.model';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-buscar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.scss'
})
export class BuscarClienteComponent implements OnInit {
  @Output() clienteSeleccionado = new EventEmitter<Cliente>();
  @Output() cancelar = new EventEmitter<void>();

  private readonly clienteService = inject(ClienteService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
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

  ngOnInit(): void {
    // ✅ VERIFICAR que haya un establecimiento seleccionado
    const establecimiento = this.authService.getSelectedEstablecimiento();
    
    if (!establecimiento) {
      console.error('❌ No hay establecimiento seleccionado');
      this.errorCrear.set('No hay establecimiento seleccionado. Por favor, seleccione uno.');
    } else {
      console.log('✅ Establecimiento cargado:', establecimiento.nombre, '(ID:', establecimiento.id + ')');
    }
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

    // ✅ OBTENER ESTABLECIMIENTO DEL AUTHSERVICE (lee del localStorage)
    const establecimiento = this.authService.getSelectedEstablecimiento();
    
    if (!establecimiento) {
      this.errorCrear.set('No hay establecimiento seleccionado');
      console.error('❌ No se puede crear cliente sin establecimiento seleccionado');
      return;
    }

    this.creando.set(true);
    this.errorCrear.set(null);

    // ✅ AGREGAR establecimiento_id AL DTO
    const clienteDto: CreateClienteCompletoDto = {
      establecimiento_id: establecimiento.id,  // ✅ Del localStorage vía AuthService
      tipo_documento_id: this.nuevoCliente.tipo_documento_id!,
      numero_documento: this.nuevoCliente.numero_documento!,
      primer_nombre: this.nuevoCliente.primer_nombre!,
      segundo_nombre: this.nuevoCliente.segundo_nombre,
      primer_apellido: this.nuevoCliente.primer_apellido!,
      segundo_apellido: this.nuevoCliente.segundo_apellido,
      telefono: this.nuevoCliente.telefono!,
      email: this.nuevoCliente.email,
      sobrenombre: this.nuevoCliente.sobrenombre
    };

    console.log('🟢 Creando cliente con establecimiento_id:', establecimiento.id);

    this.clienteService.crearClienteCompleto(clienteDto).subscribe({
      next: (response) => {
        this.creando.set(false);
        if (response.success) {
          console.log('✅ Cliente creado exitosamente:', response.data);
          this.clienteSeleccionado.emit(response.data);
        }
      },
      error: (error) => {
        this.creando.set(false);
        const mensajeError = error?.error?.message ?? 'Error al crear el cliente';
        console.error('❌ Error al crear cliente:', error);
        this.errorCrear.set(mensajeError);
      }
    });
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}