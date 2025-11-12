# 📋 PROMPT DE CONTINUACIÓN - PROYECTO PLACEMY-WORKSPACE v6.1

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
│       └── ui-components/                  # ✅ Componentes UI compartidos ✨
│           ├── src/
│           │   ├── lib/
│           │   │   ├── header/
│           │   │   │   ├── header.component.ts     # Header reutilizable
│           │   │   │   ├── header.component.html
│           │   │   │   ├── header.component.scss
│           │   │   │   └── index.ts
│           │   │   └── services/
│           │   │       └── theme.service.ts        # ✨ Servicio de temas ✨ NUEVO v6
│           │   ├── styles/                         # ✨ Sistema de theming ✨ NUEVO v6
│           │   │   ├── _animations.scss            # Animaciones compartidas
│           │   │   ├── _particles.scss             # Partículas flotantes
│           │   │   ├── index.scss                  # Export principal
│           │   │   └── themes/
│           │   │       ├── _base.scss              # Tema base (5 meses)
│           │   │       ├── _mothers-day.scss       # Mayo
│           │   │       ├── _fathers-day.scss       # Junio
│           │   │       ├── _colombia-independence.scss # Julio
│           │   │       ├── _kites.scss             # Agosto
│           │   │       ├── _love-friendship.scss   # Septiembre
│           │   │       ├── _halloween.scss         # Octubre
│           │   │       └── _christmas.scss         # Diciembre
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
- **Theming**: Sistema automático de temas por mes ✨ NUEVO v6
- **HTTP**: HttpClient con Interceptors
- **Auth**: Token Bearer con Laravel Sanctum
- **Authorization**: Sistema de permisos basado en roles
- **UI Components**: Librería compartida de componentes reutilizables
- **PWA**: Service Worker habilitado
- **Estado**: Signals de Angular
- **Forms**: Reactive Forms
- **Bundler**: esbuild (rápido)
- **Alertas**: SweetAlert2
- **Animaciones**: Sistema de animaciones temáticas compartidas ✨ NUEVO v6

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


---

## 🎨 SISTEMA DE THEMING AUTOMÁTICO ✨ NUEVO v6

### **Calendario de Temas por Mes:**

PlaceMy cambia automáticamente su apariencia según el mes del año:

| Mes | Tema | Colores | Iconos Decorativos |
|-----|------|---------|-------------------|
| Enero, Febrero, Marzo, Abril, Noviembre | **Base** | Rojo vino, Dorado | 🍴 🍽️ 🥘 🍷 🍕 🍔 |
| Mayo | **Día de la Madre** | Rosa, Fucsia | 💐 🌸 🌺 💝 🎀 🌹 💕 |
| Junio | **Día del Padre** | Azul marino, Celeste | 👔 🎩 ⚽ 🏆 🎁 🎯 💼 |
| Julio | **Independencia de Colombia** | Amarillo, Azul, Rojo | 🇨🇴 ☕ 🌺 🎺 🎉 🎊 🏛️ |
| Agosto | **Festival de Cometas** | Celeste, Arcoíris | 🪁 ☁️ 🌈 ☀️ 💨 🎨 🦋 |
| Septiembre | **Amor y Amistad** | Rojo, Rosa | ❤️ 💕 🌹 💝 💘 💖 🎈 |
| Octubre | **Halloween** | Morado, Naranja | 🎃 👻 🦇 🕷️ 🕸️ 💀 🌙 |
| Diciembre | **Navidad** | Verde, Rojo | 🎄 ⛄ 🎅 🎁 ❄️ ⭐ 🔔 |

### **Características:**

1. ✅ **Cambio Automático**: Detecta el mes y aplica el tema correspondiente
2. ✅ **Partículas Flotantes**: Iconos temáticos animados que flotan por la pantalla
3. ✅ **Animaciones Compartidas**: 20+ animaciones reutilizables entre apps
4. ✅ **Variables CSS Globales**: Colores accesibles en todos los componentes
5. ✅ **Efectos Especiales**: Nieve (Navidad), Corazones (Amor), Cometas (Agosto), etc.
6. ✅ **Responsive**: Optimizado para móvil y desktop
7. ✅ **Una Sola Fuente**: No duplicar estilos, todo centralizado en la librería

### **Uso del ThemeService:**

```typescript
// En cualquier componente
import { Component, inject, computed } from '@angular/core';
import { ThemeService } from '@placemy/shared/ui-components';

@Component({
  selector: 'app-dashboard',
  template: `
    <div [attr.data-theme]="currentTheme().name">
      <!-- Partículas flotantes automáticas -->
      <div class="floating-particles">
        <div *ngFor="let p of floatingParticles()" 
             class="theme-particle"
             [style.left.%]="p.x"
             [style.top.%]="p.y">
          {{ p.icon }}
        </div>
      </div>

      <!-- Tu contenido -->
      <h1>{{ currentTheme().title }}</h1>
      <p>{{ currentTheme().subtitle }}</p>
    </div>
  `
})
export class DashboardComponent {
  private themeService = inject(ThemeService);
  
  // Tema actual reactivo
  currentTheme = this.themeService.currentTheme;

  // Generar partículas basadas en el tema
  floatingParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      icon: theme.decorativeElements[Math.floor(Math.random() * theme.decorativeElements.length)]
    }));
  });
}
```

### **Importar Estilos en Apps:**

```scss
// apps/fronthouse/src/styles.scss
@use '../../libs/shared/ui-components/src/styles' as placemy;

// Ya tienes acceso a:
// - Todas las animaciones
// - Todas las variables CSS por tema
// - Partículas flotantes, nubes, estrellas
// - Efectos especiales por tema
```

### **Animaciones Disponibles:**

```html
<!-- Fade in up -->
<div class="fade-in-up">Contenido</div>

<!-- Pulse -->
<div class="pulse-animation">Botón</div>

<!-- Float -->
<div class="float-animation">Icono flotante</div>

<!-- Glow -->
<div class="glow-animation">Elemento brillante</div>
```

### **Variables CSS por Tema:**

```scss
// En cualquier componente SCSS
.mi-elemento {
  background: var(--primary);
  color: var(--accent);
  border: 1px solid var(--primary-light);
}

// Variables disponibles:
// --primary, --primary-light, --primary-dark
// --accent, --accent-light, --accent-dark
// --secondary, --brand-gold
// --background, --text
```

### **Estructura de Archivos de Theming:**

```
libs/shared/ui-components/src/
├── lib/services/
│   └── theme.service.ts          # Servicio TypeScript con lógica de temas
│
└── styles/
    ├── _animations.scss          # fadeInUp, floatUp, twinkle, pulse, etc.
    ├── _particles.scss           # Partículas flotantes, nubes, estrellas
    ├── index.scss                # Export principal
    └── themes/
        ├── _base.scss            # Tema base (5 meses)
        ├── _mothers-day.scss     # Mayo
        ├── _fathers-day.scss     # Junio
        ├── _colombia-independence.scss # Julio
        ├── _kites.scss           # Agosto
        ├── _love-friendship.scss # Septiembre
        ├── _halloween.scss       # Octubre
        └── _christmas.scss       # Diciembre
```

### **Ventajas sobre Código Duplicado:**

| Antes (Sin theming) | Ahora (Con theming) |
|---------------------|---------------------|
| ❌ Estilos duplicados en cada componente | ✅ Una sola fuente de verdad |
| ❌ Cambiar 50 archivos para actualizar | ✅ Cambiar 1 archivo |
| ❌ Inconsistencias entre componentes | ✅ 100% consistente |
| ❌ Temas hardcoded en cada lugar | ✅ Automático por mes |
| ❌ Difícil de mantener | ✅ Fácil de mantener |
| ❌ No escalable | ✅ Agregar temas es trivial |

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



---

## 🚨 TROUBLESHOOTING DEL SISTEMA DE THEMING

### **Error: "Can't find stylesheet to import"**

**Problema:** El `index.scss` intenta importar archivos de temas que no existen.

**Solución:** Actualizar `libs/shared/ui-components/src/styles/index.scss`:

```scss
// ✅ CORRECTO - Solo importar temas que existen
@use './animations';
@use './particles';
@use './themes/base';
@use './themes/halloween';
@use './themes/christmas';

// ❌ NO importar temas que aún no se crearon:
// @use './themes/mothers-day';      // No existe todavía
// @use './themes/fathers-day';      // No existe todavía
// etc.
```

---

### **Error: "Property 'base' comes from an index signature"**

**Problema:** TypeScript strict mode requiere acceso con corchetes.

**Solución:** En `theme.service.ts`, usar corchetes:

```typescript
// ❌ ANTES
return this.themes.base;

// ✅ DESPUÉS
return this.themes['base'];
```

---

### **Error: "Cannot read properties of undefined (reading 'base')"**

**Problema:** Orden incorrecto de inicialización de propiedades.

**Solución:** En `theme.service.ts`, definir `themes` ANTES del signal:

```typescript
// ✅ CORRECTO - themes primero
private readonly themes: Record<string, ThemeConfig> = { ... };
private _currentTheme = signal<ThemeConfig>(this.getThemeByDate());

// ❌ INCORRECTO - signal primero
private _currentTheme = signal<ThemeConfig>(this.getThemeByDate());
private readonly themes: Record<string, ThemeConfig> = { ... };
```

---

### **Warning: "Sass @import rules are deprecated"**

**Problema:** Uso de `@import` en lugar de `@use`.

**Solución:** Cambiar todos los `@import` por `@use`:

```scss
// ❌ VIEJO
@import './animations';

// ✅ NUEVO
@use './animations';
```

---

### **El tema no se ve visualmente**

**Problema:** Falta aplicar el atributo `data-theme` o importar los estilos.

**Solución:**

1. **En el HTML del componente:**
```html
<div class="dashboard-container" [attr.data-theme]="currentTheme().name">
```

2. **En `apps/fronthouse/src/styles.scss`:**
```scss
@use '../../../libs/shared/ui-components/src/styles' as placemy;
```

3. **Verificar la ruta:** Desde `apps/fronthouse/src/styles.scss` son **3 niveles** hacia arriba (`../../../`).

---

### **Las partículas flotantes no se ven**

**Problema:** Falta agregar el código de las partículas en el componente.

**Solución:** Agregar en el TypeScript:

```typescript
// Generar partículas basadas en el tema
floatingParticles = computed(() => {
  const theme = this.currentTheme();
  return Array.from({ length: 20 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10,
    icon: theme.decorativeElements[Math.floor(Math.random() * theme.decorativeElements.length)]
  }));
});
```

Y en el HTML:

```html
<div class="floating-particles">
  <div *ngFor="let p of floatingParticles()" 
       class="theme-particle"
       [style.left.%]="p.x"
       [style.top.%]="p.y"
       [style.animation-delay.s]="p.delay">
    {{ p.icon }}
  </div>
</div>
```

---

### **El ThemeService no está disponible**

**Problema:** No se exportó desde la librería.

**Solución:** En `libs/shared/ui-components/src/index.ts`:

```typescript
// Componentes
export * from './lib/header';

// Servicios
export * from './lib/services/theme.service';  // ← Debe estar
```

---

### **Página en blanco después de agregar ThemeService**

**Problema:** Error en runtime, revisar consola del navegador.

**Soluciones comunes:**
1. Verificar que el servicio esté exportado
2. Limpiar cache: `npx nx reset`
3. Verificar orden de inicialización en theme.service.ts
4. Revisar errores en consola del navegador (F12)

---
## 🆕 CAMBIOS EN ESTA VERSIÓN (v6)

### **Sistema de Theming Completo:** ✨ NUEVO
1. ✅ ThemeService con detección automática por mes
2. ✅ 8 temas configurados (base, madres, padres, colombia, cometas, amor, halloween, navidad)
3. ✅ Animaciones compartidas (_animations.scss) con 20+ animaciones
4. ✅ Partículas flotantes compartidas (_particles.scss)
5. ✅ Variables CSS globales por tema
6. ✅ Efectos especiales por tema (nieve, corazones, cometas, etc.)
7. ✅ Sistema completamente centralizado en librería

### **Cambios Estructurales:**
1. ✅ Agregado `libs/shared/ui-components/src/lib/services/theme.service.ts`
2. ✅ Agregado `libs/shared/ui-components/src/styles/` con sistema completo
3. ✅ Creados 8 archivos de temas en `styles/themes/`
4. ✅ Export de ThemeService desde librería ui-components

### **Mejoras Arquitecturales:**
1. ✅ Estilos compartidos entre TODAS las apps (no duplicación)
2. ✅ Cambio automático de tema según mes del año
3. ✅ Una sola fuente de verdad para temas y animaciones
4. ✅ Fácil agregar nuevos temas (solo crear archivo SCSS)
5. ✅ Variables CSS accesibles en todos los componentes
6. ✅ Animaciones reutilizables con clases simples
7. ✅ Inspirado en proyecto Lumen pero mejorado y centralizado

### **Uso Simple:**
```typescript
// Import
import { ThemeService } from '@placemy/shared/ui-components';

// Usar
currentTheme = this.themeService.currentTheme;

// Aplicar
<div [attr.data-theme]="currentTheme().name">
```

```scss
// Import en styles.scss
@use '../../libs/shared/ui-components/src/styles' as placemy;

// Ya tienes todo: animaciones, partículas, variables CSS
```

### **Impacto:**
- ✅ **Sin duplicación de código** entre apps
- ✅ **Mantenimiento trivial** (cambiar 1 archivo, no 50)
- ✅ **Consistencia total** entre todas las apps
- ✅ **Experiencia premium** con animaciones y temas
- ✅ **Escalable** para agregar más temas fácilmente

---

## 📊 COMPARACIÓN DE VERSIONES

| Aspecto | v5 | v6 |
|---------|----|----|
| Librerías | auth + ui-components | auth + ui-components ✅ |
| Theming | ❌ No | ✅ Sistema completo ✨ |
| Animaciones | ❌ Duplicadas por app | ✅ Compartidas (_animations.scss) ✨ |
| Partículas | ❌ No | ✅ Sistema de partículas flotantes ✨ |
| Temas por mes | ❌ No | ✅ 8 temas automáticos ✨ |
| Variables CSS | ❌ Duplicadas | ✅ Centralizadas por tema ✨ |
| ThemeService | ❌ No | ✅ Servicio reactivo con Signals ✨ |

---

**FIN DEL PROMPT DE CONTINUACIÓN - v6** ✨ SISTEMA DE THEMING COMPLETO

---

## 🆕 CAMBIOS v6 → v6.1 (Hotfix)

### **Correcciones Críticas:**
1. ✅ **index.scss corregido** - Eliminados imports de archivos inexistentes
2. ✅ **@import → @use** - Cambiado a sintaxis moderna de SASS
3. ✅ **Mixins eliminados** - Removidos mixins que no existen
4. ✅ **Solo 3 temas activos** - base, halloween, christmas
5. ✅ **Sección de Troubleshooting** - Guía de solución de problemas comunes

### **Archivos Actualizados:**
- `libs/shared/ui-components/src/styles/index.scss` - Limpio y funcional
- `libs/shared/ui-components/src/lib/services/theme.service.ts` - Orden correcto de inicialización

### **index.scss v6.1:**
```scss
// ✅ Solo importa archivos que existen
@use './animations';
@use './particles';
@use './themes/base';
@use './themes/halloween';
@use './themes/christmas';

// Clases útiles incluidas
// Animaciones inline por compatibilidad
// Sin referencias a archivos inexistentes
```

### **Problemas Resueltos:**
- ✅ Error "Can't find stylesheet to import"
- ✅ Warnings de @import deprecado
- ✅ Mixins inexistentes removidos
- ✅ Sistema funcional con 3 temas

### **Estado Actual:**
- 🎨 **3 temas funcionando**: base, halloween, christmas
- 🚀 **5 temas por crear**: mothers-day, fathers-day, colombia-independence, kites, love-friendship
- ✅ **Sistema estable** y listo para producción
- 📚 **Troubleshooting completo** documentado

---

**FIN DEL PROMPT DE CONTINUACIÓN - v6.1** ✨ SISTEMA DE THEMING ESTABLE Y FUNCIONAL