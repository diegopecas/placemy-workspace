import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import {
  Mesa,
  EstadoMesa,
  ZonaEstablecimiento,
  MesaConEstado,
  MesasResponse,
  MesaResponse
} from '../models/establecimiento/mesa.model';

interface GenericResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MesaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/establecimiento`;

  // ESTADO REACTIVO
  private _mesas = signal<Mesa[]>([]);
  private _estadosMesa = signal<EstadoMesa[]>([]);
  private _zonaSeleccionada = signal<number | null>(null);
  private _mesaSeleccionada = signal<Mesa | null>(null);

  readonly mesas = this._mesas.asReadonly();
  readonly estadosMesa = this._estadosMesa.asReadonly();
  readonly zonaSeleccionada = this._zonaSeleccionada.asReadonly();
  readonly mesaSeleccionada = this._mesaSeleccionada.asReadonly();

  // COMPUTED
  readonly zonas = computed((): ZonaEstablecimiento[] => {
    const mesas = this._mesas();
    const zonasMap = new Map<number, ZonaEstablecimiento>();
    
    mesas.forEach(mesa => {
      if (mesa.zona && !zonasMap.has(mesa.zona.id)) {
        zonasMap.set(mesa.zona.id, mesa.zona);
      }
    });
    
    return Array.from(zonasMap.values());
  });

  readonly mesasFiltradas = computed((): Mesa[] => {
    let mesas = this._mesas();
    const zonaId = this._zonaSeleccionada();

    if (zonaId !== null) {
      mesas = mesas.filter(m => m.zona_id === zonaId);
    }

    return mesas;
  });

  readonly mesasDisponibles = computed((): Mesa[] => {
    return this._mesas().filter(m => 
      m.estado?.id === 1  // ID 1 = Libre
    );
  });

  readonly mesasOcupadas = computed((): Mesa[] => {
    return this._mesas().filter(m => 
      m.estado?.id === 2  // ID 2 = Ocupada
    );
  });

  readonly mesasCargadas = computed(() => this._mesas().length > 0);

  // MÉTODOS HTTP
  cargarMesas(establecimientoId: number): Observable<MesasResponse> {
    const params = new HttpParams().set('establecimiento_id', establecimientoId.toString());
    
    return this.http.get<MesasResponse>(`${this.baseUrl}/mesas`, { params }).pipe(
      tap((response: MesasResponse) => {
        if (response.success) {
          this._mesas.set(response.data);
        }
      })
    );
  }

  getMesaById(id: number): Observable<MesaResponse> {
    return this.http.get<MesaResponse>(`${this.baseUrl}/mesas/${id}`);
  }

  cambiarEstado(mesaId: number, estadoId: number): Observable<MesaResponse> {
    return this.http.patch<MesaResponse>(`${this.baseUrl}/mesas/${mesaId}/estado`, {
      estado_id: estadoId
    }).pipe(
      tap((response: MesaResponse) => {
        if (response.success) {
          this.actualizarMesaEnLista(response.data);
        }
      })
    );
  }

  asignarStaff(mesaId: number, staffId: number): Observable<MesaResponse> {
    return this.http.patch<MesaResponse>(`${this.baseUrl}/mesas/${mesaId}/asignar-staff`, {
      staff_id: staffId
    }).pipe(
      tap((response: MesaResponse) => {
        if (response.success) {
          this.actualizarMesaEnLista(response.data);
        }
      })
    );
  }

  cargarEstadosMesa(): Observable<GenericResponse<EstadoMesa[]>> {
    return this.http.get<GenericResponse<EstadoMesa[]>>(
      `${this.baseUrl}/catalogos/estados_mesa`
    ).pipe(
      tap((response: GenericResponse<EstadoMesa[]>) => {
        if (response.success) {
          this._estadosMesa.set(response.data);
        }
      })
    );
  }

  // ESTADO LOCAL
  seleccionarZona(zonaId: number | null): void {
    this._zonaSeleccionada.set(zonaId);
  }

  seleccionarMesa(mesa: Mesa | null): void {
    this._mesaSeleccionada.set(mesa);
  }

  limpiarSeleccion(): void {
    this._mesaSeleccionada.set(null);
    this._zonaSeleccionada.set(null);
  }

  limpiarMesas(): void {
    this._mesas.set([]);
    this._mesaSeleccionada.set(null);
    this._zonaSeleccionada.set(null);
  }

  // HELPERS
  getMesaByIdLocal(id: number): Mesa | undefined {
    return this._mesas().find(m => m.id === id);
  }

  getEstadoByNombre(nombre: string): EstadoMesa | undefined {
    return this._estadosMesa().find(e => 
      e.nombre.toUpperCase() === nombre.toUpperCase()
    );
  }

  mesaEstaDisponible(mesaId: number): boolean {
    const mesa = this.getMesaByIdLocal(mesaId);
    return mesa?.estado?.id === 1;  // ID 1 = Libre
  }

  private actualizarMesaEnLista(mesaActualizada: Mesa): void {
    const mesas = this._mesas();
    const index = mesas.findIndex(m => m.id === mesaActualizada.id);
    
    if (index !== -1) {
      const nuevasMesas = [...mesas];
      nuevasMesas[index] = mesaActualizada;
      this._mesas.set(nuevasMesas);
    }
  }

  getMesasConEstadoCuenta(cuentasActivas: Map<number, { cuenta_id: number; numero_cuenta: string }>): MesaConEstado[] {
    return this._mesas().map(mesa => {
      const cuentaInfo = cuentasActivas.get(mesa.id);
      
      return {
        id: mesa.id,
        identificacion_mesa: mesa.identificacion_mesa,  // ← AGREGADO
        numero_mesa: mesa.numero_mesa,
        capacidad: mesa.capacidad,
        estado: mesa.estado!,
        zona: mesa.zona,
        staff_asignado: mesa.staff,
        tiene_cuenta_activa: !!cuentaInfo,
        cuenta_id: cuentaInfo?.cuenta_id ?? null,
        numero_cuenta: cuentaInfo?.numero_cuenta ?? null
      };
    });
  }
}