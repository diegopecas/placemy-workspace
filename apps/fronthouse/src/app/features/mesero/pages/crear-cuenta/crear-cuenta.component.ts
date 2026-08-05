// apps/fronthouse/src/app/features/mesero/pages/crear-cuenta/crear-cuenta.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ThemeService } from '@placemy/shared/ui-components';
import { ClienteService } from '../../../../common/services/cliente.service';
import { 
  Cliente, 
  getClienteNombre, 
  getClienteTelefono,
  getClienteDocumento 
} from '../../../../common/models/cliente/cliente.model';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private clienteService = inject(ClienteService);

  // Tema actual
  currentTheme = this.themeService.currentTheme;
  
  // Datos básicos
  mesaId = signal<string | null>(null);
  
  // Cliente
  clienteSeleccionado = signal<Cliente | null>(null);
  
  // Items del pedido
  items = signal<any[]>([]);
  
  // Totales
  subtotal = signal<number>(0);
  propina = signal<number>(0);
  total = signal<number>(0);

  // Helpers para template
  getClienteNombre = getClienteNombre;
  getClienteTelefono = getClienteTelefono;
  getClienteDocumento = getClienteDocumento;

  constructor() {
    console.log('🟢 CrearCuenta - Constructor');
  }

  ngOnInit(): void {
    console.log('🟢 CrearCuenta - ngOnInit');
    
    const id = this.route.snapshot.paramMap.get('mesaId');
    this.mesaId.set(id);
    
    console.log('📋 Mesa ID recibido:', id);

    // ========================================
    // LEER CLIENTE DEL SIGNAL COMPARTIDO
    // ========================================
    const clienteTemp = this.clienteService.getClienteTemp();
    if (clienteTemp) {
      console.log('✅ Cliente recibido del signal:', clienteTemp);
      this.clienteSeleccionado.set(clienteTemp);
      
      // Limpiar signal después de usarlo
      this.clienteService.clearClienteTemp();
    }
  }

  volver(): void {
    console.log('🔙 Volviendo a mesero dashboard');
    this.router.navigate(['/mesero']);
  }

  // ========================================
  // CLIENTE
  // ========================================

  irABuscarCliente(): void {
    console.log('🔍 Ir a buscar cliente');
    const mesaId = this.mesaId();
    this.router.navigate(['/mesero/buscar-cliente'], {
      queryParams: { 
        returnTo: 'crear-cuenta',
        mesaId: mesaId 
      }
    });
  }

  cambiarCliente(): void {
    console.log('🔄 Cambiar cliente');
    this.irABuscarCliente();
  }

  quitarCliente(): void {
    console.log('❌ Quitar cliente');
    this.clienteSeleccionado.set(null);
    this.clienteService.clearClienteTemp();
  }

  // ========================================
  // ITEMS
  // ========================================

  agregarItem(): void {
    console.log('➕ Agregar item');
    // TODO: Abrir modal de menú
  }

  eliminarItem(index: number): void {
    const itemsActuales = this.items();
    itemsActuales.splice(index, 1);
    this.items.set([...itemsActuales]);
    this.calcularTotales();
  }

  // ========================================
  // TOTALES
  // ========================================

  calcularTotales(): void {
    const itemsActuales = this.items();
    const subtotal = itemsActuales.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    this.subtotal.set(subtotal);
    this.total.set(subtotal + this.propina());
  }

  // ========================================
  // ACCIONES
  // ========================================

  guardarCuenta(): void {
    console.log('💾 Guardar cuenta');
    // TODO: Implementar guardado
  }

  cancelar(): void {
    if (confirm('¿Seguro que deseas cancelar? Se perderán los cambios.')) {
      this.volver();
    }
  }
}