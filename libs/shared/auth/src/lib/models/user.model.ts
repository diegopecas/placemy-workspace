// libs/shared/auth/src/lib/models/user.model.ts
import { Role } from './role.model';

/**
 * Modelo de Usuario
 * Representa un usuario del sistema con sus datos personales y roles
 */
export interface User {
  id: number;
  username: string;
  email: string;
  persona_natural?: PersonaNatural;
  roles?: Role[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Datos de Persona Natural
 * Información personal del usuario
 */
export interface PersonaNatural {
  id: number;
  tipo_documento_id: number;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  nombre_completo?: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono?: string;
  direccion?: string;
  ciudad_id?: number;
}
