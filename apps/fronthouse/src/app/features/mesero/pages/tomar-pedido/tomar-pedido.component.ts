import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Services
import { CuentaService } from '../../../../common/services/cuenta.service';
import { ClienteService } from '../../../../common/services/cliente.service';
import { MenuService } from '../../../../common/services/menu.service';
import { MesaService } from '../../../../common/services/mesa.service';
import { AuthService } from '../../../../core/services/auth.service';

// Models
import { Cuenta, CreateCuentaDto, CuentaEstado, CuentaResponse } from '../../../../common/models/cuenta/cuenta.model';
import { CuentaItem, CuentaItemEstado, TipoItem, CreateCuentaItemDto, CuentaItemResponse } from '../../../../common/models/cuenta/cuenta-item.model';
import { Cliente, ClienteResponse } from '../../../../common/models/cliente/cliente.model';
import { PlatoMenu, CategoriaMenu } from '../../../../common/models/establecimiento/plato.model';
import { ProductoMenu } from '../../../../common/models/establecimiento/producto.model';
import { Mesa, MesaResponse } from '../../../../common/models/establecimiento/mesa.model';
import { Alergeno } from '../../../../common/models/establecimiento/alergeno.model';
import { MenuCompletoResponse } from '../../../../common/models/establecimiento/menu.model';

// Components
import { BuscarClienteComponent } from '../../components/buscar-cliente/buscar-cliente.component';
import { MenuSelectorComponent } from '../../components/menu-selector/menu-selector.component';
import { ItemsListComponent, ItemPedidoDisplay } from '../../components/items-list/items-list.component';
import { ResumenCuentaComponent } from '../../components/resumen-cuenta/resumen-cuenta.component';
import { AlertaAlergiaComponent } from '../../components/alerta-alergia/alerta-alergia.component';

export interface ItemPedido {
  id?: number;
  tipo: 'plato' | 'producto';
  plato?: PlatoMenu;
  producto?: ProductoMenu;
  cantidad: number;
  precioUnitario: number;
  notasEspeciales: string;
  estado?: CuentaItemEstado;
  tieneConflictoAlergia?: boolean;
  alergenosConflicto?: Alergeno[];
}

interface CuentaCatalogos {
  estados_cuenta: CuentaEstado[];
  estados_item: CuentaItemEstado[];
  tipos_item: TipoItem[];
}

interface CatalogosResponse {
  success: boolean;
  data: CuentaCatalogos;
  message?: string;
}

@Component({
  selector: 'app-tomar-pedido',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    BuscarClienteComponent,
    MenuSelectorComponent,
    ItemsListComponent,
    ResumenCuentaComponent,
    AlertaAlergiaComponent
  ],
  template: `
    <div class="tomar-pedido-container">
      <!-- Header -->
      <header class="pedido-header">
        <button class="btn-volver" (click)="volver()">← Volver</button>
        <div class="header-info">
          <h1>Mesa {{ mesa()?.numero_mesa }}</h1>
          <span class="cuenta-numero" *ngIf="cuenta()">{{ cuenta()?.numero_cuenta }}</span>
        </div>
        <div class="header-estado">
          <span 
            class="estado-badge" 
            *ngIf="cuenta()" 
            [style.background-color]="cuenta()?.estado?.color ?? '#3b82f6'">
            {{ cuenta()?.estado?.nombre ?? 'ABIERTA' }}
          </span>
        </div>
      </header>

      <!-- Loading -->
      <div class="loading-overlay" *ngIf="cargando()">
        <div class="loading-content">
          <span class="loading-spinner"></span>
          <p>Cargando...</p>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="pedido-content" *ngIf="!cargando()">
        <!-- Panel izquierdo -->
        <div class="panel-izquierdo">
          <!-- Sección Cliente -->
          <section class="seccion-cliente">
            <div class="seccion-header">
              <h2>Cliente</h2>
              <button 
                class="btn-link" 
                *ngIf="!clienteSeleccionado()" 
                (click)="toggleBuscarCliente()">
                {{ mostrarBuscarCliente() ? 'Cancelar' : 'Buscar/Agregar' }}
              </button>
              <button 
                class="btn-link" 
                *ngIf="clienteSeleccionado()" 
                (click)="quitarCliente()">
                Cambiar
              </button>
            </div>

            <!-- Cliente seleccionado -->
            <div class="cliente-info" *ngIf="clienteSeleccionado()">
              <div class="cliente-nombre">
                {{ clienteSeleccionado()?.persona?.nombre_completo ?? clienteSeleccionado()?.sobrenombre ?? 'Cliente' }}
              </div>
              <div class="cliente-telefono" *ngIf="clienteSeleccionado()?.persona?.telefono">
                📱 {{ clienteSeleccionado()?.persona?.telefono }}
              </div>
              <div class="cliente-alergenos" *ngIf="clienteSeleccionado()?.alergenos?.length">
                <span class="alergenos-label">⚠️ Alergias:</span>
                <span class="alergeno-tag" *ngFor="let alergeno of clienteSeleccionado()?.alergenos">
                  {{ alergeno.nombre }}
                </span>
              </div>
            </div>

            <!-- Sin cliente -->
            <div class="sin-cliente" *ngIf="!clienteSeleccionado() && !mostrarBuscarCliente()">
              <p>Cuenta anónima</p>
            </div>

            <!-- Buscar cliente -->
            <app-buscar-cliente 
              *ngIf="mostrarBuscarCliente()" 
              (clienteSeleccionado)="onClienteSeleccionado($event)" 
              (cancelar)="toggleBuscarCliente()">
            </app-buscar-cliente>
          </section>

          <!-- Palabra secreta -->
          <section class="seccion-palabra" *ngIf="!cuenta()">
            <label for="palabraSecreta">Palabra Secreta</label>
            <input 
              type="text" 
              id="palabraSecreta" 
              [(ngModel)]="palabraSecreta" 
              placeholder="Ej: mesa123" 
              class="input-palabra">
            <small>El cliente usará esta palabra para acceder a su cuenta online</small>
          </section>

          <!-- Items del pedido -->
          <section class="seccion-items">
            <div class="seccion-header">
              <h2>Pedido</h2>
              <span class="items-count">{{ itemsPedido().length }} items</span>
            </div>

            <app-items-list 
              [items]="itemsPedidoDisplay()" 
              [editando]="!cuenta() || cuentaEsModificable()" 
              (eliminarItem)="onEliminarItem($event)" 
              (actualizarCantidad)="onActualizarCantidad($event)" 
              (actualizarNotas)="onActualizarNotas($event)">
            </app-items-list>
          </section>
        </div>

        <!-- Panel derecho -->
        <div class="panel-derecho">
          <app-menu-selector 
            [categorias]="categoriasComputed()" 
            [platos]="platosFiltradosComputed()" 
            [productos]="productosFiltradosComputed()" 
            [categoriaSeleccionada]="categoriaSeleccionadaComputed()" 
            [clienteAlergenos]="clienteSeleccionado()?.alergenos ?? []" 
            (seleccionarCategoria)="onSeleccionarCategoria($event)" 
            (buscar)="onBuscarMenu($event)" 
            (agregarPlato)="onAgregarPlato($event)" 
            (agregarProducto)="onAgregarProducto($event)">
          </app-menu-selector>
        </div>
      </div>

      <!-- Footer -->
      <footer class="pedido-footer" *ngIf="!cargando()">
        <app-resumen-cuenta 
          [subtotal]="subtotal()" 
          [impuestos]="impuestos()" 
          [descuentos]="descuentos()" 
          [propina]="propina()" 
          [total]="total()" 
          [cuentaCreada]="!!cuenta()" 
          [guardando]="guardando()" 
          (crearCuenta)="onCrearCuenta()" 
          (guardarCambios)="onGuardarCambios()">
        </app-resumen-cuenta>
      </footer>

      <!-- Modal alerta alergia -->
      <app-alerta-alergia 
        *ngIf="mostrarAlertaAlergia()" 
        [alergenos]="alergenosEnConflicto()" 
        [nombreItem]="itemConflictoNombre()" 
        (continuar)="onConfirmarAgregarConAlergia()" 
        (cancelar)="onCancelarAgregarConAlergia()">
      </app-alerta-alergia>
    </div>
  `,
  styles: [`
    .tomar-pedido-container {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--surface-ground, #f5f5f5);
    }

    .pedido-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: var(--surface-card, #fff);
      border-bottom: 1px solid var(--surface-border, #ddd);
    }

    .btn-volver {
      padding: 0.5rem 1rem;
      background: transparent;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .header-info {
      flex: 1;
    }

    .header-info h1 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
    }

    .cuenta-numero {
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .estado-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 500;
      color: white;
      text-transform: uppercase;
    }

    .loading-overlay {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .loading-content {
      text-align: center;
    }

    .loading-spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid var(--surface-border, #ddd);
      border-top-color: var(--primary-color, #3b82f6);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .pedido-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .panel-izquierdo {
      flex: 0 0 400px;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      border-right: 1px solid var(--surface-border, #ddd);
      background: var(--surface-card, #fff);
    }

    .panel-derecho {
      flex: 1;
      overflow-y: auto;
    }

    section {
      padding: 1rem;
      border-bottom: 1px solid var(--surface-border, #ddd);
    }

    .seccion-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .seccion-header h2 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .btn-link {
      background: none;
      border: none;
      color: var(--primary-color, #3b82f6);
      cursor: pointer;
      font-size: 0.85rem;
    }

    .cliente-info {
      background: var(--surface-hover, #f8f9fa);
      padding: 0.75rem;
      border-radius: 8px;
    }

    .cliente-nombre {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .cliente-telefono {
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
      margin-bottom: 0.5rem;
    }

    .cliente-alergenos {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      align-items: center;
    }

    .alergenos-label {
      font-size: 0.8rem;
      color: #b45309;
    }

    .alergeno-tag {
      background: #fef3c7;
      color: #b45309;
      padding: 0.125rem 0.5rem;
      border-radius: 10px;
      font-size: 0.75rem;
    }

    .sin-cliente {
      color: var(--text-color-secondary, #666);
      font-size: 0.9rem;
      padding: 0.5rem 0;
    }

    .seccion-palabra {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .seccion-palabra label {
      font-weight: 500;
      font-size: 0.9rem;
    }

    .input-palabra {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--surface-border, #ddd);
      border-radius: 6px;
      font-size: 0.9rem;
    }

    .seccion-palabra small {
      color: var(--text-color-secondary, #666);
      font-size: 0.8rem;
    }

    .seccion-items {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 200px;
    }

    .items-count {
      font-size: 0.85rem;
      color: var(--text-color-secondary, #666);
    }

    .pedido-footer {
      background: var(--surface-card, #fff);
      border-top: 1px solid var(--surface-border, #ddd);
      padding: 1rem;
    }
  `]
})
export class TomarPedidoComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly mesaService = inject(MesaService);
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);

  // Estado
  cargando = signal(true);
  guardando = signal(false);
  mesa = signal<Mesa | null>(null);
  cuenta = signal<Cuenta | null>(null);
  clienteSeleccionado = signal<Cliente | null>(null);
  itemsPedido = signal<ItemPedido[]>([]);
  palabraSecreta = '';

  // UI State
  mostrarBuscarCliente = signal(false);
  mostrarAlertaAlergia = signal(false);
  alergenosEnConflicto = signal<Alergeno[]>([]);
  itemConflictoNombre = signal('');
  private itemPendienteAgregar: ItemPedido | null = null;

  // Catálogos
  estadosCuenta = signal<CuentaEstado[]>([]);
  estadosItem = signal<CuentaItemEstado[]>([]);
  tiposItem = signal<TipoItem[]>([]);

  // Computed wrapeados para evitar unknown en template
  categoriasComputed = computed((): CategoriaMenu[] => this.menuService.categorias());
  platosFiltradosComputed = computed((): PlatoMenu[] => this.menuService.platosFiltrados());
  productosFiltradosComputed = computed((): ProductoMenu[] => this.menuService.productosFiltrados());
  categoriaSeleccionadaComputed = computed((): number | null => this.menuService.categoriaSeleccionada());

  // Items para display
  itemsPedidoDisplay = computed((): ItemPedidoDisplay[] => {
    return this.itemsPedido().map(item => ({
      id: item.id,
      tipo: item.tipo,
      plato: item.plato ? { id: item.plato.id, nombre: item.plato.nombre, foto_url: item.plato.foto_url } : undefined,
      producto: item.producto ? { id: item.producto.id, nombre: item.producto.nombre, foto_url: item.producto.foto_url } : undefined,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      notasEspeciales: item.notasEspeciales,
      estado: item.estado,
      tieneConflictoAlergia: item.tieneConflictoAlergia
    }));
  });

  // Computed
  cuentaEsModificable = computed(() => {
    const estado = this.cuenta()?.estado?.nombre?.toUpperCase();
    return estado === 'ABIERTA';
  });

  subtotal = computed(() => {
    return this.itemsPedido().reduce((sum, item) => {
      return sum + (item.precioUnitario * item.cantidad);
    }, 0);
  });

  impuestos = computed(() => {
    return this.subtotal() * 0.08;
  });

  descuentos = computed(() => 0);
  propina = computed(() => 0);

  total = computed(() => {
    return this.subtotal() + this.impuestos() - this.descuentos() + this.propina();
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.menuService.limpiarMenu();
  }

  private cargarDatos(): void {
    const mesaId = Number(this.route.snapshot.paramMap.get('mesaId'));
    const cuentaId = this.route.snapshot.paramMap.get('cuentaId');
    const establecimiento = this.authService.getSelectedEstablecimiento();

    if (!establecimiento || !mesaId) {
      this.router.navigate(['/mesero']);
      return;
    }

    this.cargando.set(true);

    forkJoin({
      mesa: this.mesaService.getMesaById(mesaId),
      menu: this.menuService.cargarMenu(establecimiento.id),
      catalogos: this.cuentaService.getCatalogos()
    }).pipe(
      switchMap(({ mesa, catalogos }: { mesa: MesaResponse; menu: MenuCompletoResponse; catalogos: CatalogosResponse }) => {
        this.mesa.set(mesa.data);

        if (catalogos.success) {
          this.estadosCuenta.set(catalogos.data.estados_cuenta);
          this.estadosItem.set(catalogos.data.estados_item);
          this.tiposItem.set(catalogos.data.tipos_item);
        }

        if (cuentaId) {
          return this.cuentaService.getCuentaById(Number(cuentaId));
        }

        return of(null);
      })
    ).subscribe({
      next: (cuentaResponse: CuentaResponse | null) => {
        if (cuentaResponse?.data) {
          this.cargarCuentaExistente(cuentaResponse.data);
        }
        this.cargando.set(false);
      },
      error: (error: unknown) => {
        console.error('Error cargando datos:', error);
        this.cargando.set(false);
      }
    });
  }

  private cargarCuentaExistente(cuenta: Cuenta): void {
    this.cuenta.set(cuenta);

    if (cuenta.cliente_id) {
      this.clienteService.getClienteById(cuenta.cliente_id).subscribe({
        next: (response: ClienteResponse) => {
          if (response.success) {
            this.clienteSeleccionado.set(response.data);
          }
        }
      });
    }

    if (cuenta.items?.length) {
      const items: ItemPedido[] = cuenta.items.map((item: CuentaItem) => ({
        id: item.id,
        tipo: item.plato_id ? 'plato' as const : 'producto' as const,
        plato: item.plato_id ? this.menuService.getPlatoById(item.plato_id) : undefined,
        producto: item.producto_id ? this.menuService.getProductoById(item.producto_id) : undefined,
        cantidad: item.cantidad,
        precioUnitario: item.precio_unitario,
        notasEspeciales: item.notas_especiales ?? '',
        estado: item.estado
      }));

      this.itemsPedido.set(items);
    }
  }

  // Navegación
  volver(): void {
    this.router.navigate(['/mesero']);
  }

  // Cliente
  toggleBuscarCliente(): void {
    this.mostrarBuscarCliente.update(v => !v);
  }

  onClienteSeleccionado(cliente: Cliente): void {
    this.clienteSeleccionado.set(cliente);
    this.mostrarBuscarCliente.set(false);
  }

  quitarCliente(): void {
    this.clienteSeleccionado.set(null);
  }

  // Menu Service wrappers
  onSeleccionarCategoria(categoriaId: number | null): void {
    this.menuService.seleccionarCategoria(categoriaId);
  }

  onBuscarMenu(termino: string): void {
    this.menuService.buscar(termino);
  }

  // Agregar items
  onAgregarPlato(plato: PlatoMenu): void {
    const clienteAlergenos = this.clienteSeleccionado()?.alergenos ?? [];
    const conflictos = this.clienteService.verificarAlergias(clienteAlergenos, plato.alergenos);

    const item: ItemPedido = {
      tipo: 'plato',
      plato,
      cantidad: 1,
      precioUnitario: plato.precio,
      notasEspeciales: '',
      tieneConflictoAlergia: conflictos.length > 0,
      alergenosConflicto: conflictos
    };

    if (conflictos.length > 0) {
      this.itemPendienteAgregar = item;
      this.alergenosEnConflicto.set(conflictos);
      this.itemConflictoNombre.set(plato.nombre);
      this.mostrarAlertaAlergia.set(true);
    } else {
      this.agregarItem(item);
    }
  }

  onAgregarProducto(producto: ProductoMenu): void {
    const item: ItemPedido = {
      tipo: 'producto',
      producto,
      cantidad: 1,
      precioUnitario: producto.precio_individual,
      notasEspeciales: ''
    };

    this.agregarItem(item);
  }

  private agregarItem(item: ItemPedido): void {
    const items = this.itemsPedido();
    const existente = items.find(i =>
      (i.tipo === 'plato' && i.plato?.id === item.plato?.id) ||
      (i.tipo === 'producto' && i.producto?.id === item.producto?.id)
    );

    if (existente && !existente.id) {
      existente.cantidad += 1;
      this.itemsPedido.set([...items]);
    } else {
      this.itemsPedido.update(items => [...items, item]);
    }
  }

  // Alerta alergia
  onConfirmarAgregarConAlergia(): void {
    if (this.itemPendienteAgregar) {
      this.agregarItem(this.itemPendienteAgregar);
      this.itemPendienteAgregar = null;
    }
    this.mostrarAlertaAlergia.set(false);
    this.alergenosEnConflicto.set([]);
  }

  onCancelarAgregarConAlergia(): void {
    this.itemPendienteAgregar = null;
    this.mostrarAlertaAlergia.set(false);
    this.alergenosEnConflicto.set([]);
  }

  // Modificar items
  onEliminarItem(index: number): void {
    this.itemsPedido.update(items => items.filter((_, i) => i !== index));
  }

  onActualizarCantidad(event: { index: number; cantidad: number }): void {
    this.itemsPedido.update(items => {
      const newItems = [...items];
      if (event.cantidad <= 0) {
        newItems.splice(event.index, 1);
      } else {
        newItems[event.index] = { ...newItems[event.index], cantidad: event.cantidad };
      }
      return newItems;
    });
  }

  onActualizarNotas(event: { index: number; notas: string }): void {
    this.itemsPedido.update(items => {
      const newItems = [...items];
      newItems[event.index] = { ...newItems[event.index], notasEspeciales: event.notas };
      return newItems;
    });
  }

  // Guardar
  onCrearCuenta(): void {
    const establecimiento = this.authService.getSelectedEstablecimiento();
    const mesa = this.mesa();

    if (!establecimiento || !mesa) return;

    const estadoAbierta = this.estadosCuenta().find(e =>
      e.nombre.toUpperCase() === 'ABIERTA'
    );

    if (!estadoAbierta) {
      console.error('No se encontró el estado ABIERTA');
      return;
    }

    const staffId = 1; // TODO: Obtener del usuario actual

    const nuevaCuenta: CreateCuentaDto = {
      establecimiento_id: establecimiento.id,
      mesa_id: mesa.id,
      establecimiento_staff_id: staffId,
      estado_id: estadoAbierta.id,
      cliente_id: this.clienteSeleccionado()?.id ?? null,
      palabra_secreta: this.palabraSecreta || undefined
    };

    this.guardando.set(true);

    this.cuentaService.crearCuenta(nuevaCuenta).subscribe({
      next: (response: CuentaResponse) => {
        if (response.success) {
          this.cuenta.set(response.data);
          this.guardarItems(response.data.id);
        }
      },
      error: (error: unknown) => {
        console.error('Error creando cuenta:', error);
        this.guardando.set(false);
      }
    });
  }

  onGuardarCambios(): void {
    const cuenta = this.cuenta();
    if (!cuenta) return;

    this.guardarItems(cuenta.id);
  }

  private guardarItems(cuentaId: number): void {
    const items = this.itemsPedido();
    const itemsNuevos = items.filter(i => !i.id);

    if (itemsNuevos.length === 0) {
      this.guardando.set(false);
      return;
    }

    const tipoPlato = this.tiposItem().find(t => t.nombre.toUpperCase() === 'PLATO');
    const tipoProducto = this.tiposItem().find(t => t.nombre.toUpperCase() === 'PRODUCTO');
    const estadoPendiente = this.estadosItem().find(e => e.nombre.toUpperCase() === 'PENDIENTE');

    if (!estadoPendiente) {
      console.error('No se encontró estado PENDIENTE');
      this.guardando.set(false);
      return;
    }

    const requests = itemsNuevos.map(item => {
      const createDto: CreateCuentaItemDto = {
        cuenta_id: cuentaId,
        tipo_item_id: item.tipo === 'plato' ? tipoPlato!.id : tipoProducto!.id,
        plato_id: item.plato?.id ?? null,
        producto_id: item.producto?.id ?? null,
        estado_id: estadoPendiente.id,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
        notas_especiales: item.notasEspeciales || null
      };

      return this.cuentaService.agregarItem(createDto);
    });

    forkJoin(requests).subscribe({
      next: (responses: CuentaItemResponse[]) => {
        const itemsActualizados = [...this.itemsPedido()];
        let responseIndex = 0;

        for (let i = 0; i < itemsActualizados.length; i++) {
          if (!itemsActualizados[i].id && responses[responseIndex]) {
            itemsActualizados[i] = {
              ...itemsActualizados[i],
              id: responses[responseIndex].data.id
            };
            responseIndex++;
          }
        }

        this.itemsPedido.set(itemsActualizados);
        this.guardando.set(false);

        this.cuentaService.calcularTotales(cuentaId).subscribe();
      },
      error: (error: unknown) => {
        console.error('Error guardando items:', error);
        this.guardando.set(false);
      }
    });
  }
}