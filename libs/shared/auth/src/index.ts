// libs/shared/auth/src/index.ts

/**
 * @placemy/shared/auth
 * 
 * Librería compartida de autenticación y autorización
 * para todas las aplicaciones del workspace PlaceMy
 * 
 * Incluye:
 * - PermissionService: Verificación de permisos del usuario
 * - Guards: Protección de rutas basada en permisos
 * - Directivas: Mostrar/ocultar elementos según permisos
 * - Modelos: User, Role, Permission
 */

// Modelos
export * from './lib/models';

// Servicios
export * from './lib/services';

// Guards
export * from './lib/guards';

// Directivas
export * from './lib/directives';
