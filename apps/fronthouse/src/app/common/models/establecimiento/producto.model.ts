export interface Producto {
  id: number;
  codigo_producto: string | null;
  nombre: string;
  descripcion: string | null;
  foto_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface EstablecimientoProducto {
  id: number;
  establecimiento_id: number;
  producto_id: number;
  precio_individual: number;
  disponible: boolean;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductoMenu {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio_individual: number;
  disponible: boolean;
  activo: boolean;
  foto_url: string | null;
}

export interface ProductosResponse {
  success: boolean;
  data: ProductoMenu[];
  message?: string;
}