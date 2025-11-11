// libs/shared/auth/src/lib/models/permission.model.ts

/**
 * Modelo de Permiso
 * Representa un permiso individual en el sistema
 */
export interface Permission {
  id?: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Tipo para los nombres de permisos como strings
 * Usado para verificaciones rápidas
 */
export type PermissionName = string;

/**
 * Constantes de permisos comunes
 * Puedes expandir esto según necesites
 */
export const CommonPermissions = {
  // Core
  CORE_CONFIGURACIONES_VER: 'core.configuraciones.ver',
  CORE_CONFIGURACIONES_EDITAR: 'core.configuraciones.editar',
  CORE_AUDITORIA_VER: 'core.auditoria.ver',
  
  // Restaurantes
  RESTAURANTES_VER: 'restaurantes.ver',
  RESTAURANTES_CREAR: 'restaurantes.crear',
  RESTAURANTES_EDITAR: 'restaurantes.editar',
  RESTAURANTES_ELIMINAR: 'restaurantes.eliminar',
  
  // Mesas
  MESAS_VER: 'mesas.ver',
  MESAS_CREAR: 'mesas.crear',
  MESAS_EDITAR: 'mesas.editar',
  MESAS_ELIMINAR: 'mesas.eliminar',
  MESAS_CAMBIAR_ESTADO: 'mesas.cambiar_estado',
  
  // Productos
  PRODUCTOS_VER: 'productos.ver',
  PRODUCTOS_CREAR: 'productos.crear',
  PRODUCTOS_EDITAR: 'productos.editar',
  PRODUCTOS_ELIMINAR: 'productos.eliminar',
  
  // Platos
  PLATOS_VER: 'platos.ver',
  PLATOS_CREAR: 'platos.crear',
  PLATOS_EDITAR: 'platos.editar',
  PLATOS_ELIMINAR: 'platos.eliminar',
} as const;
