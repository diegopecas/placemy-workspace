// libs/shared/auth/src/lib/models/role.model.ts
import { Permission } from './permission.model';

/**
 * Modelo de Rol
 * Un rol agrupa permisos y se asigna a usuarios
 */
export interface Role {
  id: number;
  nombre: string;
  descripcion?: string;
  permisos?: string[]; // Array de nombres de permisos (ej: "mesas.ver")
  created_at?: string;
  updated_at?: string;
}
