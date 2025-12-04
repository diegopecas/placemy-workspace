// apps/fronthouse/src/app/features/mesero/components/menu-selector/menu-selector.component.ts
import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlatoMenu, CategoriaMenu } from '../../../../common/models/establecimiento/plato.model';
import { ProductoMenu } from '../../../../common/models/establecimiento/producto.model';
import { Alergeno } from '../../../../common/models/establecimiento/alergeno.model';
import { ThemeService } from '@placemy/shared/ui-components';

@Component({
  selector: 'app-menu-selector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu-selector.component.html',
  styleUrl: './menu-selector.component.scss'
})
export class MenuSelectorComponent implements OnChanges {
  private themeService = inject(ThemeService);

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

  // Tema actual
  currentTheme = this.themeService.currentTheme;

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

  cambiarVista(vista: 'platos' | 'productos'): void {
    this.vista = vista;
  }
}