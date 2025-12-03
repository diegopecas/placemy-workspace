export interface Alergeno {
  id: number;
  nombre: string;
  icono: string | null;
  descripcion: string | null;
}

export interface AlergenosResponse {
  success: boolean;
  data: Alergeno[];
  message?: string;
}