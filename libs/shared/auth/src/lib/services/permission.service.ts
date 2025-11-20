// libs/shared/auth/src/lib/services/permission.service.ts
import { Injectable, computed, Signal, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { PermissionName } from '../models/permission.model';

/**
 * Servicio de Permisos
 * 
 * Maneja la autorización del usuario verificando sus permisos.
 * Soporta filtrado por establecimiento activo.
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  
  /**
   * Usuario actual (inyectado desde el AuthService de la app host)
   */
  private _currentUserSignal: Signal<User | null> | null = null;
  
  /**
   * ID del establecimiento activo (para filtrar permisos)
   */
  private _activeEstablecimientoId = signal<number | null>(null);
  
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
   * Signal computado con los permisos del establecimiento activo
   */
  public readonly activeEstablecimientoPermissions: Signal<Set<string>> = computed(() => {
    const user = this._currentUserSignal?.();
    const activeId = this._activeEstablecimientoId();
    
    if (!user || !user.establecimientos || !activeId) {
      return new Set<string>();
    }
    
    const establecimiento = user.establecimientos.find(e => e.id === activeId);
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
  });

  /**
   * Configura el signal del usuario actual
   */
  setCurrentUserSignal(userSignal: Signal<User | null>): void {
    this._currentUserSignal = userSignal;
  }

  /**
   * Establece el establecimiento activo para filtrar permisos
   */
  setActiveEstablecimiento(establecimientoId: number): void {
    this._activeEstablecimientoId.set(establecimientoId);
    console.log('🏢 Establecimiento activo configurado:', establecimientoId);
  }

  /**
   * Obtiene el ID del establecimiento activo
   */
  getActiveEstablecimientoId(): number | null {
    return this._activeEstablecimientoId();
  }

  /**
   * Limpia el establecimiento activo
   */
  clearActiveEstablecimiento(): void {
    this._activeEstablecimientoId.set(null);
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   * Si hay establecimiento activo, filtra por ese establecimiento
   * Si no, verifica en todos los establecimientos
   */
  hasPermission(permission: PermissionName): boolean {
    if (!permission) {
      console.warn('PermissionService: permiso vacío o indefinido');
      return false;
    }
    
    // Si hay establecimiento activo, verificar solo en ese
    const activeId = this._activeEstablecimientoId();
    if (activeId) {
      const permissions = this.activeEstablecimientoPermissions();
      const hasIt = permissions.has(permission);
      
      if (!hasIt) {
        console.debug(`PermissionService: Usuario NO tiene permiso "${permission}" en establecimiento ${activeId}`);
      }
      
      return hasIt;
    }
    
    // Si no hay establecimiento activo, verificar en todos
    const permissions = this.userPermissions();
    const hasIt = permissions.has(permission);
    
    if (!hasIt) {
      console.debug(`PermissionService: Usuario NO tiene permiso "${permission}"`);
    }
    
    return hasIt;
  }

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos especificados
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
   * Respeta el establecimiento activo si está configurado
   */
  getAllPermissions(): Set<string> {
    const activeId = this._activeEstablecimientoId();
    if (activeId) {
      return this.activeEstablecimientoPermissions();
    }
    return this.userPermissions();
  }

  /**
   * Verifica si el usuario tiene permiso sobre una entidad específica
   */
  hasPermissionFor(entity: string, action: string): boolean {
    const permission = `${entity}.${action}`;
    return this.hasPermission(permission);
  }

  /**
   * Verifica si el usuario tiene rol de administrador
   */
  isAdmin(): boolean {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return false;
    }
    
    const activeId = this._activeEstablecimientoId();
    
    // Si hay establecimiento activo, verificar solo en ese
    if (activeId) {
      const establecimiento = user.establecimientos.find(e => e.id === activeId);
      if (!establecimiento) return false;
      
      return establecimiento.roles.some((role: Role) => 
        role.nombre === 'Super Administrador' || 
        role.nombre === 'Administrador' ||
        role.nombre.toLowerCase().includes('admin')
      );
    }
    
    // Si no, verificar en todos
    return user.establecimientos.some(establecimiento =>
      establecimiento.roles.some((role: Role) => 
        role.nombre === 'Super Administrador' || 
        role.nombre === 'Administrador' ||
        role.nombre.toLowerCase().includes('admin')
      )
    );
  }

  /**
   * Obtiene los roles del usuario actual
   * Respeta el establecimiento activo si está configurado
   */
  getUserRoles(): string[] {
    const user = this._currentUserSignal?.();
    if (!user || !user.establecimientos) {
      return [];
    }
    
    const activeId = this._activeEstablecimientoId();
    const roles = new Set<string>();
    
    if (activeId) {
      // Solo roles del establecimiento activo
      const establecimiento = user.establecimientos.find(e => e.id === activeId);
      if (establecimiento) {
        establecimiento.roles.forEach((role: Role) => {
          roles.add(role.nombre);
        });
      }
    } else {
      // Todos los roles
      user.establecimientos.forEach(establecimiento => {
        establecimiento.roles.forEach((role: Role) => {
          roles.add(role.nombre);
        });
      });
    }
    
    return Array.from(roles);
  }

  /**
   * Obtiene los permisos del usuario en un establecimiento específico
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
   */
  hasPermissionInEstablecimiento(permission: PermissionName, establecimientoId: number): boolean {
    const permissions = this.getPermissionsInEstablecimiento(establecimientoId);
    return permissions.has(permission);
  }

  /**
   * Debug: Imprime todos los permisos del usuario en consola
   */
  debugPermissions(): void {
    const permissions = this.getAllPermissions();
    const roles = this.getUserRoles();
    const user = this._currentUserSignal?.();
    const activeId = this._activeEstablecimientoId();
    
    console.group('🔐 Permisos del Usuario');
    console.log('Establecimientos:', user?.establecimientos?.length || 0);
    console.log('Establecimiento activo:', activeId);
    console.log('Roles:', roles);
    console.log('Total de permisos:', permissions.size);
    console.log('Permisos:', Array.from(permissions).sort());
    console.groupEnd();
  }
}
