export interface Plato {
  id: number;
  categoria_id: number;
  codigo_plato: string | null;
  nombre: string;
  descripcion: string | null;
  costo: number;
  foto_url: string | null;
  video_url: string | null;
  tiempo_preparacion_min: number | null;
  etiquetas: string[];
  created_at: string;
  updated_at: string;
  categoria?: CategoriaMenu;
  alergenos?: { id: number; nombre: string; icono?: string | null }[];
}

export interface EstablecimientoPlato {
  id: number;
  establecimiento_id: number;
  plato_id: number;
  precio: number;
  disponible: boolean;
  calificacion_promedio: number | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriaMenu {
  id: number;
  establecimiento_id: number;
  nombre: string;
  descripcion: string | null;
  orden: number;
  activo: boolean;
}

export interface PlatoMenu {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  disponible: boolean;
  activo: boolean;
  foto_url: string | null;
  video_url: string | null;
  tiempo_preparacion_min: number | null;
  calificacion_promedio: number | null;
  categoria: { id: number; nombre: string } | null;
  alergenos: { id: number; nombre: string; icono?: string | null }[];
}

export interface PlatosResponse {
  success: boolean;
  data: PlatoMenu[];
  message?: string;
}