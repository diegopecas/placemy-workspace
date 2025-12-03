import { CuentaItem } from './cuenta-item.model';

export interface Cuenta {
  id: number;
  establecimiento_id: number;
  mesa_id: number;
  cliente_id: number | null;
  establecimiento_staff_id: number;
  estado_id: number;
  numero_cuenta: string;
  palabra_secreta: string | null;
  subtotal: number;
  total_impuestos: number;
  total_descuentos: number;
  propina: number;
  total: number;
  notas: string | null;
  fecha_apertura: string;
  fecha_cierre: string | null;
  created_at: string;
  updated_at: string;
  estado?: CuentaEstado;
  mesa?: { id: number; numero_mesa: string };
  cliente?: { id: number; nombre_completo: string };
  staff?: { id: number; nombre_completo: string };
  items?: CuentaItem[];
}

export interface CuentaEstado {
  id: number;
  nombre: 'ABIERTA' | 'PAGADA' | 'CERRADA' | 'CANCELADA';
  descripcion: string | null;
  color: string | null;
  icono: string | null;
}

export interface CreateCuentaDto {
  establecimiento_id: number;
  mesa_id: number;
  establecimiento_staff_id: number;
  estado_id: number;
  cliente_id?: number | null;
  palabra_secreta?: string;
  notas?: string;
}

export interface UpdateCuentaDto {
  cliente_id?: number | null;
  descuento?: number;
  propina?: number;
  notas?: string;
}

export interface CuentaResponse {
  success: boolean;
  data: Cuenta;
  message?: string;
}

export interface CuentasListResponse {
  success: boolean;
  data: Cuenta[];
  message?: string;
}