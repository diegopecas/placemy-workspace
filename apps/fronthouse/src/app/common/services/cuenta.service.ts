import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  Cuenta,
  CuentaEstado,
  CuentaResponse,
  CreateCuentaDto,
  UpdateCuentaDto
} from '../models/cuenta/cuenta.model';
import {
  CuentaItemEstado,
  TipoItem,
  CuentaItemResponse,
  ItemsModificablesResponse,
  CreateCuentaItemDto,
  UpdateCuentaItemDto,
  CambiarEstadoItemDto
} from '../models/cuenta/cuenta-item.model';

interface CatalogosResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface CuentaCatalogos {
  estados_cuenta: CuentaEstado[];
  estados_item: CuentaItemEstado[];
  tipos_item: TipoItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/cuentas`;

  // CATÁLOGOS
  getCatalogos(): Observable<CatalogosResponse<CuentaCatalogos>> {
    return this.http.get<CatalogosResponse<CuentaCatalogos>>(`${this.baseUrl}/catalogos`);
  }

  getEstadosCuenta(): Observable<CatalogosResponse<CuentaEstado[]>> {
    return this.http.get<CatalogosResponse<CuentaEstado[]>>(`${this.baseUrl}/catalogos/estados_cuenta`);
  }

  getEstadosItem(): Observable<CatalogosResponse<CuentaItemEstado[]>> {
    return this.http.get<CatalogosResponse<CuentaItemEstado[]>>(`${this.baseUrl}/catalogos/estados_item`);
  }

  getTiposItem(): Observable<CatalogosResponse<TipoItem[]>> {
    return this.http.get<CatalogosResponse<TipoItem[]>>(`${this.baseUrl}/catalogos/tipos_item`);
  }

  // CUENTAS
  crearCuenta(data: CreateCuentaDto): Observable<CuentaResponse> {
    return this.http.post<CuentaResponse>(this.baseUrl, data);
  }

  getCuentaById(id: number): Observable<CuentaResponse> {
    return this.http.get<CuentaResponse>(`${this.baseUrl}/${id}`);
  }

  getCuentaActivaMesa(mesaId: number): Observable<CuentaResponse> {
    return this.http.get<CuentaResponse>(`${this.baseUrl}/mesa/${mesaId}/activa`);
  }

  actualizarCuenta(id: number, data: UpdateCuentaDto): Observable<CuentaResponse> {
    return this.http.patch<CuentaResponse>(`${this.baseUrl}/${id}`, data);
  }

  cerrarCuenta(id: number): Observable<CuentaResponse> {
    return this.http.patch<CuentaResponse>(`${this.baseUrl}/${id}/cerrar`, {});
  }

  calcularTotales(id: number): Observable<CuentaResponse> {
    return this.http.post<CuentaResponse>(`${this.baseUrl}/${id}/calcular-totales`, {});
  }

  // ITEMS
  agregarItem(data: CreateCuentaItemDto): Observable<CuentaItemResponse> {
    return this.http.post<CuentaItemResponse>(`${this.baseUrl}/items`, data);
  }

  actualizarItem(itemId: number, data: UpdateCuentaItemDto): Observable<CuentaItemResponse> {
    return this.http.patch<CuentaItemResponse>(`${this.baseUrl}/items/${itemId}`, data);
  }

  cambiarEstadoItem(itemId: number, data: CambiarEstadoItemDto): Observable<CuentaItemResponse> {
    return this.http.patch<CuentaItemResponse>(`${this.baseUrl}/items/${itemId}/estado`, data);
  }

  eliminarItem(itemId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/items/${itemId}`);
  }

  getItemsModificables(cuentaId: number): Observable<ItemsModificablesResponse> {
    return this.http.get<ItemsModificablesResponse>(`${this.baseUrl}/${cuentaId}/items/modificables`);
  }

  verificarCuentaActivaMesa(mesaId: number): Observable<{ success: boolean; tiene_cuenta: boolean; cuenta_id?: number }> {
    return this.http.get<{ success: boolean; tiene_cuenta: boolean; cuenta_id?: number }>(
      `${this.baseUrl}/mesa/${mesaId}/verificar`
    );
  }
}