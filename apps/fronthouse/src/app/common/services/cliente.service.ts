import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Cliente,
  ClienteResponse,
  ClientesListResponse,
  CreateClienteCompletoDto,
  CreateClienteDirectoDto,
  BuscarClienteDto
} from '../models/cliente/cliente.model';
import { Alergeno, AlergenosResponse } from '../models/establecimiento/alergeno.model';

interface CatalogosResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ClienteCatalogos {
  tipos_documento: { id: number; nombre: string; codigo: string }[];
  tipos_fecha_especial: { id: number; nombre: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cliente`;

  // ========================================
  // SIGNAL COMPARTIDO
  // Para pasar cliente entre componentes (buscar-cliente → crear-cuenta)
  // ========================================
  clienteSeleccionadoTemp = signal<Cliente | null>(null);

  // ========================================
  // HELPERS PARA SIGNAL
  // ========================================
  
  /**
   * Guardar cliente seleccionado temporalmente
   */
  setClienteTemp(cliente: Cliente): void {
    this.clienteSeleccionadoTemp.set(cliente);
  }

  /**
   * Obtener cliente temporal
   */
  getClienteTemp(): Cliente | null {
    return this.clienteSeleccionadoTemp();
  }

  /**
   * Limpiar cliente temporal
   */
  clearClienteTemp(): void {
    this.clienteSeleccionadoTemp.set(null);
  }

  // ========================================
  // CATÁLOGOS
  // ========================================

  getCatalogos(): Observable<CatalogosResponse<ClienteCatalogos>> {
    return this.http.get<CatalogosResponse<ClienteCatalogos>>(`${this.baseUrl}/catalogos`);
  }

  getAlergenos(): Observable<AlergenosResponse> {
    return this.http.get<AlergenosResponse>(`${environment.apiUrl}/establecimiento/catalogos/alergenos`);
  }

  // ========================================
  // BÚSQUEDA
  // ========================================

  buscarClientes(filtros: BuscarClienteDto): Observable<ClientesListResponse> {
    let params = new HttpParams();
    
    if (filtros.telefono) {
      params = params.set('busqueda', filtros.telefono);
    } else if (filtros.numero_documento) {
      params = params.set('busqueda', filtros.numero_documento);
    } else if (filtros.nombre) {
      params = params.set('busqueda', filtros.nombre);
    }

    return this.http.get<ClientesListResponse>(`${this.baseUrl}/clientes`, { params });
  }

  buscarPorTelefono(telefono: string): Observable<ClientesListResponse> {
    return this.buscarClientes({ telefono });
  }

  buscarPorDocumento(documento: string): Observable<ClientesListResponse> {
    return this.buscarClientes({ numero_documento: documento });
  }

  buscarPorNombre(nombre: string): Observable<ClientesListResponse> {
    return this.buscarClientes({ nombre });
  }

  // ========================================
  // OBTENER CLIENTE
  // ========================================

  getClienteById(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/clientes/${id}`);
  }

  // ========================================
  // CREAR CLIENTE
  // ========================================

  /**
   * Crear cliente COMPLETO (con persona)
   * DEPRECATED: Usar crearClienteDirecto() para nuevos clientes
   */
  crearClienteCompleto(data: CreateClienteCompletoDto): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.baseUrl}/clientes/completo`, data);
  }

  /**
   * Crear cliente DIRECTO (sin persona)
   * NUEVA estructura - Recomendada
   */
  crearClienteDirecto(data: CreateClienteDirectoDto): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.baseUrl}/clientes`, data);
  }

  // ========================================
  // ACTUALIZAR CLIENTE
  // ========================================

  actualizarCliente(id: number, data: Partial<CreateClienteCompletoDto>): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.baseUrl}/clientes/${id}`, data);
  }

  // ========================================
  // ALERGIAS
  // ========================================

  /**
   * Verificar conflictos de alergias entre cliente y plato
   */
  verificarAlergias(
    clienteAlergenos: Alergeno[], 
    platoAlergenos: { id: number; nombre: string; icono?: string | null }[]
  ): Alergeno[] {
    if (!clienteAlergenos?.length || !platoAlergenos?.length) {
      return [];
    }
    const clienteAlergenoIds = new Set(clienteAlergenos.map(a => a.id));
    return platoAlergenos
      .filter(a => clienteAlergenoIds.has(a.id))
      .map(a => ({ 
        id: a.id, 
        nombre: a.nombre, 
        icono: a.icono ?? null, 
        descripcion: null 
      }));
  }
}