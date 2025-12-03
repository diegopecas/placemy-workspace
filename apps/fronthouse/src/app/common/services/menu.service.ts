import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { PlatoMenu, CategoriaMenu } from '../models/establecimiento/plato.model';
import { ProductoMenu } from '../models/establecimiento/producto.model';
import { MenuCompleto, MenuCompletoResponse } from '../models/establecimiento/menu.model';
import { Alergeno, AlergenosResponse } from '../models/establecimiento/alergeno.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/establecimiento`;

  // ESTADO REACTIVO (Signals)
  private _menu = signal<MenuCompleto | null>(null);
  private _categoriaSeleccionada = signal<number | null>(null);
  private _terminoBusqueda = signal<string>('');

  readonly menu = this._menu.asReadonly();
  readonly categoriaSeleccionada = this._categoriaSeleccionada.asReadonly();
  readonly terminoBusqueda = this._terminoBusqueda.asReadonly();

  // COMPUTED
  readonly platos = computed(() => this._menu()?.platos ?? []);
  readonly productos = computed(() => this._menu()?.productos ?? []);

  readonly categorias = computed(() => {
    const platos = this.platos();
    const categoriasMap = new Map<number, CategoriaMenu>();
    
    platos.forEach(plato => {
      if (plato.categoria && !categoriasMap.has(plato.categoria.id)) {
        categoriasMap.set(plato.categoria.id, {
          id: plato.categoria.id,
          nombre: plato.categoria.nombre,
          establecimiento_id: 0,
          descripcion: null,
          orden: 0,
          activo: true
        });
      }
    });
    
    return Array.from(categoriasMap.values());
  });

  readonly platosFiltrados = computed(() => {
    let platos = this.platos();
    const categoriaId = this._categoriaSeleccionada();
    const termino = this._terminoBusqueda().toLowerCase();

    if (categoriaId !== null) {
      platos = platos.filter(p => p.categoria?.id === categoriaId);
    }

    if (termino) {
      platos = platos.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion?.toLowerCase().includes(termino) ?? false)
      );
    }

    return platos;
  });

  readonly productosFiltrados = computed(() => {
    let productos = this.productos();
    const termino = this._terminoBusqueda().toLowerCase();

    if (termino) {
      productos = productos.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        (p.descripcion?.toLowerCase().includes(termino) ?? false)
      );
    }

    return productos;
  });

  readonly menuCargado = computed(() => this._menu() !== null);

  // MÉTODOS
  cargarMenu(establecimientoId: number): Observable<MenuCompletoResponse> {
    return this.http.get<MenuCompletoResponse>(
      `${this.baseUrl}/establecimientos/${establecimientoId}/menu`
    ).pipe(
      tap(response => {
        if (response.success) {
          this._menu.set(response.data);
        }
      })
    );
  }

  limpiarMenu(): void {
    this._menu.set(null);
    this._categoriaSeleccionada.set(null);
    this._terminoBusqueda.set('');
  }

  seleccionarCategoria(categoriaId: number | null): void {
    this._categoriaSeleccionada.set(categoriaId);
  }

  buscar(termino: string): void {
    this._terminoBusqueda.set(termino);
  }

  limpiarFiltros(): void {
    this._categoriaSeleccionada.set(null);
    this._terminoBusqueda.set('');
  }

  getAlergenos(): Observable<AlergenosResponse> {
    return this.http.get<AlergenosResponse>(`${this.baseUrl}/catalogos/alergenos`);
  }

  getPlatoById(id: number): PlatoMenu | undefined {
    return this.platos().find(p => p.id === id);
  }

  getProductoById(id: number): ProductoMenu | undefined {
    return this.productos().find(p => p.id === id);
  }

  platoTieneAlergeno(platoId: number, alergenoId: number): boolean {
    const plato = this.getPlatoById(platoId);
    return plato?.alergenos?.some(a => a.id === alergenoId) ?? false;
  }

  getAlergenosPlato(platoId: number): Alergeno[] {
    const plato = this.getPlatoById(platoId);
    return plato?.alergenos?.map(a => ({
      id: a.id,
      nombre: a.nombre,
      icono: a.icono ?? null,
      descripcion: null
    })) ?? [];
  }
}