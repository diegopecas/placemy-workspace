// libs/shared/auth/src/lib/services/permission.service.ts
import { Injectable, computed, Signal } from '@angular/core';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { PermissionName } from '../models/permission.model';

/**
 * Servicio de Permisos
 * 
 * Maneja la autorización del usuario verificando sus permisos.
 * Este servicio es STATELESS - lee los permisos del usuario actual
 * desde el AuthService de la aplicación host.
 * 
 * @example
 * ```typescript
 * // En un componente
 * if (this.permissionService.hasPermission('mesas.ver')) {
 *   // Mostrar opción de mesas
 * }
 * 
 * // En un guard
 * return this.permissionService.hasPermission('productos.crear');
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  
  /**
   * Usuario actual (inyectado desde el AuthService de la app host)
   * Este será configurado por la app que use esta librería
   */
  private _currentUserSignal: Signal<User | null> | null = null;
  
  /**
   * Signal computado con todos los permisos del usuario actual
   * Consolida permisos de todos los establecimientos y roles en un Set único
   */
  public readonly userPermissions: Signal<Set<string>> = computed(() => {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return new Set<string>();
    }
    
    // Consolidar permisos de todos los establecimientos y roles
    const allPermissions = new Set<string>();
    user.establecimientos.forEach(establecimiento => {
      establecimiento.roles.forEach((role: Role) => {
        if (role.permisos) {
          role.permisos.forEach((permiso: string) => allPermissions.add(permiso));
        }
      });
    });
    
    return allPermissions;
  });

  /**
   * Configura el signal del usuario actual
   * Debe ser llamado por la app host al inicializar
   * 
   * @param userSignal Signal del usuario desde AuthService
   */
  setCurrentUserSignal(userSignal: Signal<User | null>): void {
    this._currentUserSignal = userSignal;
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   * 
   * @param permission Nombre del permiso (ej: "mesas.ver")
   * @returns true si el usuario tiene el permiso, false en caso contrario
   * 
   * @example
   * ```typescript
   * if (this.permissionService.hasPermission('mesas.ver')) {
   *   console.log('Usuario puede ver mesas');
   * }
   * ```
   */
  hasPermission(permission: PermissionName): boolean {
    if (!permission) {
      console.warn('PermissionService: permiso vacío o indefinido');
      return false;
    }
    
    const permissions = this.userPermissions();
    const hasIt = permissions.has(permission);
    
    // Log para debugging (solo en desarrollo)
    if (!hasIt) {
      console.debug(`PermissionService: Usuario NO tiene permiso "${permission}"`);
    }
    
    return hasIt;
  }

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos especificados
   * 
   * @param permissions Array de nombres de permisos
   * @returns true si el usuario tiene al menos uno de los permisos
   * 
   * @example
   * ```typescript
   * if (this.permissionService.hasAnyPermission(['mesas.ver', 'mesas.crear'])) {
   *   console.log('Usuario puede ver O crear mesas');
   * }
   * ```
   */
  hasAnyPermission(permissions: PermissionName[]): boolean {
    if (!permissions || permissions.length === 0) {
      console.warn('PermissionService: array de permisos vacío');
      return false;
    }
    
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Verifica si el usuario tiene TODOS los permisos especificados
   * 
   * @param permissions Array de nombres de permisos
   * @returns true si el usuario tiene todos los permisos
   * 
   * @example
   * ```typescript
   * if (this.permissionService.hasAllPermissions(['mesas.ver', 'mesas.editar'])) {
   *   console.log('Usuario puede ver Y editar mesas');
   * }
   * ```
   */
  hasAllPermissions(permissions: PermissionName[]): boolean {
    if (!permissions || permissions.length === 0) {
      console.warn('PermissionService: array de permisos vacío');
      return false;
    }
    
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Obtiene todos los permisos del usuario actual como Set
   * 
   * @returns Set con todos los nombres de permisos
   * 
   * @example
   * ```typescript
   * const permisos = this.permissionService.getAllPermissions();
   * console.log('Usuario tiene', permisos.size, 'permisos');
   * ```
   */
  getAllPermissions(): Set<string> {
    return this.userPermissions();
  }

  /**
   * Verifica si el usuario tiene permiso sobre una entidad específica
   * Útil para verificaciones dinámicas
   * 
   * @param entity Nombre de la entidad (ej: "mesas", "productos")
   * @param action Acción (ej: "ver", "crear", "editar", "eliminar")
   * @returns true si el usuario tiene el permiso
   * 
   * @example
   * ```typescript
   * if (this.permissionService.hasPermissionFor('mesas', 'crear')) {
   *   console.log('Usuario puede crear mesas');
   * }
   * ```
   */
  hasPermissionFor(entity: string, action: string): boolean {
    const permission = `${entity}.${action}`;
    return this.hasPermission(permission);
  }

  /**
   * Verifica si el usuario tiene rol de administrador
   * (tiene todos los permisos o un rol específico)
   * 
   * @returns true si el usuario es administrador
   * 
   * @example
   * ```typescript
   * if (this.permissionService.isAdmin()) {
   *   console.log('Usuario es administrador');
   * }
   * ```
   */
  isAdmin(): boolean {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return false;
    }
    
    // Verificar si tiene el rol "Super Administrador" o "Administrador" en algún establecimiento
    return user.establecimientos.some(establecimiento =>
      establecimiento.roles.some((role: Role) => 
        role.nombre === 'Super Administrador' || 
        role.nombre === 'Administrador' ||
        role.nombre.toLowerCase().includes('admin')
      )
    );
  }

  /**
   * Obtiene los roles del usuario actual (de todos los establecimientos)
   * 
   * @returns Array de nombres de roles
   */
  getUserRoles(): string[] {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return [];
    }
    
    const roles = new Set<string>();
    user.establecimientos.forEach(establecimiento => {
      establecimiento.roles.forEach((role: Role) => {
        roles.add(role.nombre);
      });
    });
    
    return Array.from(roles);
  }

  /**
   * Obtiene los permisos del usuario en un establecimiento específico
   * 
   * @param establecimientoId ID del establecimiento
   * @returns Set con los permisos en ese establecimiento
   */
  getPermissionsInEstablecimiento(establecimientoId: number): Set<string> {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return new Set<string>();
    }
    
    const establecimiento = user.establecimientos.find(e => e.id === establecimientoId);
    if (!establecimiento) {
      return new Set<string>();
    }
    
    const permissions = new Set<string>();
    establecimiento.roles.forEach((role: Role) => {
      if (role.permisos) {
        role.permisos.forEach((permiso: string) => permissions.add(permiso));
      }
    });
    
    return permissions;
  }

  /**
   * Verifica si el usuario tiene un permiso en un establecimiento específico
   * 
   * @param permission Nombre del permiso
   * @param establecimientoId ID del establecimiento
   * @returns true si tiene el permiso en ese establecimiento
   */
  hasPermissionInEstablecimiento(permission: PermissionName, establecimientoId: number): boolean {
    const permissions = this.getPermissionsInEstablecimiento(establecimientoId);
    return permissions.has(permission);
  }

  /**
   * Debug: Imprime todos los permisos del usuario en consola
   * Útil para desarrollo
   */
  debugPermissions(): void {
    const permissions = this.getAllPermissions();
    const roles = this.getUserRoles();
    const user = this._currentUserSignal?.();
    
    console.group('🔐 Permisos del Usuario');
    console.log('Establecimientos:', user?.establecimientos?.length || 0);
    console.log('Roles:', roles);
    console.log('Total de permisos:', permissions.size);
    console.log('Permisos:', Array.from(permissions).sort());
    console.groupEnd();
  }
}