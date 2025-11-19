// libs/shared/auth/src/lib/models/user.model.ts
import { Establecimiento } from './establecimiento.model';

/**
 * Modelo de Usuario
 * Representa un usuario del sistema con sus datos personales y establecimientos
 */
export interface User {
  id: number;
  username: string;
  email: string;
  persona_natural?: PersonaNatural;
  establecimientos?: Establecimiento[];
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

/**
 * Helper para obtener todos los permisos del usuario en todos los establecimientos
 */
export function getAllPermissions(user: User): string[] {
  const permisos = new Set<string>();
  
  user.establecimientos?.forEach(est => {
    est.roles.forEach(rol => {
      rol.permisos?.forEach(permiso => {
        permisos.add(permiso);
      });
    });
  });
  
  return Array.from(permisos);
}

/**
 * Helper para obtener permisos en un establecimiento específico
 */
export function getPermissionsInEstablecimiento(user: User, establecimientoId: number): string[] {
  const establecimiento = user.establecimientos?.find(e => e.id === establecimientoId);
  
  if (!establecimiento) {
    return [];
  }
  
  const permisos = new Set<string>();
  
  establecimiento.roles.forEach(rol => {
    rol.permisos?.forEach(permiso => {
      permisos.add(permiso);
    });
  });
  
  return Array.from(permisos);
}