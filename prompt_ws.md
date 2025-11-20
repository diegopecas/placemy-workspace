# 📋 PLACEMY WORKSPACE - PROMPT DE CONTINUACIÓN  FINAL

## 🎯 DIRECTIVAS CRÍTICAS PARA EL ASISTENTE

**⚠️ REGLAS OBLIGATORIAS - LEER ANTES DE CUALQUIER RESPUESTA:**

1. **SIEMPRE LEER ARCHIVOS COMPARTIDOS**: Cuando el usuario comparte archivos, SIEMPRE leerlos completamente antes de proponer soluciones. NO asumir el contenido.

2. **NO ASUMIR ESTRUCTURAS**: Si un archivo ya existe, PEDIR que se comparta antes de modificarlo. NO crear código basado en suposiciones.

3. **VERIFICAR ANTES DE PROPONER**: Antes de sugerir cambios, leer TODO el código relacionado que el usuario haya compartido.

4. **PREGUNTAR SI HAY DUDAS**: Si no está claro algo, PREGUNTAR. Es mejor preguntar que asumir incorrectamente.

5. **MANTENER COHERENCIA**: Seguir los patrones y estándares establecidos en el proyecto. NO inventar nuevas formas de hacer las cosas sin consultar.

6. **EJEMPLOS SON IMPORTANTES**: Los ejemplos de código son útiles para mantener consistencia. Incluirlos cuando sea relevante.

7. **BUENAS PRÁCTICAS**: Aplicar siempre las buenas prácticas de Angular, TypeScript y SCSS documentadas aquí.

8. **NO PASAR ARCHIVOS REPETIDOS**: Si ya se compartió un archivo en la conversación, NO volver a pasarlo a menos que haya cambios.

---

## 🏗️ CONTEXTO DEL PROYECTO

**PlaceMy Workspace** es un monorepo Nx para el sistema de gestión de establecimientos PlaceMy. 

### **Arquitectura:**
- Monorepo Nx con Module Federation
- Microfrontends independientes
- Librerías compartidas (`@placemy/shared/*`)
- Sistema de theming automático por mes
- Componentes standalone de Angular 19

### **Apps Actuales:**
- `fronthouse` - App principal (HOST) para gestión del Front of House

### **Librerías Compartidas:**
- `@placemy/shared/auth` - Autenticación y autorización
- `@placemy/shared/ui-components` - Componentes UI y sistema de temas

---

## 📁 ESTRUCTURA DEL PROYECTO

```
placemy-workspace/
├── apps/
│   └── fronthouse/                          # App principal (HOST)
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/                    # Servicios singleton
│       │   │   │   ├── services/            # auth.service.ts
│       │   │   │   ├── guards/              # auth.guard.ts, no-auth.guard.ts
│       │   │   │   ├── interceptors/        # auth.interceptor.ts
│       │   │   │   └── models/              # auth.model.ts
│       │   │   │
│       │   │   ├── features/                # Módulos funcionales
│       │   │   │   ├── auth/
│       │   │   │   │   └── pages/
│       │   │   │   │       └── login/       # Login con tema dinámico
│       │   │   │   └── dashboard/
│       │   │   │       └── pages/
│       │   │   │           └── dashboard/   # Dashboard con permisos
│       │   │   │
│       │   │   ├── app.component.ts         # Root component
│       │   │   ├── app.config.ts            # Config + interceptor
│       │   │   └── app.routes.ts            # Rutas lazy loading
│       │   │
│       │   ├── styles.scss                  # Import del sistema de temas
│       │   └── index.html
│       │
│       └── project.json                     # ⚠️ CON stylePreprocessorOptions
│
├── libs/
│   └── shared/
│       ├── auth/                            # Autenticación y autorización
│       │   └── src/
│       │       ├── lib/
│       │       │   ├── services/
│       │       │   │   └── permission.service.ts
│       │       │   ├── guards/
│       │       │   │   └── permission.guard.ts
│       │       │   ├── directives/
│       │       │   │   └── has-permission.directive.ts
│       │       │   └── models/
│       │       │       ├── user.model.ts    # Modelo centralizado
│       │       │       ├── role.model.ts
│       │       │       └── permission.model.ts
│       │       └── index.ts                 # Public API
│       │
│       └── ui-components/                   # Componentes UI + Sistema de temas
│           └── src/
│               ├── lib/
│               │   ├── header/
│               │   │   ├── header.component.ts
│               │   │   ├── header.component.html
│               │   │   ├── header.component.scss
│               │   │   └── index.ts
│               │   ├── directives/
│               │   │   └── button-burst.directive.ts
│               │   └── services/
│               │       └── theme.service.ts
│               │
│               ├── styles/                             # Sistema de theming
│               │   ├── _animations.scss                # Animaciones compartidas
│               │   ├── _particles.scss                 # Partículas flotantes
│               │   ├── _common.scss                    # ⭐ NUEVO - Mixins y utilidades
│               │   ├── index.scss                      # Export principal
│               │   └── themes/
│               │       ├── _base.scss
│               │       ├── _mothers-day.scss
│               │       ├── _fathers-day.scss
│               │       ├── _colombia-independence.scss
│               │       ├── _kites.scss
│               │       ├── _love-friendship.scss
│               │       ├── _halloween.scss
│               │       └── _christmas.scss
│               │
│               └── index.ts                            # Public API
│
├── nx.json
├── package.json
└── tsconfig.base.json                      # Paths: @placemy/*
```

---

## 🎨 STACK TECNOLÓGICO

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Angular** | 19.2.15 | Framework principal (Standalone Components) |
| **Nx** | 22.0.3 | Monorepo + Module Federation |
| **Angular Material** | 19 | UI Components |
| **TypeScript** | Latest | Lenguaje |
| **SCSS** | Latest | Estilos |
| **Signals** | Angular 19 | Estado reactivo |
| **esbuild** | Latest | Bundler rápido |
| **SweetAlert2** | Latest | Alertas elegantes |
| **Laravel Sanctum** | Backend | Autenticación con tokens |

---

## 🎨 SISTEMA DE ESTILOS CON _COMMON.SCSS

### **⭐ CONFIGURACIÓN IMPORTANTE:**

El proyecto usa **`stylePreprocessorOptions`** en `project.json` para imports limpios:

```json
// apps/fronthouse/project.json
{
  "targets": {
    "build": {
      "options": {
        "stylePreprocessorOptions": {
          "includePaths": [
            "libs/shared/ui-components/src/styles"
          ]
        }
      }
    }
  }
}
```

**Esto permite usar:**
```scss
@use 'common' as common;
// En lugar de:
@use '../../../../../../../libs/shared/ui-components/src/styles/common' as common;
```

---

### **📦 ARCHIVO _COMMON.SCSS**

Ubicación: `libs/shared/ui-components/src/styles/_common.scss`

**Contiene:**

#### **1. Animaciones Reutilizables:**
```scss
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

@keyframes slideUp { /* ... */ }
@keyframes pulse { /* ... */ }
```

#### **2. Mixins Principales:**

```scss
// Glassmorphism
@mixin glassmorphism-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

// Shadows
@mixin shadow-sm { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
@mixin shadow-md { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
@mixin shadow-lg { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2); }
@mixin shadow-xl { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3); }

// Text shadows
@mixin text-shadow-light { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); }
@mixin text-shadow-strong { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); }

// Transition
@mixin smooth-transition { transition: all 0.3s ease; }

// Avatar circular
@mixin avatar-circle($size: 44px) {
  width: $size;
  height: $size;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  transition: all 0.3s ease;
}
```

#### **3. Variables de Breakpoints:**
```scss
$breakpoint-mobile: 480px;
$breakpoint-tablet: 768px;
$breakpoint-desktop: 1024px;
$breakpoint-wide: 1400px;
```

---

### **✅ CÓMO USAR _COMMON.SCSS EN COMPONENTES:**

**Paso 1: Importar al inicio del archivo SCSS:**
```scss
// dashboard.component.scss
@use 'common' as common;
```

**Paso 2: Usar los mixins:**
```scss
.mi-card {
  @include common.glassmorphism-card;
  @include common.shadow-lg;
  @include common.smooth-transition;
}

.mi-titulo {
  @include common.text-shadow-strong;
}

.mi-avatar {
  @include common.avatar-circle(48px);
}
```

**Paso 3: Usar breakpoints:**
```scss
@media (max-width: common.$breakpoint-tablet) {
  .mi-contenedor {
    padding: 1rem;
  }
}
```

**⚠️ IMPORTANTE:**
- **NO usar `@extend`** con clases globales (causa errores de compilación)
- **Usar animaciones directamente** con `animation: fadeInUp 0.6s ease-out;`
- **Definir animaciones localmente** si es necesario

---

### **❌ ANTI-PATRONES (NO HACER):**

```scss
// ❌ NO USAR @extend CON CLASES GLOBALES
.mi-clase {
  @extend .fade-in-up;  // ❌ ERROR
  @extend .pulse;       // ❌ ERROR
}

// ✅ EN SU LUGAR, USA ANIMATION DIRECTAMENTE
.mi-clase {
  animation: fadeInUp 0.6s ease-out;  // ✅ CORRECTO
}

// O DEFINE LA ANIMACIÓN LOCALMENTE
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🎯 PATRONES Y CONVENCIONES

### **1. Componentes:**
- ✅ Siempre **standalone**
- ✅ 3 archivos: `.ts`, `.html`, `.scss`
- ✅ Usar Signals para estado
- ✅ Computed para valores derivados
- ✅ Effect para side effects

**Ejemplo completo:**
```typescript
@Component({
  selector: 'app-ejemplo',
  standalone: true,
  imports: [CommonModule, /* ... */],
  templateUrl: './ejemplo.component.html',
  styleUrl: './ejemplo.component.scss'
})
export class EjemploComponent {
  private service = inject(MiService);
  
  data = signal<Data[]>([]);
  isLoading = signal(false);
  
  filteredData = computed(() => {
    return this.data().filter(/* ... */);
  });
  
  constructor() {
    effect(() => {
      console.log('Data changed:', this.data());
    });
  }
}
```

### **2. SCSS en Componentes:**

**Template completo:**
```scss
// Importar common al inicio
@use 'common' as common;

// Contenedor principal
.mi-container {
  min-height: 100vh;
  transition: background 0.8s ease;
}

// Sección con animación
.mi-section {
  animation: fadeInUp 0.6s ease-out;
  
  h2 {
    @include common.text-shadow-strong;
  }
}

// Card con glassmorphism
.mi-card {
  @include common.glassmorphism-card;
  @include common.shadow-lg;
  @include common.smooth-transition;
  
  &:hover {
    transform: translateY(-4px);
    @include common.shadow-xl;
  }
}

// Avatar
.mi-avatar {
  @include common.avatar-circle(48px);
}

// Responsive
@media (max-width: common.$breakpoint-tablet) {
  .mi-container {
    padding: 1rem;
  }
}

@media (max-width: common.$breakpoint-mobile) {
  .mi-section h2 {
    font-size: 1.25rem;
  }
}
```

---

## 🎨 SISTEMA DE THEMING 

### **Características:**
1. ✅ Gradientes animados en todos los temas
2. ✅ Cambio automático según el mes
3. ✅ 8 temas completos
4. ✅ Header con gradiente animado
5. ✅ Partículas flotantes temáticas
6. ✅ Explosión de iconos en botones

### **Calendario de Temas:**

| Mes | Tema | Colores | Iconos |
|-----|------|---------|--------|
| Ene-Abr, Nov | Base | Rojo vino → Coral → Turquesa | 🍴🍽️🥘🍷 |
| Mayo | Mothers Day | Rosa → Fucsia → Rosa claro | 💐🌸🌺💝 |
| Junio | Fathers Day | Azul → Celeste → Azul claro | 👔🎩⚽🏆 |
| Julio | Colombia | Amarillo → Azul → Rojo | 🇨🇴☕🌺🎺 |
| Agosto | Kites | Turquesa → Naranja → Celeste | 🪁☁️🌈☀️ |
| Sept | Love | Rojo → Fucsia → Carmín | ❤️💕🌹💝 |
| Oct | Halloween | Morado → Naranja → Índigo | 🎃👻🦇🕷️ |
| Dic | Christmas | Verde → Rojo → Dorado | 🎄⛄🎅🎁 |

### **Cómo Aplicar el Tema:**

**En el HTML:**
```html
<div class="mi-container" [attr.data-theme]="currentTheme().name">
  <app-header></app-header>
  
  <!-- Partículas flotantes -->
  <div class="floating-particles">
    <div *ngFor="let p of floatingParticles()" 
         class="theme-particle"
         [style.left.%]="p.x"
         [style.top.%]="p.y"
         [style.animation-delay.s]="p.delay">
      {{ p.icon }}
    </div>
  </div>
  
  <div class="mi-contenido">
    <!-- Contenido -->
  </div>
</div>
```

**En el TypeScript:**
```typescript
import { ThemeService } from '@placemy/shared/ui-components';

export class MiComponente {
  private themeService = inject(ThemeService);
  currentTheme = this.themeService.currentTheme;
  
  floatingParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      icon: theme.decorativeElements[Math.floor(Math.random() * theme.decorativeElements.length)]
    }));
  });
}
```

**En el SCSS:**
```scss
@use 'common' as common;

.mi-container {
  min-height: 100vh;
  // El fondo se hereda del [data-theme]
  transition: background 0.8s ease;
}

.mi-contenido {
  position: relative;
  z-index: 2;
  padding: 2rem;
}

.floating-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  
  .theme-particle {
    position: absolute;
    font-size: 2rem;
    animation: float 15s ease-in-out infinite;
    opacity: 0.6;
  }
}
```

---

## 🔐 AUTENTICACIÓN Y AUTORIZACIÓN

### **Sistema de Permisos:**

# ACTUALIZAR EN prompt_ws.md (sección "🔐 AUTENTICACIÓN Y AUTORIZACIÓN")

---

## 🔐 AUTENTICACIÓN Y AUTORIZACIÓN



**1. PermissionService:**
```typescript
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private currentUser = signal<User | null>(null);
  
  setUser(user: User | null): void {
    this.currentUser.set(user);
  }
  
  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return user.permissions.some(p => p.nombre === permission);
  }
  
  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return user.roles.some(r => r.nombre === roleName);
  }
}
```

**2. Permission Guard:**
```typescript
export const permissionGuard: (permission: string) => CanActivateFn = 
  (permission: string) => (route, state) => {
    const permissionService = inject(PermissionService);
    return permissionService.hasPermission(permission);
  };
```

**3. Directiva *appHasPermission:**
```html
<button *appHasPermission="'productos.editar'" mat-button>
  Editar Producto
</button>
```

**4. Filtrar por permisos en computed:**
```typescript
menuCards = computed(() => {
  return this.allMenuCards.filter(card => 
    this.permissionService.hasPermission(card.requiredPermission)
  );
});
```
### **Permisos Multi-Establecimiento**

Un usuario puede tener diferentes roles en diferentes establecimientos. La estructura es:

```typescript
// User tiene establecimientos (NO roles directo)
interface User {
  id: number;
  username: string;
  email: string;
  persona_natural?: PersonaNatural;
  establecimientos?: Establecimiento[];  // ← Aquí están los roles
}

// Cada establecimiento tiene sus roles con permisos
interface Establecimiento {
  id: number;
  nombre: string;
  slug: string;
  roles: Role[];
}

interface Role {
  id: number;
  nombre: string;
  permisos?: string[];
}
```

### **PermissionService - Métodos Principales**

```typescript
// Permiso en CUALQUIER establecimiento
hasPermission(permission: string): boolean

// Permiso en UN establecimiento específico
hasPermissionInEstablecimiento(permission: string, establecimientoId: number): boolean

// Permisos de un establecimiento
getPermissionsInEstablecimiento(establecimientoId: number): Set<string>

// Roles del usuario (todos los establecimientos)
getUserRoles(): string[]
```

### **Obtener Rol en Componentes**

```typescript
getUserRole(): string {
  const user = this.currentUser();
  if (!user?.establecimientos?.[0]?.roles?.[0]) return 'Sin rol';
  return user.establecimientos[0].roles[0].nombre;
}
```

---
---

## 🔧 COMPONENTES COMPARTIDOS

### **HeaderComponent:**

**Características:**
- ✅ Gradiente animado con 3 colores
- ✅ Logo PlaceMy con branding
- ✅ Información del usuario
- ✅ Avatar con iniciales
- ✅ Menú desplegable
- ✅ Responsive

**Uso:**
```html
<app-header></app-header>
```

**Configurar usuario:**
```typescript
@ViewChild(HeaderComponent) header!: HeaderComponent;

constructor() {
  effect(() => {
    if (this.header) {
      this.header.setCurrentUser(this.currentUser());
    }
  });
}
```

---

## 🐛 TROUBLESHOOTING

### **Error: "The target selector was not found" con @extend:**

**Problema:** Usar `@extend` con clases globales.

**Solución:**
```scss
// ❌ INCORRECTO
.mi-clase {
  @extend .fade-in-up;
}

// ✅ CORRECTO
.mi-clase {
  animation: fadeInUp 0.6s ease-out;
}
```

### **El gradiente animado no se ve:**

**Problema:** El componente sobrescribe el fondo del tema.

**Solución:**
```scss
// ❌ INCORRECTO
.mi-container {
  background: #000;
}

// ✅ CORRECTO
.mi-container {
  min-height: 100vh;
  transition: background 0.8s ease;
}
```

### **Error: "Can't find stylesheet common":**

**Problema:** Falta configurar `stylePreprocessorOptions`.

**Solución:** Verificar que `project.json` tenga:
```json
"stylePreprocessorOptions": {
  "includePaths": [
    "libs/shared/ui-components/src/styles"
  ]
}
```

---

## 🚀 COMANDOS ÚTILES

```bash
# Limpiar cache de Nx
npx nx reset

# Servir app
npx nx serve fronthouse

# Build producción
npx nx build fronthouse --configuration=production

# Generar componente
npx nx g @nx/angular:component nombre --project=fronthouse --standalone

# Instalar dependencias
npm install
```

---

## ✅ CHECKLIST PARA NUEVOS COMPONENTES

- [ ] Es standalone
- [ ] Usa signals para estado
- [ ] Importa `@use 'common' as common;` en SCSS
- [ ] Usa mixins de common en lugar de código duplicado
- [ ] NO usa @extend con clases globales
- [ ] Tiene nombres descriptivos
- [ ] Es responsive usando breakpoints de common
- [ ] Usa el sistema de temas si aplica

---

## 📚 RESUMEN RÁPIDO DE _COMMON.SCSS

**Importar:**
```scss
@use 'common' as common;
```

**Mixins disponibles:**
- `@include common.glassmorphism-card;`
- `@include common.shadow-sm / md / lg / xl;`
- `@include common.text-shadow-light / strong;`
- `@include common.smooth-transition;`
- `@include common.avatar-circle(48px);`

**Breakpoints:**
- `common.$breakpoint-mobile` (480px)
- `common.$breakpoint-tablet` (768px)
- `common.$breakpoint-desktop` (1024px)
- `common.$breakpoint-wide` (1400px)

**Animaciones disponibles:**
- `fadeInUp`
- `slideUp`
- `pulse`
- `float`
- `glow`
- `rotate`

---

**FIN DEL PROMPT - PlaceMy Workspace  FINAL** 🎨

**Última actualización:** Noviembre 2025