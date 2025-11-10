# 📋 PROMPT DE CONTINUACIÓN - PROYECTO PLACEMY-WORKSPACE

## 🏗️ CONTEXTO DEL PROYECTO

**PlaceMy Workspace** es un monorepo Nx para el sistema de gestión de restaurantes PlaceMy. Utiliza **Module Federation** para arquitectura de microfrontends, permitiendo desarrollar y desplegar módulos independientes que comparten autenticación y código común.

---

## 📁 ESTRUCTURA ESTABLECIDA

```
C:\Proyectos\Placemy\placemy-workspace\
├── apps/
│   └── fronthouse/                    # App principal (HOST)
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
│       │   ├── index.html
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
```

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
- Validación de formularios reactivos
- Conexión con backend Laravel
- Manejo de errores con SnackBar
- Signals para estado (isLoading, hidePassword)

### **2. Dashboard** ✓
- Layout con header y navegación
- Tarjetas de menú principales (Pedidos, Mesas, Productos)
- Información del usuario
- Integración con SweetAlert2 para confirmaciones
- Diseño responsivo con Tailwind utility classes

### **3. Auth Service** ✓
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
- Comparte la autenticación con todos los remotos

**REMOTES (mesas, productos, pedidos):**
- Apps Angular independientes
- Se desarrollan y despliegan por separado
- Se cargan dinámicamente cuando el usuario las necesita
- Comparten código a través de librerías

**SHARED LIBRARIES:**
- Código compartido entre HOST y REMOTES
- Ejemplo: `@placemy/shared/auth` (AuthService, Guards, Interceptors)

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

# Limpiar cache de Nx
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

### **Paso 3: Crear rutas del módulo**

**`apps/[modulo]/src/app/remote-entry/entry.routes.ts`:**
```typescript
import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => 
      import('./pages/lista/lista.component').then(m => m.ListaComponent)
  }
];
```

### **Paso 4: Registrar en fronthouse**

**`apps/fronthouse/src/app/app.routes.ts`:**
```typescript
{
  path: 'modulo',
  loadChildren: () => 
    import('modulo/Routes').then(m => m.remoteRoutes)
}
```

### **Paso 5: Crear estructura de archivos**
```
apps/[modulo]/
├── src/
│   ├── app/
│   │   ├── remote-entry/
│   │   │   └── entry.routes.ts
│   │   ├── pages/
│   │   │   └── lista/
│   │   │       ├── lista.component.ts
│   │   │       ├── lista.component.html
│   │   │       └── lista.component.scss
│   │   ├── services/
│   │   │   └── [modulo].service.ts
│   │   └── models/
│   │       └── [modulo].model.ts
│   └── styles.scss
```

---

## 🔒 COMPARTIR AUTENTICACIÓN ENTRE MÓDULOS

### **Opción 1: Importar directamente desde fronthouse (simple)**
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
   - Menú principal
   - Layout/Header compartido
   - Orquestación de módulos remotos

2. **Apps remotas (REMOTES):**
   - Funcionalidad específica del dominio
   - Independientes entre sí
   - NO se comunican directamente entre ellas

3. **Librerías compartidas:**
   - Código común (Auth, UI, Utilities)
   - Exportan API pública clara
   - Sin lógica de negocio

### **Imports permitidos:**
```typescript
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

### **Producción (GoDaddy):**
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
   - Conectar con fronthouse
   - Compartir autenticación

3. **SI ES FEATURE DE FRONTHOUSE:**
   - Crear carpeta en `features/`
   - Agregar lazy route
   - Seguir estructura establecida

4. **CREAR ESTRUCTURA:**
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

5. **USAR ANGULAR MATERIAL** siempre
6. **INCLUIR manejo de errores** con MatSnackBar
7. **RESPETAR el tema de colores** establecido
8. **NO ASUMIR estructura existente**, siempre verificar

---

## 🎓 LECCIONES APRENDIDAS

### **1. Nx Workspace:**
- Usar `npx nx` en lugar de `nx` (si no está instalado globalmente)
- Siempre usar `npx nx reset` después de cambios grandes
- Los archivos se cachean, a veces hay que reiniciar el servidor

### **2. Module Federation:**
- El HOST (fronthouse) debe estar corriendo para que los remotos funcionen
- Los remotos se sirven en puertos diferentes (4201, 4202, etc.)
- Las rutas se cargan dinámicamente, no hay recarga de página

### **3. Angular 19:**
- Usar componentes standalone (no NgModules)
- Guards funcionales (`CanActivateFn`) en lugar de clases
- `provideAnimationsAsync()` está deprecated pero funciona (ignorar warning)

### **4. Estructura de carpetas:**
- `core/` → Servicios globales (singleton)
- `shared/` → Componentes reutilizables
- `features/` → Módulos de funcionalidad
- `libs/` → Código compartido entre apps

---

## ❓ INSTRUCCIONES PARA LA PRÓXIMA SESIÓN

**Indica al asistente:**

1. **Si quieres crear un módulo remoto:**
   ```
   Quiero crear el módulo remoto MESAS con Module Federation.
   Debe conectarse al endpoint /api/restaurante/mesas.
   Sigue el patrón establecido en el workspace.
   ```

2. **Si quieres crear una feature en fronthouse:**
   ```
   Quiero agregar la funcionalidad de PERFIL DE USUARIO en fronthouse.
   Como una feature más, no como módulo remoto.
   ```

3. **Si quieres crear una librería compartida:**
   ```
   Quiero crear la librería @placemy/shared/auth para compartir
   la autenticación entre todas las apps.
   ```

4. **Recuerda SIEMPRE indicar:**
   - Que respete las preferencias de desarrollo (no asumir, preguntar antes de codificar)
   - Que siga la arquitectura Nx con Module Federation establecida
   - Que use Angular Material con el tema personalizado
   - Que incluya manejo de errores con MatSnackBar
   - Que verifique los archivos existentes antes de crear nuevos

---

## 📚 ARQUITECTURA ESTABLECIDA

**Principios clave:**
1. ✅ Monorepo Nx con múltiples apps
2. ✅ Module Federation para microfrontends
3. ✅ Código compartido a través de librerías
4. ✅ Lazy loading de módulos remotos
5. ✅ Autenticación compartida entre apps
6. ✅ Standalone components (Angular 19)
7. ✅ Material Design con tema personalizado
8. ✅ Deploy independiente de cada app
9. ✅ Desarrollo en paralelo de múltiples módulos
10. ✅ Escalabilidad horizontal (agregar apps sin afectar las existentes)

---

## 🔗 RECURSOS

- **Repo Git:** https://github.com/[tu-usuario]/placemy-workspace
- **Documentación Nx:** https://nx.dev
- **Module Federation:** https://module-federation.io/
- **Angular Material:** https://material.angular.io/

---

## 🎯 ESTADO ACTUAL DEL PROYECTO

### **Completado:**
✅ Workspace Nx configurado  
✅ App fronthouse (HOST) funcionando  
✅ Login con autenticación Laravel Sanctum  
✅ Dashboard con menú principal  
✅ AuthService con manejo de tokens  
✅ Guards funcionales (authGuard, noAuthGuard)  
✅ Interceptor para agregar token automáticamente  
✅ Tema Material personalizado  
✅ Estructura de carpetas establecida  

### **Por hacer:**
⏭️ Configurar Module Federation en fronthouse  
⏭️ Crear app remota "mesas"  
⏭️ Conectar fronthouse con mesas  
⏭️ Crear librería @placemy/shared/auth  
⏭️ Crear app remota "productos"  
⏭️ Crear app remota "pedidos"  

---

**FIN DEL PROMPT DE CONTINUACIÓN**
