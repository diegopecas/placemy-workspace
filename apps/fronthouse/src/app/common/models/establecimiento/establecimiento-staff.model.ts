export interface EstablecimientoStaff {
  id: number;
  establecimiento_id: number;
  persona_id: number;
  cargo_id: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
  persona?: { id: number; nombre_completo: string };
  cargo?: Cargo;
}

export interface Cargo {
  id: number;
  establecimiento_id: number;
  nombre: string;
  descripcion: string | null;
}

export interface StaffCompleto {
  id: number;
  nombre_completo: string;
  cargo: string;
  activo: boolean;
}

export interface StaffResponse {
  success: boolean;
  data: EstablecimientoStaff[];
  message?: string;
}