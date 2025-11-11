# @placemy/shared/auth

Librería compartida de autenticación y autorización para el workspace PlaceMy.

## 📦 Contenido

- **PermissionService**: Servicio para verificar permisos del usuario
- **Guards**: Funciones guard para proteger rutas
- **Directivas**: Directiva `*appHasPermission` para mostrar/ocultar elementos
- **Modelos**: User, Role, Permission

## 🚀 Instalación

Esta librería es parte del monorepo y no requiere instalación adicional.

## 📖 Uso

### 1. Configurar en la App Host

En `app.config.ts` o en el `main.ts` de tu app:

```typescript
import { PermissionService } from '@placemy/shared/auth';
import { AuthService } from './core/services/auth.service';

// En el constructor de tu AppComponent o en un inicializador
export class AppComponent {
  private permissionService = inject(PermissionService);
  private authService = inject(AuthService);

  constructor() {
    // Configurar el signal del usuario
    this.permissionService.setCurrentUserSignal(this.authService.currentUser);
  }
}
```

### 2. Verificar Permisos en Componentes

```typescript
import { PermissionService } from '@placemy/shared/auth';

export class MiComponente {
  private permissionService = inject(PermissionService);

  ngOnInit() {
    // Verificar un permiso
    if (this.permissionService.hasPermission('mesas.ver')) {
      console.log('Usuario puede ver mesas');
    }

    // Verificar múltiples permisos (OR)
    if (this.permissionService.hasAnyPermission(['mesas.ver', 'mesas.crear'])) {
      console.log('Usuario puede ver O crear mesas');
    }

    // Verificar múltiples permisos (AND)
    if (this.permissionService.hasAllPermissions(['mesas.ver', 'mesas.editar'])) {
      console.log('Usuario puede ver Y editar mesas');
    }
  }
}
```

### 3. Proteger Rutas con Guards

```typescript
import { permissionGuard } from '@placemy/shared/auth';

export const routes: Routes = [
  {
    path: 'mesas',
    loadComponent: () => import('./mesas/mesas.component'),
    canActivate: [permissionGuard('mesas.ver')]
  }
];
```

### 4. Mostrar/Ocultar Elementos en Templates

```html
<!-- Importar la directiva en tu componente -->
import { HasPermissionDirective } from '@placemy/shared/auth';

@Component({
  imports: [HasPermissionDirective]
})

<!-- Usar en el template -->
<button *appHasPermission="'productos.crear'" mat-raised-button>
  Nuevo Producto
</button>

<!-- Verificar múltiples permisos (OR) -->
<div *appHasPermission="['mesas.ver', 'mesas.crear']; mode: 'any'">
  Contenido visible si tiene alguno de los permisos
</div>

<!-- Verificar múltiples permisos (AND) -->
<div *appHasPermission="['mesas.ver', 'mesas.editar']; mode: 'all'">
  Contenido visible si tiene todos los permisos
</div>
```

## 🎯 API del PermissionService

### Métodos Principales

- `hasPermission(permission: string): boolean` - Verifica un permiso
- `hasAnyPermission(permissions: string[]): boolean` - Verifica si tiene alguno (OR)
- `hasAllPermissions(permissions: string[]): boolean` - Verifica si tiene todos (AND)
- `hasPermissionFor(entity: string, action: string): boolean` - Verificación dinámica
- `isAdmin(): boolean` - Verifica si es administrador
- `getAllPermissions(): Set<string>` - Obtiene todos los permisos
- `getUserRoles(): string[]` - Obtiene los roles del usuario
- `debugPermissions(): void` - Imprime permisos en consola (desarrollo)

## 🔐 Guards Disponibles

- `permissionGuard(permission)` - Un solo permiso
- `permissionGuardAny(permissions)` - Alguno de los permisos (OR)
- `permissionGuardAll(permissions)` - Todos los permisos (AND)
- `adminGuard()` - Solo administradores

## 📝 Notas

- Los permisos se obtienen del usuario autenticado desde el AuthService
- Los permisos se consolidan de todos los roles del usuario
- Si el usuario no tiene el permiso, los elementos no se renderizan en el DOM
- Los guards redirigen a `/dashboard` si no se tienen permisos

## 🏗️ Arquitectura

Esta librería es **stateless** - no almacena el estado del usuario.
Lee los permisos reactivamente desde el `currentUser` signal del AuthService.
