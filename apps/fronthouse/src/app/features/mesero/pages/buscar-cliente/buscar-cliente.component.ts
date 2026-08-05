// apps/fronthouse/src/app/features/mesero/pages/buscar-cliente/buscar-cliente.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, Subject } from 'rxjs';

import { ClienteService } from '../../../../common/services/cliente.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService } from '@placemy/shared/ui-components';
import { 
  Cliente, 
  CreateClienteDirectoDto, 
  getClienteNombre,
  getClienteTelefono,
  getClienteDocumento
} from '../../../../common/models/cliente/cliente.model';

type ModoPage = 'buscar' | 'crear';

@Component({
  selector: 'app-buscar-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-cliente.component.html',
  styleUrl: './buscar-cliente.component.scss'
})
export class BuscarClienteComponent implements OnInit {
  private readonly clienteService = inject(ClienteService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly themeService = inject(ThemeService);
  private busqueda$ = new Subject<string>();

  // Tema
  currentTheme = this.themeService.currentTheme;

  // Estado
  modo = signal<ModoPage>('buscar');
  
  // Navegación (para volver)
  returnTo = signal<string>('/mesero');
  mesaId = signal<string | null>(null);

  // BUSCAR
  terminoBusqueda = '';
  buscando = signal(false);
  resultados = signal<Cliente[]>([]);

  // CREAR
  creando = signal(false);
  errorCrear = signal<string | null>(null);
  nuevoCliente: Partial<CreateClienteDirectoDto> = {
    nombre: '',
    telefono: '',
    numero_documento: '',
    tipo_documento_id: 1,
    email: '',
    sexo: undefined,
    sobrenombre: ''
  };

  constructor() {
    console.log('🟢 BuscarCliente - Constructor');
    
    this.busqueda$.pipe(debounceTime(300)).subscribe(termino => {
      this.realizarBusqueda(termino);
    });
  }

  ngOnInit(): void {
    console.log('🟢 BuscarCliente - ngOnInit');
    
    // Leer query params para saber a dónde volver
    const returnTo = this.route.snapshot.queryParams['returnTo'];
    const mesaId = this.route.snapshot.queryParams['mesaId'];
    
    if (returnTo) {
      this.returnTo.set(returnTo);
    }
    if (mesaId) {
      this.mesaId.set(mesaId);
    }
    
    console.log('📋 Return to:', this.returnTo());
    console.log('📋 Mesa ID:', this.mesaId());

    // Verificar establecimiento
    const establecimiento = this.authService.getSelectedEstablecimiento();
    if (!establecimiento) {
      console.error('❌ No hay establecimiento seleccionado');
      this.errorCrear.set('No hay establecimiento seleccionado');
    }
  }

  // ========================================
  // NAVEGACIÓN
  // ========================================

  volver(): void {
    console.log('🔙 Volviendo a:', this.returnTo());
    
    const mesaId = this.mesaId();
    if (mesaId) {
      this.router.navigate(['/mesero/crear-cuenta', mesaId]);
    } else {
      this.router.navigate(['/mesero']);
    }
  }

  cambiarModo(nuevoModo: ModoPage): void {
    this.modo.set(nuevoModo);
    this.resultados.set([]);
    this.errorCrear.set(null);
  }

  // ========================================
  // BUSCAR
  // ========================================

  onBuscar(termino: string): void {
    if (termino.length >= 3) {
      this.buscando.set(true);
      this.busqueda$.next(termino);
    } else {
      this.resultados.set([]);
    }
  }

  private realizarBusqueda(termino: string): void {
    console.log('🔍 Buscando:', termino);
    
    this.clienteService.buscarClientes({ telefono: termino }).subscribe({
      next: (response) => {
        console.log('✅ Resultados:', response.data.length);
        this.resultados.set(response.data);
        this.buscando.set(false);
      },
      error: (error) => {
        console.error('❌ Error buscando:', error);
        this.resultados.set([]);
        this.buscando.set(false);
      }
    });
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.resultados.set([]);
  }

  seleccionarCliente(cliente: Cliente): void {
    console.log('✅ Cliente seleccionado:', cliente);
    
    // Guardar en signal compartido
    this.clienteService.setClienteTemp(cliente);
    
    // Volver a crear-cuenta
    this.volver();
  }

  // Helpers para template
  getClienteNombre = getClienteNombre;
  getClienteTelefono = getClienteTelefono;
  getClienteDocumento = getClienteDocumento;

  // ========================================
  // CREAR
  // ========================================

  formularioValido(): boolean {
    return !!(
      this.nuevoCliente.nombre?.trim() &&
      this.nuevoCliente.telefono?.trim()
    );
  }

  crearCliente(): void {
    if (!this.formularioValido()) {
      this.errorCrear.set('Nombre y teléfono son obligatorios');
      return;
    }

    const establecimiento = this.authService.getSelectedEstablecimiento();
    if (!establecimiento) {
      this.errorCrear.set('No hay establecimiento seleccionado');
      return;
    }

    this.creando.set(true);
    this.errorCrear.set(null);

    const clienteDto: CreateClienteDirectoDto = {
      nombre: this.nuevoCliente.nombre!.trim(),
      telefono: this.nuevoCliente.telefono!.trim(),
      numero_documento: this.nuevoCliente.numero_documento?.trim() || undefined,
      tipo_documento_id: this.nuevoCliente.tipo_documento_id,
      email: this.nuevoCliente.email?.trim() || undefined,
      sexo: this.nuevoCliente.sexo,
      sobrenombre: this.nuevoCliente.sobrenombre?.trim() || undefined
    };

    console.log('🟢 Creando cliente:', clienteDto);

    this.clienteService.crearClienteDirecto(clienteDto).subscribe({
      next: (response) => {
        this.creando.set(false);
        if (response.success) {
          console.log('✅ Cliente creado:', response.data);
          
          // Guardar en signal compartido
          this.clienteService.setClienteTemp(response.data);
          
          // Volver a crear-cuenta
          this.volver();
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

  usarSinCliente(): void {
    console.log('📋 Continuar sin cliente');
    
    // Limpiar signal
    this.clienteService.clearClienteTemp();
    
    // Volver a crear-cuenta
    this.volver();
  }
}