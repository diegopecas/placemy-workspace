// apps/fronthouse/src/app/features/mesero/pages/tomar-pedido/tomar-pedido.component.ts
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
import { ThemeService } from '@placemy/shared/ui-components';

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
  templateUrl: './tomar-pedido.component.html',
  styleUrl: './tomar-pedido.component.scss'
})
export class TomarPedidoComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cuentaService = inject(CuentaService);
  private clienteService = inject(ClienteService);
  private menuService = inject(MenuService);
  private mesaService = inject(MesaService);
  private authService = inject(AuthService);
  private themeService = inject(ThemeService);

  // Signals de estado
  cargando = signal(true);
  guardando = signal(false);
  mesa = signal<Mesa | null>(null);
  cuenta = signal<Cuenta | null>(null);
  clienteSeleccionado = signal<Cliente | null>(null);
  mostrarBuscarCliente = signal(false);
  palabraSecreta = '';

  // Tema actual
  currentTheme = this.themeService.currentTheme;

  // Items del pedido
  itemsPedido = signal<ItemPedido[]>([]);

  // Alergias
  mostrarAlertaAlergia = signal(false);
  alergenosEnConflicto = signal<Alergeno[]>([]);
  itemConflictoNombre = signal('');
  itemPendienteAgregar: ItemPedido | null = null;

  // Catálogos
  estadosCuenta = signal<CuentaEstado[]>([]);
  estadosItem = signal<CuentaItemEstado[]>([]);
  tiposItem = signal<TipoItem[]>([]);

  // Computed - Menú
  categoriasComputed = computed((): CategoriaMenu[] => this.menuService.categorias());
  platosFiltradosComputed = computed((): PlatoMenu[] => this.menuService.platosFiltrados());
  productosFiltradosComputed = computed((): ProductoMenu[] => this.menuService.productosFiltrados());
  categoriaSeleccionadaComputed = computed((): number | null => this.menuService.categoriaSeleccionada());

  // Computed - Totales
  subtotal = computed(() => {
    return this.itemsPedido().reduce((sum, item) =>
      sum + (item.precioUnitario * item.cantidad), 0
    );
  });

  impuestos = computed(() => this.subtotal() * 0.08);
  descuentos = computed(() => 0);
  propina = computed(() => 0);
  total = computed(() =>
    this.subtotal() + this.impuestos() - this.descuentos() + this.propina()
  );

  // Computed - Items para display
  itemsPedidoDisplay = computed((): ItemPedidoDisplay[] => {
    return this.itemsPedido().map(item => ({
      id: item.id,
      tipo: item.tipo,
      plato: item.tipo === 'plato' ? item.plato as any : undefined,
      producto: item.tipo === 'producto' ? item.producto as any : undefined,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      notasEspeciales: item.notasEspeciales,
      estado: item.estado,
      tieneConflictoAlergia: item.tieneConflictoAlergia ?? false
    }));
  });

  cuentaEsModificable = computed(() => {
    const cuenta = this.cuenta();
    if (!cuenta) return true;
    const estado = cuenta.estado?.nombre?.toUpperCase() ?? '';
    return ['ABIERTA', 'PENDIENTE'].includes(estado);
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    // Limpiar estado del menu service si es necesario
  }

  private cargarDatos(): void {
    const mesaId = this.route.snapshot.paramMap.get('mesaId');
    const cuentaId = this.route.snapshot.paramMap.get('cuentaId');
    const modo = this.route.snapshot.paramMap.get('modo');

    if (!mesaId) {
      this.router.navigate(['/mesero']);
      return;
    }

    this.cargando.set(true);

    // Cargar mesa, catalogos y menu
    forkJoin({
      mesa: this.mesaService.getMesaById(+mesaId),
      catalogos: this.cuentaService.getCatalogos(),
      menu: this.menuService.cargarMenu(this.authService.getSelectedEstablecimiento()!.id)
    }).pipe(
      switchMap(({ mesa, catalogos, menu }) => {
        this.mesa.set(mesa.data);
        this.estadosCuenta.set(catalogos.data.estados_cuenta);
        this.estadosItem.set(catalogos.data.estados_item);
        this.tiposItem.set(catalogos.data.tipos_item);

        // Si hay cuentaId, cargar la cuenta
        if (cuentaId && modo === 'ver') {
          return forkJoin({
            cuenta: this.cuentaService.getCuentaById(+cuentaId),
            items: this.cuentaService.getItemsModificables(+cuentaId)
          });
        }

        return of(null);
      })
    ).subscribe({
      next: (cuentaData) => {
        if (cuentaData) {
          this.cuenta.set(cuentaData.cuenta.data);
          this.clienteSeleccionado.set(cuentaData.cuenta.data.cliente as any ?? null);

          // Convertir items de BD a ItemPedido
          this.itemsPedido.set(
            cuentaData.items.data.map(item => this.convertirCuentaItemAItemPedido(item))
          );
        }

        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error cargando datos:', error);
        this.cargando.set(false);
      }
    });
  }

  private convertirCuentaItemAItemPedido(item: any): ItemPedido {
    return {
      id: item.id,
      tipo: item.plato ? 'plato' : 'producto',
      plato: item.plato ? item.plato as any : undefined,
      producto: item.producto ? item.producto as any : undefined,
      cantidad: item.cantidad,
      precioUnitario: item.precio_unitario,
      notasEspeciales: item.notas_especiales ?? '',
      estado: item.estado
    };
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