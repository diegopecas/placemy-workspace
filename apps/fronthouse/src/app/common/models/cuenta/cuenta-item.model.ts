export interface CuentaItem {
  id: number;
  cuenta_id: number;
  tipo_item_id: number;
  plato_id: number | null;
  producto_id: number | null;
  estado_id: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  impuesto: number;
  descuento: number;
  total: number;
  notas_especiales: string | null;
  created_at: string;
  updated_at: string;
  tipo?: TipoItem;
  estado?: CuentaItemEstado;
  plato?: { id: number; nombre: string; foto_url?: string | null };
  producto?: { id: number; nombre: string; foto_url?: string | null };
}

export interface CuentaItemEstado {
  id: number;
  nombre: 'PENDIENTE' | 'ENVIADO_COCINA' | 'EN_PREPARACION' | 'LISTO' | 'SERVIDO' | 'CANCELADO';
  descripcion: string | null;
  color: string | null;
  icono: string | null;
  permite_modificacion: boolean;
}

export interface TipoItem {
  id: number;
  nombre: 'PLATO' | 'PRODUCTO' | 'COMBO' | 'PROMOCION';
  descripcion: string | null;
}

export interface CreateCuentaItemDto {
  cuenta_id: number;
  tipo_item_id: number;
  plato_id?: number | null;
  producto_id?: number | null;
  estado_id: number;
  cantidad: number;
  precio_unitario: number;
  notas_especiales?: string | null;
}

export interface UpdateCuentaItemDto {
  cantidad?: number;
  notas_especiales?: string;
}

export interface CambiarEstadoItemDto {
  estado_id: number;
}

export interface CuentaItemResponse {
  success: boolean;
  data: CuentaItem;
  message?: string;
}

export interface ItemsModificablesResponse {
  success: boolean;
  data: CuentaItem[];
  message?: string;
}