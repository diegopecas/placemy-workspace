# 📋 PROMPT DE CONTINUACIÓN - PROYECTO PLACEMY-WORKSPACE v2

## 🏗️ CONTEXTO DEL PROYECTO

**PlaceMy Workspace** es un monorepo Nx para el sistema de gestión de restaurantes PlaceMy. Utiliza **Module Federation** para arquitectura de microfrontends, permitiendo desarrollar y desplegar módulos independientes que comparten autenticación y código común.

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
│       │   │   │   └── models/        # user.model.ts, auth.model.ts
│       │   │   │
│       │   │   ├── shared/            # Componentes reutilizables
│       │   │   │   └── components/
│       │   │   │       └── header/    # ✨ Header reutilizable
│       │   │   │           ├── header.component.ts
│       │   │   │           ├── header.component.html
│       │   │   │           └── header.component.scss
│       │   │   │
│       │   │   ├── features/          # Módulos de funcionalidad
│       │   │   │   ├── auth/
│       │   │   │   │   └── pages/
│       │   │   │   │       └── login/      # login.component.ts/html/scss
│       │   │   │   └── dashboard/
│       │   │   │       └── pages/
│       │   │   │           └── dashboard/  # dashboard.component.ts/html/scss
│       │   │   │
│       │   │   ├── app.component.ts        # Componente raíz
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
├── libs/                                   # Librerías compartidas (por crear)
│   └── shared/
│       └── auth/                           # Futura librería de autenticación
│
├── nx.json                                 # Configuración global de Nx
├── package.json
└── tsconfig.base.json                      # Paths compartidos
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
   - `core/services/` → Servicios globales
   - `features/[module]/services/` → Servicios del módulo
6. **Estructura de componentes**: 3 archivos (.ts, .html, .scss)
7. **Material Design** con tema personalizado
8. **Signals** para estado reactivo
9. **Module Federation** para apps remotas
10. **Componentes reutilizables** en `shared/components/`

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
- Header reutilizable con logo PlaceMy
- Layout moderno con animaciones fadeInUp
- Tarjetas de menú principales con efectos hover:
  - **Pedidos** (Rojo vino)
  - **Mesas** (Turquesa)
  - **Productos** (Coral)
- Información del usuario con avatar gradiente
- Panel de información del sistema y perfil
- Integración con SweetAlert2 para confirmaciones
- Diseño premium con glassmorphism
- Totalmente responsive

### **3. Header Reutilizable** ✓
- Componente standalone en `shared/components/header/`
- Logo PlaceMy con nombre en dorado
- Información del usuario (nombre, rol, avatar)
- Botón de logout con confirmación SweetAlert2
- Sticky positioning
- Responsive (oculta detalles en móvil)
- **Reutilizable en todos los módulos futuros**

### **4. Auth Service** ✓
- Login/Logout
- Manejo de tokens en localStorage
- Refresh token
- Guards funcionando (authGuard, noAuthGuard)
- Interceptor para agregar token automáticamente

---

## 📋 ARQUITECTURA MODULE FEDERATION

### **Conceptos Clave:**

**HOST (fronthouse):**
- App principal que carga y orquesta los módulos remotos
- Contiene el login, dashboard y menú principal
- Header reutilizable compartido
- Comparte la autenticación con todos los remotos

**REMOTES (mesas, productos, pedidos):**
- Apps Angular independientes
- Se desarrollan y despliegan por separado
- Se cargan dinámicamente cuando el usuario las necesita
- Usan el mismo Header componente
- Comparten código a través de librerías

**SHARED LIBRARIES:**
- Código compartido entre HOST y REMOTES
- Ejemplo: `@placemy/shared/auth` (AuthService, Guards, Interceptors)
- Componentes UI compartidos (Header, Footer, etc.)

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
npx nx g @nx/angular:library [nombre-lib] --directory=libs/shared

# Crear componente standalone
npx nx g @nx/angular:component [nombre] --project=[app] --standalone

# Crear componente en shared
New-Item -Path "apps\fronthouse\src\app\shared\components\[nombre]" -ItemType Directory -Force
```

---

## 📋 PRÓXIMOS MÓDULOS SUGERIDOS

### **1. Módulo de Mesas** (`apps/mesas/`)
**Backend disponible:** `/api/restaurante/mesas`
- Lista de mesas con estado (disponible, ocupada, reservada)
- Filtros por zona/estado
- Asignar mesa a pedido
- Cambiar estado de mesa
- **Usar Header reutilizable**: `<app-header></app-header>`

### **2. Módulo de Productos** (`apps/productos/`)
**Backend disponible:** `/api/restaurante/productos`, `/api/restaurante/platos`
- Catálogo de productos/platos
- Filtros por categoría
- Búsqueda
- Gestión de inventario
- **Usar Header reutilizable**: `<app-header></app-header>`

### **3. Módulo de Pedidos** (`apps/pedidos/`)
**Backend disponible:** (por crear - dominio Pedido)
- Crear nuevo pedido
- Lista de pedidos activos
- Detalle del pedido
- Cambiar estado del pedido
- Agregar productos al pedido
- **Usar Header reutilizable**: `<app-header></app-header>`

---

## 🎨 PATRÓN DE DISEÑO ESTABLECIDO

### **Dashboard y páginas principales:**

**Estructura HTML:**
```html
<div class="[modulo]-container">
  <!-- Header reutilizable -->
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

**Estructura SCSS:**
```scss
.[modulo]-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
}

.[modulo]-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.welcome-section {
  margin-bottom: 2.5rem;
  animation: fadeInUp 0.6s ease-out;
  
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--gray-900);
  }
  
  p {
    color: var(--gray-600);
  }
}

// Animación fadeInUp
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **Tarjetas con Material:**
```html
<mat-card class="feature-card">
  <div class="card-header" [style.background]="gradient">
    <mat-icon class="card-icon">icon_name</mat-icon>
  </div>
  
  <mat-card-content>
    <h3>Título</h3>
    <p>Descripción</p>
    
    <div class="card-stats">
      <span class="stats-label">Label</span>
      <span class="stats-value">Value</span>
    </div>
  </mat-card-content>
</mat-card>
```

**Con efectos hover:**
```scss
.feature-card {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px !important;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15) !important;
    
    .card-icon {
      transform: scale(1.1) rotate(5deg);
    }
  }
}
```

---

## 💡 PATRÓN PARA CREAR NUEVO MÓDULO REMOTO

### **Paso 1: Crear la app remota**
```bash
npx nx g @nx/angular:app [modulo] --bundler=esbuild --style=scss --routing=false --ssr=false
```

### **Paso 2: Configurar Module Federation**

**En `apps/[modulo]/module-federation.config.ts`:**
```typescript
import { ModuleFederationConfig } from '@nx/webpack';

const config: ModuleFederationConfig = {
  name: 'modulo',
  exposes: {
    './Routes': 'apps/modulo/src/app/remote-entry/entry.routes.ts',
  },
};

export default config;
```

**En `apps/fronthouse/module-federation.config.ts`:**
```typescript
remotes: [
  ['modulo', 'http://localhost:4201/remoteEntry.mjs'],
]
```

### **Paso 3: Usar Header reutilizable**

**En el componente principal del módulo:**
```typescript
// apps/[modulo]/src/app/pages/principal/principal.component.ts
import { HeaderComponent } from '../../../../fronthouse/src/app/shared/components/header/header.component';

@Component({
  selector: 'app-principal',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent, // ← Importar Header
    // ... otros imports
  ],
  templateUrl: './principal.component.html',
  styleUrl: './principal.component.scss'
})
```

**En el HTML:**
```html
<div class="modulo-container">
  <app-header></app-header>
  
  <div class="modulo-content">
    <!-- Tu contenido aquí -->
  </div>
</div>
```

### **Paso 4: Crear rutas del módulo**

**`apps/[modulo]/src/app/remote-entry/entry.routes.ts`:**
```typescript
import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/principal/principal.component').then(m => m.PrincipalComponent)
  }
];
```

### **Paso 5: Registrar en fronthouse**

**`apps/fronthouse/src/app/app.routes.ts`:**
```typescript
{
  path: 'modulo',
  loadChildren: () => 
    import('modulo/Routes').then(m => m.remoteRoutes)
}
```

### **Paso 6: Crear estructura de archivos**
```
apps/[modulo]/
├── src/
│   ├── app/
│   │   ├── remote-entry/
│   │   │   └── entry.routes.ts
│   │   ├── pages/
│   │   │   └── principal/
│   │   │       ├── principal.component.ts
│   │   │       ├── principal.component.html
│   │   │       └── principal.component.scss
│   │   ├── services/
│   │   │   └── [modulo].service.ts
│   │   └── models/
│   │       └── [modulo].model.ts
│   └── styles.scss
```

---

## 🔒 COMPARTIR AUTENTICACIÓN ENTRE MÓDULOS

### **Opción 1: Importar directamente desde fronthouse (simple - usar por ahora)**
```typescript
// En apps/mesas/src/app/pages/lista.component.ts
import { AuthService } from '../../../../fronthouse/src/app/core/services/auth.service';
```

### **Opción 2: Crear librería compartida (recomendado para producción)**
```bash
# Crear librería
npx nx g @nx/angular:library shared-auth --directory=libs/shared

# Mover AuthService, Guards, Interceptors a libs/shared/shared-auth/

# Usar en cualquier app
import { AuthService } from '@placemy/shared/shared-auth';
```

---

## 📐 REGLAS DE ARQUITECTURA

### **Separación de responsabilidades:**
1. **fronthouse (HOST):**
   - Login/Logout
   - Menú principal (Dashboard)
   - Header compartido
   - Orquestación de módulos remotos

2. **Apps remotas (REMOTES):**
   - Funcionalidad específica del dominio
   - Usan Header de fronthouse
   - Independientes entre sí
   - NO se comunican directamente entre ellas

3. **Shared components:**
   - Header (ya creado)
   - Footer (por crear)
   - Componentes UI comunes
   - Exportan API pública clara

### **Imports permitidos:**
```typescript
✅ apps/mesas/ → puede importar → apps/fronthouse/shared/components/
✅ apps/mesas/ → puede importar → libs/shared/
✅ apps/mesas/ → puede importar → apps/fronthouse/core/ (temporalmente)
❌ apps/mesas/ → NO puede importar → apps/productos/
❌ apps/mesas/ → NO puede importar → apps/pedidos/
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

## 🚀 DEPLOYMENT

### **Desarrollo Local:**
```bash
# Terminal 1: HOST
npx nx serve fronthouse

# Terminal 2: REMOTE 1
npx nx serve mesas

# Terminal 3: REMOTE 2
npx nx serve productos
```

### **Producción (GoDaddy - Hosting estático):**
```bash
# Build todas las apps
npx nx build fronthouse --configuration=production
npx nx build mesas --configuration=production
npx nx build productos --configuration=production

# Estructura en servidor:
public_html/
├── index.html                    # fronthouse
├── main.*.js
├── styles.*.css
├── favicon.ico
├── favicon-*.png
└── remotes/
    ├── mesas/
    │   └── remoteEntry.mjs
    ├── productos/
    │   └── remoteEntry.mjs
    └── pedidos/
        └── remoteEntry.mjs
```

---

## 💡 INSTRUCCIONES PARA EL ASISTENTE

### **Cuando el usuario pida crear un nuevo módulo:**

1. **PREGUNTAR PRIMERO:**
   - ¿Qué módulo quiere crear? (mesas, productos, pedidos, otro)
   - ¿Ya existe el endpoint del backend?
   - ¿Quiere que sea un módulo remoto (Module Federation) o parte de fronthouse?

2. **SI ES MÓDULO REMOTO:**
   - Crear la app con Nx generator
   - Configurar Module Federation
   - Crear estructura de carpetas (pages, services, models)
   - **Importar y usar HeaderComponent**
   - Conectar con fronthouse
   - Compartir autenticación

3. **SI ES FEATURE DE FRONTHOUSE:**
   - Crear carpeta en `features/`
   - **Usar HeaderComponent**
   - Agregar lazy route
   - Seguir estructura establecida

4. **SIEMPRE INCLUIR:**
   - Header reutilizable: `<app-header></app-header>`
   - Tema de colores establecido
   - Animaciones fadeInUp
   - Material Design components
   - Manejo de errores con MatSnackBar o SweetAlert2
   - Diseño responsive

5. **CREAR ESTRUCTURA:**
   ```
   [modulo]/
   ├── pages/
   │   └── [componente]/
   │       ├── [componente].component.ts
   │       ├── [componente].component.html
   │       └── [componente].component.scss
   ├── services/
   │   └── [modulo].service.ts
   └── models/
       └── [modulo].model.ts
   ```

6. **USAR ANGULAR MATERIAL** siempre
7. **INCLUIR manejo de errores** con MatSnackBar o SweetAlert2
8. **RESPETAR el tema de colores** establecido
9. **NO ASUMIR estructura existente**, siempre verificar

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
- Header puede ser compartido entre HOST y REMOTES

### **3. Angular 19:**
- Usar componentes standalone (no NgModules)
- Guards funcionales (`CanActivateFn`) en lugar de clases
- `provideAnimationsAsync()` está deprecated pero funciona (ignorar warning)
- Imports relativos en lugar de absolutos para componentes compartidos

### **4. Estructura de carpetas:**
- `core/` → Servicios globales (singleton)
- `shared/` → Componentes reutilizables (Header, Footer, etc.)
- `features/` → Módulos de funcionalidad
- `libs/` → Código compartido entre apps
- `public/` → Archivos estáticos (favicons, imágenes)

### **5. Componentes compartidos:**
- Crear en `shared/components/`
- Usar imports relativos: `'../../../shared/components/[nombre]/[nombre].component'`
- Hacer standalone y exportar claramente
- Documentar su uso para otros módulos

### **6. Favicons y branding:**
- Generar con https://favicon.io/
- Colocar todos los archivos en `apps/fronthouse/public/`
- Configurar en `index.html`
- Usar en componentes: `src="/favicon-96x96.png"`

---

## ❓ INSTRUCCIONES PARA LA PRÓXIMA SESIÓN

**Indica al asistente:**

1. **Si quieres crear un módulo remoto:**
   ```
   Quiero crear el módulo remoto MESAS con Module Federation.
   Debe conectarse al endpoint /api/restaurante/mesas.
   Debe usar el Header reutilizable.
   Sigue el patrón establecido en el workspace.
   ```

2. **Si quieres crear una feature en fronthouse:**
   ```
   Quiero agregar la funcionalidad de PERFIL DE USUARIO en fronthouse.
   Como una feature más, no como módulo remoto.
   Debe usar el Header reutilizable.
   ```

3. **Si quieres crear un componente compartido:**
   ```
   Quiero crear un componente Footer reutilizable en shared/components/
   para usarlo en todas las páginas.
   ```

4. **Si quieres crear una librería compartida:**
   ```
   Quiero crear la librería @placemy/shared/auth para compartir
   la autenticación entre todas las apps.
   ```

5. **Recuerda SIEMPRE indicar:**
   - Que respete las preferencias de desarrollo (no asumir, preguntar antes de codificar)
   - Que siga la arquitectura Nx con Module Federation establecida
   - Que use Angular Material con el tema personalizado
   - Que incluya manejo de errores con MatSnackBar o SweetAlert2
   - Que use el Header reutilizable cuando aplique
   - Que verifique los archivos existentes antes de crear nuevos

---

## 📚 ARQUITECTURA ESTABLECIDA

**Principios clave:**
1. ✅ Monorepo Nx con múltiples apps
2. ✅ Module Federation para microfrontends
3. ✅ Código compartido a través de librerías
4. ✅ Componentes reutilizables (Header, futuros: Footer, Sidebar)
5. ✅ Lazy loading de módulos remotos
6. ✅ Autenticación compartida entre apps
7. ✅ Standalone components (Angular 19)
8. ✅ Material Design con tema personalizado
9. ✅ Branding consistente (logo PlaceMy en dorado)
10. ✅ Deploy independiente de cada app
11. ✅ Desarrollo en paralelo de múltiples módulos
12. ✅ Escalabilidad horizontal (agregar apps sin afectar las existentes)

---

## 🔗 RECURSOS

- **Repo Git:** https://github.com/[tu-usuario]/placemy-workspace
- **Documentación Nx:** https://nx.dev
- **Module Federation:** https://module-federation.io/
- **Angular Material:** https://material.angular.io/
- **Favicon Generator:** https://favicon.io/

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### **Completado:**
✅ Workspace Nx configurado  
✅ App fronthouse (HOST) funcionando  
✅ Login con autenticación Laravel Sanctum  
✅ Dashboard con diseño premium  
✅ Header reutilizable creado y funcionando  
✅ Logo y favicons implementados  
✅ AuthService con manejo de tokens  
✅ Guards funcionales (authGuard, noAuthGuard)  
✅ Interceptor para agregar token automáticamente  
✅ Tema Material personalizado  
✅ Branding PlaceMy establecido (colores, tipografía, logo)  
✅ Estructura de carpetas establecida  
✅ Componentes con animaciones y efectos premium  

### **Por hacer:**
⏭️ Configurar Module Federation en fronthouse  
⏭️ Crear app remota "mesas"  
⏭️ Conectar fronthouse con mesas  
⏭️ Crear librería @placemy/shared/auth  
⏭️ Crear componente Footer reutilizable  
⏭️ Crear app remota "productos"  
⏭️ Crear app remota "pedidos"  

---

**FIN DEL PROMPT DE CONTINUACIÓN - v2**