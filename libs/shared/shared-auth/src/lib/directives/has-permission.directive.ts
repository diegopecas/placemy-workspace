// libs/shared/shared-auth/src/lib/directives/has-permission.directive.ts
import { 
  Directive, 
  Input, 
  TemplateRef, 
  ViewContainerRef, 
  inject,
  OnInit,
  OnDestroy,
  effect
} from '@angular/core';
import { PermissionService } from '../services/permission.service';
import { PermissionName } from '../models/permission.model';

/**
 * Directiva estructural para mostrar/ocultar elementos según permisos
 * 
 * Similar a *ngIf pero basada en permisos del usuario.
 * Si el usuario NO tiene el permiso, el elemento NO se renderiza en el DOM.
 * 
 * @example
 * ```html
 * <!-- Mostrar botón solo si tiene permiso para crear productos -->
 * <button *appHasPermission="'productos.crear'" mat-raised-button>
 *   Nuevo Producto
 * </button>
 * 
 * <!-- Mostrar sección solo si tiene alguno de los permisos (OR) -->
 * <div *appHasPermission="['mesas.ver', 'mesas.crear']; mode: 'any'">
 *   Gestión de Mesas
 * </div>
 * 
 * <!-- Mostrar sección solo si tiene todos los permisos (AND) -->
 * <div *appHasPermission="['mesas.ver', 'mesas.editar']; mode: 'all'">
 *   Editar Mesas
 * </div>
 * ```
 */
@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit, OnDestroy {
  private permissionService = inject(PermissionService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  
  private permission: PermissionName | PermissionName[] = '';
  private mode: 'single' | 'any' | 'all' = 'single';
  private hasView = false;

  /**
   * Permiso o array de permisos a verificar
   */
  @Input() 
  set appHasPermission(permission: PermissionName | PermissionName[]) {
    this.permission = permission;
    this.updateView();
  }

  /**
   * Modo de verificación cuando se pasa un array:
   * - 'any': Usuario debe tener AL MENOS UNO de los permisos (OR)
   * - 'all': Usuario debe tener TODOS los permisos (AND)
   * - 'single': Un solo permiso (default)
   */
  @Input() 
  set appHasPermissionMode(mode: 'any' | 'all') {
    this.mode = mode;
    this.updateView();
  }

  constructor() {
    // Reaccionar a cambios en los permisos del usuario usando effects
    effect(() => {
      // Trigger cuando cambien los permisos
      this.permissionService.userPermissions();
      this.updateView();
    });
  }

  ngOnInit(): void {
    this.updateView();
  }

  ngOnDestroy(): void {
    this.viewContainer.clear();
  }

  /**
   * Actualiza la vista según los permisos
   */
  private updateView(): void {
    const hasPermission = this.checkPermission();
    
    if (hasPermission && !this.hasView) {
      // Mostrar elemento
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasPermission && this.hasView) {
      // Ocultar elemento
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  /**
   * Verifica si el usuario tiene el/los permiso(s)
   */
  private checkPermission(): boolean {
    if (!this.permission) {
      console.warn('HasPermissionDirective: No se especificó permiso');
      return false;
    }

    // Si es un array de permisos
    if (Array.isArray(this.permission)) {
      if (this.mode === 'any') {
        return this.permissionService.hasAnyPermission(this.permission);
      } else if (this.mode === 'all') {
        return this.permissionService.hasAllPermissions(this.permission);
      }
      // Default: verificar si tiene al menos uno
      return this.permissionService.hasAnyPermission(this.permission);
    }

    // Si es un solo permiso
    return this.permissionService.hasPermission(this.permission);
  }
}
