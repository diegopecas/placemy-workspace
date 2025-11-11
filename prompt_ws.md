# 📋 PROMPT DE CONTINUACIÓN - PROYECTO PLACEMY-WORKSPACE v5

## 🏗️ CONTEXTO DEL PROYECTO

**PlaceMy Workspace** es un monorepo Nx para el sistema de gestión de restaurantes PlaceMy. Utiliza **Module Federation** para arquitectura de microfrontends, permitiendo desarrollar y desplegar módulos independientes que comparten autenticación, autorización y componentes UI.

---

## 📁 ESTRUCTURA ESTABLECIDA

```
C:\Proyectos\Placemy\placemy-workspace\
├── apps/
│   └── fronthouse/                    # App principal (HOST)
│       ├── public/                    # Archivos estáticos
│       │   ├── favicon.ico
│       │   ├── favicon-16x16.png
│       │   ├── favicon-32x32.png
│       │   ├── favicon-96x96.png
│       │   ├── apple-touch-icon.png
│       │   ├── favicon.svg
│       │   ├── web-app-manifest-*.png
│       │   └── site.webmanifest
│       │
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/              # Servicios singleton, guards, interceptors
│       │   │   │   ├── services/      # auth.service.ts (global)
│       │   │   │   ├── guards/        # auth.guard.ts, no-auth.guard.ts
│       │   │   │   ├── interceptors/  # auth.interceptor.ts
│       │   │   │   └── models/        # auth.model.ts (NO user.model.ts - usa librería)
│       │   │   │
│       │   │   ├── shared/            # ⚠️ DEPRECADO - Componentes ahora en libs/
│       │   │   │   └── components/    # (Mover a @placemy/shared/ui-components)
│       │   │   │
│       │   │   ├── features/          # Módulos de funcionalidad
│       │   │   │   ├── auth/
│       │   │   │   │   └── pages/
│       │   │   │   │       └── login/      # login.component.ts/html/scss
│       │   │   │   └── dashboard/
│       │   │   │       └── pages/
│       │   │   │           └── dashboard/  # dashboard.component.ts/html/scss (CON PERMISOS)
│       │   │   │
│       │   │   ├── app.component.ts        # Componente raíz (configura PermissionService)
│       │   │   ├── app.config.ts           # Configuración con interceptor
│       │   │   └── app.routes.ts           # Rutas con lazy loading
│       │   │
│       │   ├── environments/
│       │   │   ├── environment.ts          # Desarrollo
│       │   │   └── environment.prod.ts     # Producción
│       │   │
│       │   ├── styles.scss                 # Tema Material personalizado
│       │   ├── index.html                  # Con favicons configurados
│       │   └── main.ts
│       │
│       └── project.json                    # Configuración Nx del proyecto
│
├── libs/                                   # Librerías compartidas
│   └── shared/
│       ├── auth/                    # ✅ Autenticación y autorización
│       │   ├── src/
│       │   │   ├── lib/
│       │   │   │   ├── services/
│       │   │   │   │   ├── permission.service.ts  # Servicio de permisos
│       │   │   │   │   └── index.ts
│       │   │   │   ├── guards/
│       │   │   │   │   ├── permission.guard.ts    # Guards de permisos
│       │   │   │   │   └── index.ts
│       │   │   │   ├── directives/
│       │   │   │   │   ├── has-permission.directive.ts  # Directiva *appHasPermission
│       │   │   │   │   └── index.ts
│       │   │   │   └── models/
│       │   │   │       ├── user.model.ts          # Modelo centralizado
│       │   │   │       ├── role.model.ts
│       │   │   │       ├── permission.model.ts
│       │   │   │       └── index.ts
│       │   │   └── index.ts               # Public API
│       │   ├── README.md
│       │   ├── project.json
│       │   ├── tsconfig.json
│       │   ├── tsconfig.lib.json
│       │   └── ng-package.json
│       │
│       └── ui-components/                  # ✅ Componentes UI compartidos ✨ NUEVO
│           ├── src/
│           │   ├── lib/
│           │   │   └── header/
│           │   │       ├── header.component.ts     # Header reutilizable
│           │   │       ├── header.component.html
│           │   │       ├── header.component.scss
│           │   │       └── index.ts
│           │   └── index.ts               # Public API
│           ├── README.md
│           ├── project.json
│           ├── tsconfig.json
│           ├── tsconfig.lib.json
│           └── ng-package.json
│
├── nx.json                                 # Configuración global de Nx
├── package.json
└── tsconfig.base.json                      # Paths: @placemy/shared/auth, @placemy/shared/ui-components
```

---

## 🎨 STACK TECNOLÓGICO

- **Framework**: Angular 19.2.15 (Standalone Components)
- **Monorepo**: Nx 22.0.3
- **Arquitectura**: Module Federation (Microfrontends)
- **UI**: Angular Material 19
- **Estilos**: SCSS + Material Theme personalizado
- **HTTP**: HttpClient con Interceptors
- **Auth**: Token Bearer con Laravel Sanctum
- **Authorization**: Sistema de permisos basado en roles
- **UI Components**: Librería compartida de componentes reutilizables ✨ NUEVO
- **PWA**: Service Worker habilitado
- **Estado**: Signals de Angular
- **Forms**: Reactive Forms
- **Bundler**: esbuild (rápido)
- **Alertas**: SweetAlert2

---

## 🎯 PATRONES Y BUENAS PRÁCTICAS ESTABLECIDAS

1. **Componentes Standalone** (no módulos)
2. **Lazy Loading** en rutas
3. **Guards funcionales** (`CanActivateFn`) para protección de rutas
4. **Interceptor** para agregar token automáticamente
5. **Services en carpeta correcta** según scope:
   - `core/services/` → Servicios globales de la app
   - `libs/shared/*/services/` → Servicios compartidos entre apps
   - `features/[module]/services/` → Servicios del módulo
6. **Estructura de componentes**: 3 archivos (.ts, .html, .scss)
7. **Material Design** con tema personalizado
8. **Signals** para estado reactivo
9. **Module Federation** para apps remotas
10. **Componentes UI en librerías** (`libs/shared/ui-components/`) ✨ NUEVO
11. **Librerías compartidas** en `libs/shared/`
12. **Modelos centralizados** en librerías (evitar duplicación)
13. **Sistema de autorización** basado en permisos

---

## 🌈 TEMA Y COLORES

```scss
// Variables CSS establecidas
:root {
  --primary: #8B2635;        // Rojo vino
  --primary-light: #aa4759;
  --primary-dark: #6e1721;
  
  --accent: #FF6B6B;         // Coral vibrante
  --accent-light: #ff7f7f;
  --accent-dark: #cc3d3d;
  
  --secondary: #17BEBB;      // Turquesa
  --secondary-light: #4dd8d5;
  --secondary-dark: #0e8f8c;
  
  --success: #4caf50;        // Verde
  --warning: #ff9800;        // Naranja
  --danger: #f44336;         // Rojo
  
  // Colores de grises
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
}

// Color del branding (logo)
--brand-gold: #C9975B;       // Dorado PlaceMy
```

---

## 🎨 DISEÑO Y BRANDING

### **Logo y Favicons:**
- Logo principal: Letra "P" con copa martini y pin de ubicación
- Colores: Rojo vino (#8B2635) con detalles dorados (#C9975B)
- Favicons generados con https://favicon.io/
- Logo visible en:
  - Pestaña del navegador (favicon)
  - Header del dashboard
  - Pantalla de login
  - PWA cuando se agrega a inicio

### **Tipografía:**
- Nombre de la app: "PlaceMy" en color dorado (#C9975B)
- Tagline: "Front House" en itálica, mismo color con opacidad
- Fuente: Roboto (Google Fonts)

---

## 🔑 USUARIO DE PRUEBA

```
Username: 42132501
Password: admin123
API Dev: http://127.0.0.1:8000/api
Rol: Super Administrador (tiene todos los permisos)
```

---

## ✅ COMPONENTES COMPLETADOS

### **1. Login** ✓
- Material Design con tema personalizado
- Logo PlaceMy en el header
- Validación de formularios reactivos
- Conexión con backend Laravel
- Manejo de errores con SnackBar
- Signals para estado (isLoading, hidePassword)
- Diseño responsive

### **2. Dashboard** ✓
- **Header desde librería compartida** (@placemy/shared/ui-components) ✨ NUEVO
- Layout moderno con animaciones fadeInUp
- **Tarjetas filtradas por permisos** (solo muestra las que el usuario puede ver)
- Tarjetas de menú principales con efectos hover:
  - **Pedidos** (Rojo vino) - requiere permiso `pedidos.ver`
  - **Mesas** (Turquesa) - requiere permiso `mesas.ver`
  - **Productos** (Coral) - requiere permiso `productos.ver`
  - **Platos** (Rojo vino) - requiere permiso `platos.ver`
  - **Staff** (Turquesa) - requiere permiso `staff.ver`
  - **Configuración** (Coral) - requiere permiso `core.configuraciones.ver`
- Mensaje cuando no hay permisos disponibles
- Información del usuario con avatar gradiente
- Panel de información del sistema y perfil
- Integración con SweetAlert2 para confirmaciones
- Diseño premium con glassmorphism
- Totalmente responsive

### **3. Header Component (Librería UI)** ✓ ✨ NUEVO
- **Ubicación**: `libs/shared/ui-components/src/lib/header/`
- **Import limpio**: `import { HeaderComponent } from '@placemy/shared/ui-components'`
- Logo PlaceMy con nombre en dorado y navegación al dashboard
- Información del usuario (nombre, rol, avatar con iniciales)
- Menú desplegable con opciones:
  - Mi Perfil
  - Dashboard
  - Cerrar Sesión (con confirmación SweetAlert2)
- Sticky positioning
- Responsive (oculta detalles en móvil)
- Usa modelo User de @placemy/shared/auth
- Emite evento 'header-logout' para manejar el logout
- **Reutilizable en todas las apps** (fronthouse, mesas, productos, etc.)
- Configuración reactiva con Signals

### **4. Auth Service** ✓
- Login/Logout
- Manejo de tokens en localStorage
- Refresh token
- Guards funcionando (authGuard, noAuthGuard)
- Interceptor para agregar token automáticamente
- **Usa modelo User de la librería compartida**

### **5. Sistema de Autorización (Librería @placemy/shared/auth)** ✓
- **PermissionService**: Servicio centralizado para verificar permisos
  - `hasPermission(permission: string): boolean`
  - `hasAnyPermission(permissions: string[]): boolean`
  - `hasAllPermissions(permissions: string[]): boolean`
  - `isAdmin(): boolean`
  - `debugPermissions(): void`
- **Permission Guards**: Guards funcionales para proteger rutas
  - `permissionGuard(permission)` - Un solo permiso
  - `permissionGuardAny(permissions)` - Alguno de los permisos (OR)
  - `permissionGuardAll(permissions)` - Todos los permisos (AND)
  - `adminGuard()` - Solo administradores
- **HasPermissionDirective**: Directiva estructural `*appHasPermission`
  - Oculta elementos del DOM si el usuario no tiene permiso
  - Soporta modo 'any' (OR) y 'all' (AND) para múltiples permisos
- **Modelos Centralizados**:
  - `User` - Modelo de usuario con roles y permisos
  - `Role` - Modelo de rol con array de permisos
  - `Permission` - Modelo de permiso
  - `PersonaNatural` - Datos personales del usuario
- **Configurado en AppComponent** para usar en toda la app
- **Documentación completa** en README.md de la librería

### **6. Librería UI Components (@placemy/shared/ui-components)** ✓ ✨ NUEVO
- **HeaderComponent** - Cabecera reutilizable premium
- **Estructura preparada** para agregar más componentes:
  - Footer (futuro)
  - Sidebar (futuro)
  - LoadingSpinner (futuro)
  - EmptyState (futuro)
  - ErrorPages (futuro)
- **Import limpio**: `import { HeaderComponent } from '@placemy/shared/ui-components'`
- **Documentación completa** en README.md

---

## 🔐 SISTEMA DE PERMISOS

### **Estructura de Permisos:**

Los permisos siguen el formato: `{entidad}.{acción}`

**Ejemplos:**
- `mesas.ver` - Ver lista de mesas
- `productos.crear` - Crear nuevos productos
- `platos.editar` - Editar platos existentes
- `staff.eliminar` - Eliminar empleados
- `core.configuraciones.editar` - Editar configuraciones del sistema

### **Cómo funciona:**

1. **El backend** devuelve los permisos en el objeto User:
```json
{
  "id": 1,
  "username": "42132501",
  "roles": [
    {
      "id": 1,
      "nombre": "Super Administrador",
      "permisos": [
        "mesas.ver",
        "mesas.crear",
        "productos.ver",
        "productos.crear"
      ]
    }
  ]
}
```

2. **PermissionService** consolida todos los permisos de todos los roles del usuario

3. **Los componentes** verifican permisos antes de mostrar opciones

### **Uso en el código:**

#### **A) En componentes TypeScript:**
```typescript
import { PermissionService } from '@placemy/shared/auth';

export class MiComponente {
  private permissionService = inject(PermissionService);

  ngOnInit() {
    // Verificar un permiso
    if (this.permissionService.hasPermission('productos.crear')) {
      // Mostrar botón de crear
    }
  }
}
```

#### **B) En rutas (guards):**
```typescript
import { permissionGuard } from '@placemy/shared/auth';

export const routes: Routes = [
  {
    path: 'mesas',
    loadComponent: () => import('./features/mesas/mesas.component'),
    canActivate: [permissionGuard('mesas.ver')]
  }
];
```

#### **C) En templates (directiva):**
```html
<!-- Importar en el componente -->
import { HasPermissionDirective } from '@placemy/shared/auth';

<!-- Usar en el template -->
<button *appHasPermission="'productos.crear'" mat-raised-button>
  Nuevo Producto
</button>
```

---

## 🎨 USO DE COMPONENTES UI COMPARTIDOS ✨ NUEVO

### **HeaderComponent:**

**Import en el componente:**
```typescript
import { Component, ViewChild, effect, inject } from '@angular/core';
import { HeaderComponent } from '@placemy/shared/ui-components';
import { AuthService } from './core/services/auth.service';

@Component({
  imports: [HeaderComponent]
})
export class MiComponente {
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  private authService = inject(AuthService);

  constructor() {
    // Configurar el usuario en el header reactivamente
    effect(() => {
      if (this.header) {
        this.header.setCurrentUser(this.authService.currentUser());
      }
    });

    // Escuchar el evento de logout del header
    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });
  }
}
```

**Usar en el template:**
```html
<app-header></app-header>

<div class="content">
  <!-- Tu contenido aquí -->
</div>
```

---

## 📋 ARQUITECTURA MODULE FEDERATION

### **Conceptos Clave:**

**HOST (fronthouse):**
- App principal que carga y orquesta los módulos remotos
- Contiene el login, dashboard y menú principal
- **Configura el PermissionService una sola vez**
- **Proporciona AuthService a todas las apps**

**REMOTES (mesas, productos, pedidos):**
- Apps Angular independientes
- Se desarrollan y despliegan por separado
- Se cargan dinámicamente cuando el usuario las necesita
- **Usan HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
- **Usan PermissionService sin configuración adicional**
- Comparten código a través de librerías

**SHARED LIBRARIES:**
- `@placemy/shared/auth` → PermissionService, Guards, Directivas, Modelos
- `@placemy/shared/ui-components` → HeaderComponent, Footer (futuro), etc. ✨ NUEVO

---

## 🚀 COMANDOS ÚTILES

### **Desarrollo:**
```bash
# Servidor de desarrollo (fronthouse)
npx nx serve fronthouse
# http://localhost:4200

# Servidor de desarrollo (app remota)
npx nx serve mesas
# http://localhost:4201

# Limpiar cache de Nx (usar después de cambios grandes)
npx nx reset

# Ver estructura del workspace
npx nx graph
```

### **Build:**
```bash
# Build de producción (fronthouse)
npx nx build fronthouse --configuration=production

# Build de las librerías compartidas
npx nx build auth
npx nx build ui-components

# Build de todas las apps
npx nx run-many --target=build --all

# Build solo de apps modificadas
npx nx affected --target=build
```

### **Crear nuevos componentes/apps:**
```bash
# Crear nueva app remota
npx nx g @nx/angular:app [nombre-app] --bundler=esbuild --style=scss --routing=false --ssr=false

# Crear librería compartida
npx nx g @nx/angular:library [nombre-lib] --directory=libs/shared --standalone

# Crear componente standalone
npx nx g @nx/angular:component [nombre] --project=[app] --standalone

# Crear componente en librería UI
mkdir -p libs/shared/ui-components/src/lib/[nombre]
```

---

## 📋 PRÓXIMOS MÓDULOS SUGERIDOS

### **1. Módulo de Mesas** (`apps/mesas/`)
**Backend disponible:** `/api/restaurante/mesas`
- Lista de mesas con estado (disponible, ocupada, reservada)
- Filtros por zona/estado
- Asignar mesa a pedido
- Cambiar estado de mesa
- **Usar HeaderComponent**: `import { HeaderComponent } from '@placemy/shared/ui-components'` ✨ NUEVO
- **Proteger con guard**: `canActivate: [permissionGuard('mesas.ver')]`
- **Botones con permisos**: `*appHasPermission="'mesas.editar'"`

### **2. Módulo de Productos** (`apps/productos/`)
**Backend disponible:** `/api/restaurante/productos`, `/api/restaurante/platos`
- Catálogo de productos/platos
- Filtros por categoría
- Búsqueda
- Gestión de inventario
- **Usar HeaderComponent**: `import { HeaderComponent } from '@placemy/shared/ui-components'` ✨ NUEVO
- **Proteger con guard**: `canActivate: [permissionGuard('productos.ver')]`
- **Botones con permisos**: `*appHasPermission="'productos.crear'"`

---

## 🎨 PATRÓN DE DISEÑO ESTABLECIDO

### **Dashboard y páginas principales:**

**Estructura HTML:**
```html
<div class="[modulo]-container">
  <!-- Header desde librería compartida -->
  <app-header></app-header>

  <!-- Contenido principal -->
  <div class="[modulo]-content">
    <!-- Welcome section -->
    <div class="welcome-section">
      <h2>Título principal</h2>
      <p>Descripción</p>
    </div>

    <!-- Grid de tarjetas o contenido -->
    <div class="content-grid">
      <!-- Contenido específico del módulo -->
    </div>

    <!-- Footer -->
    <footer class="[modulo]-footer">
      <p>© {{ year }} PlaceMy. Todos los derechos reservados.</p>
    </footer>
  </div>
</div>
```

**Estructura TypeScript:**
```typescript
import { Component, ViewChild, effect, inject } from '@angular/core';
import { HeaderComponent } from '@placemy/shared/ui-components';
import { PermissionService } from '@placemy/shared/auth';
import { AuthService } from './core/services/auth.service';

@Component({
  imports: [
    HeaderComponent,
    // ... otros imports
  ]
})
export class MiComponente {
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  private authService = inject(AuthService);
  private permissionService = inject(PermissionService);

  constructor() {
    // Configurar header reactivamente
    effect(() => {
      if (this.header) {
        this.header.setCurrentUser(this.authService.currentUser());
      }
    });

    // Manejar logout
    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });
  }
}
```

---

## 💡 PATRÓN PARA CREAR NUEVO MÓDULO CON UI COMPARTIDA ✨ ACTUALIZADO

### **Paso 1: Imports obligatorios**

```typescript
// Componentes UI
import { HeaderComponent } from '@placemy/shared/ui-components';

// Autorización
import { PermissionService, HasPermissionDirective } from '@placemy/shared/auth';

// Modelos
import { User } from '@placemy/shared/auth';
```

### **Paso 2: Configurar Header en el componente**

```typescript
@Component({
  imports: [HeaderComponent]
})
export class MiComponente {
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      if (this.header) {
        this.header.setCurrentUser(this.authService.currentUser());
      }
    });

    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });
  }
}
```

### **Paso 3: Usar en el template**

```html
<app-header></app-header>

<div class="content">
  <!-- Tu contenido con permisos -->
  <button *appHasPermission="'mesas.crear'">Nueva Mesa</button>
</div>
```

---

## 📐 REGLAS DE ARQUITECTURA

### **Separación de responsabilidades:**

1. **fronthouse (HOST):**
   - Login/Logout
   - Menú principal (Dashboard) con permisos
   - Orquestación de módulos remotos
   - **Configuración única de PermissionService**

2. **Apps remotas (REMOTES):**
   - Funcionalidad específica del dominio
   - **Usan HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
   - **Usan PermissionService sin configuración**
   - **Protegen rutas con guards de permisos**
   - Independientes entre sí

3. **Shared libraries:**
   - `@placemy/shared/auth` → Autorización (permisos, guards, modelos)
   - `@placemy/shared/ui-components` → Componentes UI (Header, Footer, etc.) ✨ NUEVO
   - Exportan API pública clara
   - Documentación en README.md

### **Imports permitidos:**
```typescript
✅ apps/mesas/ → puede importar → @placemy/shared/auth
✅ apps/mesas/ → puede importar → @placemy/shared/ui-components ✨ NUEVO
✅ apps/mesas/ → puede importar → libs/shared/*
❌ apps/mesas/ → NO puede importar → apps/fronthouse/shared/components/ (deprecado)
❌ apps/mesas/ → NO puede importar → apps/productos/
❌ apps/mesas/ → NO puede importar → apps/pedidos/
```

### **CRÍTICO - Modelos y Componentes Centralizados:** ✨ ACTUALIZADO

```typescript
// ✅ SIEMPRE usar desde librerías compartidas
import { User, Role, Permission } from '@placemy/shared/auth';
import { HeaderComponent } from '@placemy/shared/ui-components';

// ❌ NUNCA crear user.model.ts en apps/fronthouse/core/models/
// ❌ NUNCA crear header.component.ts en apps/fronthouse/shared/components/
// ❌ NUNCA duplicar modelos o componentes entre apps
```

---

## 🔧 CONFIGURACIÓN DE ENVIRONMENTS

### **Development:**
```typescript
// apps/fronthouse/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};
```

### **Production:**
```typescript
// apps/fronthouse/src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.placemy.com/api'
};
```

---

## 🔧 CONFIGURACIÓN DE tsconfig.base.json ✨ ACTUALIZADO

```json
{
  "compilerOptions": {
    "paths": {
      "@placemy/shared/auth": ["libs/shared/auth/src/index.ts"],
      "@placemy/shared/ui-components": ["libs/shared/ui-components/src/index.ts"]
    }
  }
}
```

---

## 💡 INSTRUCCIONES PARA EL ASISTENTE

### **Cuando el usuario pida crear un nuevo módulo:**

1. **PREGUNTAR PRIMERO:**
   - ¿Qué módulo quiere crear? (mesas, productos, pedidos, otro)
   - ¿Ya existe el endpoint del backend?
   - ¿Quiere que sea un módulo remoto (Module Federation) o parte de fronthouse?
   - ¿Qué permisos necesita el módulo?

2. **SI ES MÓDULO REMOTO:**
   - Crear la app con Nx generator
   - Configurar Module Federation
   - Crear estructura de carpetas (pages, services, models)
   - **Importar HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
   - **Importar PermissionService, guards y directivas de @placemy/shared/auth**
   - **Configurar Header con ViewChild y effect**
   - **Proteger rutas con permissionGuard**
   - **Usar directiva *appHasPermission en botones de acción**
   - Conectar con fronthouse
   - Compartir autenticación

3. **SI ES FEATURE DE FRONTHOUSE:**
   - Crear carpeta en `features/`
   - **Usar HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
   - **Verificar permisos en el componente**
   - **Proteger ruta con permissionGuard**
   - Agregar lazy route
   - Seguir estructura establecida

4. **SIEMPRE INCLUIR:**
   - **HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
   - **Configuración reactiva del Header con effect()**
   - **Event listener para 'header-logout'**
   - **Verificación de permisos en componentes y templates**
   - **Guards de permisos en rutas**
   - Tema de colores establecido
   - Animaciones fadeInUp
   - Material Design components
   - Manejo de errores con MatSnackBar o SweetAlert2
   - Diseño responsive

5. **IMPORTS OBLIGATORIOS:** ✨ ACTUALIZADO
```typescript
// Componentes UI
import { HeaderComponent } from '@placemy/shared/ui-components';

// Autorización
import { PermissionService, HasPermissionDirective, permissionGuard } from '@placemy/shared/auth';

// Modelos
import { User, Role, Permission } from '@placemy/shared/auth';
```

6. **USAR ANGULAR MATERIAL** siempre
7. **INCLUIR manejo de errores** con MatSnackBar o SweetAlert2
8. **RESPETAR el tema de colores** establecido
9. **NO ASUMIR estructura existente**, siempre verificar
10. **NO DUPLICAR modelos User/Role/Permission** - usar siempre @placemy/shared/auth
11. **NO DUPLICAR Header** - usar siempre @placemy/shared/ui-components ✨ NUEVO

---

## 🎓 LECCIONES APRENDIDAS

### **1. Nx Workspace:**
- Usar `npx nx` en lugar de `nx` (si no está instalado globalmente)
- Siempre usar `npx nx reset` después de cambios grandes
- Los archivos se cachean, a veces hay que reiniciar el servidor
- Si un componente no se detecta, detener servidor, hacer `nx reset`, y reiniciar

### **2. Module Federation:**
- El HOST (fronthouse) debe estar corriendo para que los remotos funcionen
- Los remotos se sirven en puertos diferentes (4201, 4202, etc.)
- Las rutas se cargan dinámicamente, no hay recarga de página
- **HeaderComponent se comparte desde librería, no desde fronthouse** ✨ NUEVO

### **3. Angular 19:**
- Usar componentes standalone (no NgModules)
- Guards funcionales (`CanActivateFn`) en lugar de clases
- `provideAnimationsAsync()` está deprecated pero funciona (ignorar warning)
- **Imports desde librerías con aliases limpios** (@placemy/shared/*) ✨ NUEVO
- **Signals computados son ideales para permisos reactivos**
- **ViewChild + effect() para configuración reactiva de componentes** ✨ NUEVO

### **4. Estructura de carpetas:**
- `core/` → Servicios globales (singleton) de la app específica
- `shared/` → **DEPRECADO** - Ahora usar `libs/shared/ui-components/` ✨ NUEVO
- `features/` → Módulos de funcionalidad
- `libs/shared/` → Código compartido entre apps (CRÍTICO)
- `libs/shared/auth/` → Autorización y modelos
- `libs/shared/ui-components/` → Componentes UI compartidos ✨ NUEVO
- `public/` → Archivos estáticos (favicons, imágenes)

### **5. Componentes compartidos:** ✨ ACTUALIZADO
- **SIEMPRE crear en `libs/shared/ui-components/`** ✨ NUEVO
- **NUNCA en `apps/fronthouse/shared/components/`** (deprecado)
- Usar imports desde `@placemy/shared/ui-components`
- Hacer standalone y exportar claramente
- Documentar en README.md con ejemplos de uso
- Configurar con ViewChild cuando sea necesario

### **6. Modelos centralizados:**
- **NUNCA duplicar** modelos User, Role, Permission
- **SIEMPRE usar** `import { User } from '@placemy/shared/auth'`
- Los modelos específicos de la app (como AuthResponse, LoginRequest) van en `core/models/`
- **Borrar** `user.model.ts` de `core/models/` si existe

### **7. Sistema de Permisos:**
- Configurar PermissionService **UNA SOLA VEZ** en AppComponent
- Usar `computed()` para verificaciones reactivas de permisos
- Proteger rutas con `permissionGuard()` antes de crear el componente
- Usar directiva `*appHasPermission` para ocultar elementos sin permisos
- Formato de permisos: `{entidad}.{acción}` (ej: `mesas.ver`, `productos.crear`)

### **8. Header Component:** ✨ NUEVO
- **Usar siempre desde @placemy/shared/ui-components**
- Configurar con `@ViewChild(HeaderComponent)` y `effect()`
- Escuchar evento `'header-logout'` para manejar el logout
- Llamar `header.setCurrentUser()` para actualizar info del usuario
- No asumir que el header está disponible en constructor (usar effect)

---

## ❓ INSTRUCCIONES PARA LA PRÓXIMA SESIÓN

**Indica al asistente:**

1. **Si quieres crear un módulo remoto:**
   ```
   Quiero crear el módulo remoto MESAS con Module Federation.
   Debe conectarse al endpoint /api/restaurante/mesas.
   Debe usar HeaderComponent desde @placemy/shared/ui-components.
   Debe verificar permisos: mesas.ver, mesas.crear, mesas.editar, mesas.eliminar
   Sigue el patrón establecido en el workspace.
   ```

2. **Si quieres agregar un componente UI a la librería:**
   ```
   Quiero crear un componente Footer en @placemy/shared/ui-components.
   Debe ser reutilizable en todas las apps.
   Debe seguir el patrón del HeaderComponent.
   ```

3. **Si quieres crear una feature en fronthouse:**
   ```
   Quiero agregar la funcionalidad de PERFIL DE USUARIO en fronthouse.
   Como una feature más, no como módulo remoto.
   Debe usar HeaderComponent desde @placemy/shared/ui-components.
   Debe verificar permisos necesarios.
   ```

4. **Recuerda SIEMPRE indicar:**
   - Que respete las preferencias de desarrollo (no asumir, preguntar antes de codificar)
   - Que siga la arquitectura Nx con Module Federation establecida
   - Que use Angular Material con el tema personalizado
   - **Que use HeaderComponent desde @placemy/shared/ui-components** ✨ NUEVO
   - **Que configure el Header con ViewChild + effect()** ✨ NUEVO
   - Que verifique permisos usando @placemy/shared/auth
   - Que NO duplique modelos User/Role/Permission
   - **Que NO duplique componentes UI** ✨ NUEVO
   - Que verifique los archivos existentes antes de crear nuevos

---

## 📚 ARQUITECTURA ESTABLECIDA

**Principios clave:**
1. ✅ Monorepo Nx con múltiples apps
2. ✅ Module Federation para microfrontends
3. ✅ Código compartido a través de librerías
4. ✅ **Componentes UI en librería @placemy/shared/ui-components** ✨ NUEVO
5. ✅ Lazy loading de módulos remotos
6. ✅ Autenticación compartida entre apps
7. ✅ Autorización basada en permisos compartida entre apps
8. ✅ Standalone components (Angular 19)
9. ✅ Material Design con tema personalizado
10. ✅ Branding consistente (logo PlaceMy en dorado)
11. ✅ Deploy independiente de cada app
12. ✅ Desarrollo en paralelo de múltiples módulos
13. ✅ Escalabilidad horizontal (agregar apps sin afectar las existentes)
14. ✅ Modelos centralizados en librerías (no duplicación)
15. ✅ **Componentes UI centralizados en librería** (no duplicación) ✨ NUEVO

---

## 🔗 RECURSOS

- **Repo Git:** https://github.com/[tu-usuario]/placemy-workspace
- **Documentación Nx:** https://nx.dev
- **Module Federation:** https://module-federation.io/
- **Angular Material:** https://material.angular.io/
- **Favicon Generator:** https://favicon.io/
- **Librería de Permisos:** `libs/shared/auth/README.md`
- **Librería UI Components:** `libs/shared/ui-components/README.md` ✨ NUEVO

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### **Completado:**
✅ Workspace Nx configurado  
✅ App fronthouse (HOST) funcionando  
✅ Login con autenticación Laravel Sanctum  
✅ Dashboard con diseño premium y filtrado por permisos  
✅ **HeaderComponent en librería compartida (@placemy/shared/ui-components)** ✨ NUEVO  
✅ Logo y favicons implementados  
✅ AuthService con manejo de tokens  
✅ Guards funcionales (authGuard, noAuthGuard)  
✅ Interceptor para agregar token automáticamente  
✅ Tema Material personalizado  
✅ Branding PlaceMy establecido (colores, tipografía, logo)  
✅ Estructura de carpetas establecida  
✅ Componentes con animaciones y efectos premium  
✅ Librería @placemy/shared/auth completa  
✅ PermissionService funcionando  
✅ Permission Guards (permissionGuard, adminGuard, etc.)  
✅ Directiva *appHasPermission  
✅ Modelos centralizados (User, Role, Permission)  
✅ Dashboard muestra opciones según permisos del usuario  
✅ **Librería @placemy/shared/ui-components creada** ✨ NUEVO  
✅ **HeaderComponent reutilizable en librería** ✨ NUEVO  
✅ **Dashboard actualizado para usar Header desde librería** ✨ NUEVO  
✅ **tsconfig.base.json con paths de ambas librerías** ✨ NUEVO  

### **Por hacer:**
⏭️ Configurar Module Federation en fronthouse  
⏭️ Crear app remota "mesas" con HeaderComponent de librería ✨ ACTUALIZADO  
⏭️ Conectar fronthouse con mesas  
⏭️ Crear componente Footer en @placemy/shared/ui-components ✨ NUEVO  
⏭️ Crear app remota "productos" con HeaderComponent de librería ✨ ACTUALIZADO  
⏭️ Crear app remota "pedidos" con HeaderComponent de librería ✨ ACTUALIZADO  
⏭️ Migrar componentes de apps/fronthouse/shared a librería (si existen) ✨ NUEVO  

---

## 🆕 CAMBIOS EN ESTA VERSIÓN (v4)

### **Nuevas Funcionalidades:**
1. ✅ Librería compartida `@placemy/shared/ui-components` creada
2. ✅ HeaderComponent movido a la librería
3. ✅ Import limpio: `import { HeaderComponent } from '@placemy/shared/ui-components'`
4. ✅ Configuración reactiva del Header con ViewChild + effect()
5. ✅ Evento 'header-logout' para manejar el logout
6. ✅ Dashboard actualizado para usar Header desde librería
7. ✅ Path agregado en tsconfig.base.json
8. ✅ Documentación completa del HeaderComponent

### **Cambios Estructurales:**
1. ✅ Creada carpeta `libs/shared/ui-components/`
2. ✅ HeaderComponent ahora en librería (no en apps/fronthouse/shared)
3. ✅ Deprecado `apps/fronthouse/shared/components/` (usar librería)
4. ✅ Agregado path `@placemy/shared/ui-components` en tsconfig.base.json
5. ✅ Dashboard actualizado con nuevo import del Header
6. ✅ Configuración reactiva del Header con Signals

### **Mejoras Arquitecturales:**
1. ✅ Componentes UI verdaderamente compartidos entre apps
2. ✅ Imports limpios sin rutas relativas largas
3. ✅ Preparado para agregar más componentes UI (Footer, Sidebar, etc.)
4. ✅ Documentación clara de cómo usar cada componente
5. ✅ Patrón establecido para futuros componentes UI

### **Deprecaciones:**
1. ⚠️ `apps/fronthouse/shared/components/header/` → Usar `@placemy/shared/ui-components`
2. ⚠️ Imports relativos del Header → Usar import desde librería

---

## 🆕 CAMBIOS EN ESTA VERSIÓN (v5)

### **Refactoring de Naming:**
1. ✅ Renombrado `libs/shared/shared-auth/` → `libs/shared/auth/` ✨ NUEVO
2. ✅ Eliminado prefijo redundante "shared-" de la librería de autenticación
3. ✅ Consistencia en naming: `auth/` y `ui-components/` (sin prefijo redundante)
4. ✅ Actualizado project.json, ng-package.json de la librería auth
5. ✅ Path en tsconfig.base.json actualizado: `libs/shared/auth/src/index.ts`

### **Impacto de los Cambios:**
- ✅ **Los imports NO cambian**: Siguen siendo `import { ... } from '@placemy/shared/auth'`
- ✅ Solo cambia la estructura de carpetas (backend)
- ✅ Alias `@placemy/shared/auth` se mantiene igual (frontend)

### **Convención de Naming Establecida:**
```
✅ CORRECTO:
libs/shared/auth/              (sin prefijo "shared-")
libs/shared/ui-components/     (sin prefijo "shared-")
libs/shared/utils/             (futuro - sin prefijo)

❌ INCORRECTO:
libs/shared/shared-auth/       (prefijo redundante)
libs/shared/shared-ui/         (prefijo redundante)
```

### **Ventajas del Cambio:**
1. ✅ Nombres más limpios y concisos
2. ✅ Consistencia en toda la arquitectura
3. ✅ Sigue estándares de Nx/Angular
4. ✅ Más fácil de entender para nuevos desarrolladores
5. ✅ Escalable para futuras librerías

---

**FIN DEL PROMPT DE CONTINUACIÓN - v5** ✨ REFACTORING DE NAMING PARA CONSISTENCIA