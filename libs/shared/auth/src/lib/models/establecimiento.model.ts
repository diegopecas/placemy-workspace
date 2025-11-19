// libs/shared/auth/src/lib/models/establecimiento.model.ts
import { Role } from './role.model';

/**
 * Modelo de Establecimiento
 * Representa un establecimiento donde el usuario tiene acceso con roles
 */
export interface Establecimiento {
  id: number;
  nombre: string;
  slug: string;
  logo_url?: string;
  roles: Role[];
}

/**
 * Helper para obtener todos los permisos de un establecimiento
 */
export function getPermisosEstablecimiento(establecimiento: Establecimiento): string[] {
  const permisos = new Set<string>();
  
  establecimiento.roles.forEach(rol => {
    rol.permisos?.forEach(permiso => {
      permisos.add(permiso);
    });
  });
  
  return Array.from(permisos);
}