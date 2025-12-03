import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Cliente,
  ClienteResponse,
  ClientesListResponse,
  CreateClienteCompletoDto,
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

  getCatalogos(): Observable<CatalogosResponse<ClienteCatalogos>> {
    return this.http.get<CatalogosResponse<ClienteCatalogos>>(`${this.baseUrl}/catalogos`);
  }

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

  getClienteById(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.baseUrl}/clientes/${id}`);
  }

  crearClienteCompleto(data: CreateClienteCompletoDto): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(`${this.baseUrl}/clientes/completo`, data);
  }

  actualizarCliente(id: number, data: Partial<CreateClienteCompletoDto>): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.baseUrl}/clientes/${id}`, data);
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

  getAlergenos(): Observable<AlergenosResponse> {
    return this.http.get<AlergenosResponse>(`${environment.apiUrl}/establecimiento/catalogos/alergenos`);
  }

  verificarAlergias(clienteAlergenos: Alergeno[], platoAlergenos: { id: number; nombre: string; icono?: string | null }[]): Alergeno[] {
    if (!clienteAlergenos?.length || !platoAlergenos?.length) {
      return [];
    }
    const clienteAlergenoIds = new Set(clienteAlergenos.map(a => a.id));
    return platoAlergenos
      .filter(a => clienteAlergenoIds.has(a.id))
      .map(a => ({ id: a.id, nombre: a.nombre, icono: a.icono ?? null, descripcion: null }));
  }
}