export interface Mesa {
  id: number;
  establecimiento_id: number;
  zona_id: number | null;
  numero_mesa: string;
  capacidad: number;
  estado_id: number;
  establecimiento_staff_id: number | null;
  codigo_qr: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  estado?: EstadoMesa;
  zona?: ZonaEstablecimiento;
  staff?: { id: number; nombre_completo: string };
}

export interface EstadoMesa {
  id: number;
  nombre: 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA' | 'MANTENIMIENTO';
  descripcion: string | null;
  color: string | null;
  icono: string | null;
}

export interface ZonaEstablecimiento {
  id: number;
  establecimiento_id: number;
  nombre: string;
  descripcion: string | null;
  capacidad_total: number | null;
  activo: boolean;
}

export interface MesaConEstado {
  id: number;
  numero_mesa: string;
  capacidad: number;
  estado: EstadoMesa;
  zona: ZonaEstablecimiento | null | undefined;
  staff_asignado: { id: number; nombre_completo: string } | null | undefined;
  tiene_cuenta_activa: boolean;
  cuenta_id: number | null;
  numero_cuenta: string | null;
}

export interface MesasResponse {
  success: boolean;
  data: Mesa[];
  message?: string;
}

export interface MesaResponse {
  success: boolean;
  data: Mesa;
  message?: string;
}