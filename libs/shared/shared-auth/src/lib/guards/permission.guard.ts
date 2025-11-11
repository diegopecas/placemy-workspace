// libs/shared/shared-auth/src/lib/guards/permission.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { PermissionName } from '../models/permission.model';

/**
 * Guard funcional para proteger rutas según permisos
 * 
 * @param permission Permiso requerido para acceder a la ruta
 * @returns Función CanActivateFn que verifica el permiso
 * 
 * @example
 * ```typescript
 * // En app.routes.ts
 * {
 *   path: 'mesas',
 *   loadComponent: () => import('./mesas/mesas.component'),
 *   canActivate: [permissionGuard('mesas.ver')]
 * }
 * ```
 */
export function permissionGuard(permission: PermissionName): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    
    if (permissionService.hasPermission(permission)) {
      return true;
    }
    
    console.warn(`PermissionGuard: Acceso denegado. Permiso requerido: ${permission}`);
    
    // Redirigir al dashboard o página de acceso denegado
    router.navigate(['/dashboard'], {
      queryParams: { 
        error: 'access_denied',
        required: permission
      }
    });
    
    return false;
  };
}

/**
 * Guard funcional que verifica si el usuario tiene AL MENOS UNO de los permisos
 * 
 * @param permissions Array de permisos (OR lógico)
 * @returns Función CanActivateFn
 * 
 * @example
 * ```typescript
 * // En app.routes.ts - Usuario debe tener mesas.ver O mesas.crear
 * {
 *   path: 'mesas',
 *   loadComponent: () => import('./mesas/mesas.component'),
 *   canActivate: [permissionGuardAny(['mesas.ver', 'mesas.crear'])]
 * }
 * ```
 */
export function permissionGuardAny(permissions: PermissionName[]): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    
    if (permissionService.hasAnyPermission(permissions)) {
      return true;
    }
    
    console.warn(`PermissionGuard: Acceso denegado. Se requiere alguno de: ${permissions.join(', ')}`);
    
    router.navigate(['/dashboard'], {
      queryParams: { 
        error: 'access_denied',
        required: permissions.join(',')
      }
    });
    
    return false;
  };
}

/**
 * Guard funcional que verifica si el usuario tiene TODOS los permisos
 * 
 * @param permissions Array de permisos (AND lógico)
 * @returns Función CanActivateFn
 * 
 * @example
 * ```typescript
 * // En app.routes.ts - Usuario debe tener mesas.ver Y mesas.editar
 * {
 *   path: 'mesas/editar',
 *   loadComponent: () => import('./mesas/editar.component'),
 *   canActivate: [permissionGuardAll(['mesas.ver', 'mesas.editar'])]
 * }
 * ```
 */
export function permissionGuardAll(permissions: PermissionName[]): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    
    if (permissionService.hasAllPermissions(permissions)) {
      return true;
    }
    
    console.warn(`PermissionGuard: Acceso denegado. Se requieren todos: ${permissions.join(', ')}`);
    
    router.navigate(['/dashboard'], {
      queryParams: { 
        error: 'access_denied',
        required: permissions.join(',')
      }
    });
    
    return false;
  };
}

/**
 * Guard funcional para verificar si el usuario es administrador
 * 
 * @returns Función CanActivateFn
 * 
 * @example
 * ```typescript
 * // En app.routes.ts
 * {
 *   path: 'admin',
 *   loadComponent: () => import('./admin/admin.component'),
 *   canActivate: [adminGuard()]
 * }
 * ```
 */
export function adminGuard(): CanActivateFn {
  return () => {
    const permissionService = inject(PermissionService);
    const router = inject(Router);
    
    if (permissionService.isAdmin()) {
      return true;
    }
    
    console.warn('AdminGuard: Acceso denegado. Se requiere rol de administrador');
    
    router.navigate(['/dashboard'], {
      queryParams: { 
        error: 'access_denied',
        required: 'admin'
      }
    });
    
    return false;
  };
}
