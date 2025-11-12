# 📋 PLACEMY WORKSPACE - PROMPT DE CONTINUACIÓN v8.0

## 🎯 DIRECTIVAS CRÍTICAS PARA EL ASISTENTE

**⚠️ REGLAS OBLIGATORIAS - LEER ANTES DE CUALQUIER RESPUESTA:**

1. **SIEMPRE LEER ARCHIVOS COMPARTIDOS**: Cuando el usuario comparte archivos, SIEMPRE leerlos completamente antes de proponer soluciones. NO asumir el contenido.

2. **NO ASUMIR ESTRUCTURAS**: Si un archivo ya existe, PEDIR que se comparta antes de modificarlo. NO crear código basado en suposiciones.

3. **VERIFICAR ANTES DE PROPONER**: Antes de sugerir cambios, leer TODO el código relacionado que el usuario haya compartido.

4. **PREGUNTAR SI HAY DUDAS**: Si no está claro algo, PREGUNTAR. Es mejor preguntar que asumir incorrectamente.

5. **MANTENER COHERENCIA**: Seguir los patrones y estándares establecidos en el proyecto. NO inventar nuevas formas de hacer las cosas sin consultar.

6. **EJEMPLOS SON IMPORTANTES**: Los ejemplos de código son útiles para mantener consistencia. Incluirlos cuando sea relevante.

7. **BUENAS PRÁCTICAS**: Aplicar siempre las buenas prácticas de Angular, TypeScript y SCSS documentadas aquí.

---

## 🏗️ CONTEXTO DEL PROYECTO

**PlaceMy Workspace** es un monorepo Nx para el sistema de gestión de restaurantes PlaceMy. 

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
│       └── project.json
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
│               │   │   └── button-burst.directive.ts  # Explosión de iconos
│               │   └── services/
│               │       └── theme.service.ts            # Gestión de temas
│               │
│               ├── styles/                             # Sistema de theming
│               │   ├── _animations.scss                # Animaciones compartidas
│               │   ├── _particles.scss                 # Partículas flotantes
│               │   ├── _common.scss                    # Estilos comunes (mixins, utils)
│               │   ├── index.scss                      # Export principal
│               │   └── themes/
│               │       ├── _base.scss                  # Tema base con gradiente animado
│               │       ├── _mothers-day.scss           # Mayo
│               │       ├── _fathers-day.scss           # Junio
│               │       ├── _colombia-independence.scss # Julio
│               │       ├── _kites.scss                 # Agosto
│               │       ├── _love-friendship.scss       # Septiembre
│               │       ├── _halloween.scss             # Octubre
│               │       └── _christmas.scss             # Diciembre
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

## 🎯 PATRONES Y CONVENCIONES

### **1. Componentes:**
- ✅ Siempre **standalone** (no NgModules)
- ✅ 3 archivos: `.ts`, `.html`, `.scss`
- ✅ Usar Signals para estado reactivo
- ✅ Computed para valores derivados
- ✅ Effect para side effects

**Ejemplo:**
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
  
  // State con signals
  data = signal<Data[]>([]);
  isLoading = signal(false);
  
  // Computed para valores derivados
  filteredData = computed(() => {
    return this.data().filter(/* ... */);
  });
  
  // Effect para side effects
  constructor() {
    effect(() => {
      console.log('Data changed:', this.data());
    });
  }
}
```

### **2. Servicios:**
- ✅ `providedIn: 'root'` para singletons
- ✅ Usar signals para estado compartido
- ✅ Naming: `algo.service.ts`

**Ubicación según scope:**
- `apps/fronthouse/src/app/core/services/` → Servicios globales de la app
- `libs/shared/*/src/lib/services/` → Servicios compartidos entre apps
- `apps/fronthouse/src/app/features/[modulo]/services/` → Servicios del módulo

### **3. Guards:**
- ✅ Usar funciones (`CanActivateFn`)
- ✅ NO clases (patrón viejo)

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

### **4. Rutas:**
- ✅ Lazy loading SIEMPRE
- ✅ Guards para protección

```typescript
export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    canActivate: [authGuard]
  }
];
```

### **5. Modelos:**
- ✅ Centralizados en librerías
- ✅ NO duplicar entre apps
- ✅ Usar interfaces de TypeScript

```typescript
// libs/shared/auth/src/lib/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  persona_natural?: PersonaNatural;
}
```

### **6. Estilos:**
- ✅ SCSS siempre
- ✅ Usar mixins y variables compartidas de `_common.scss`
- ✅ NO duplicar estilos entre componentes
- ✅ Usar clases utilitarias cuando sea posible

**Ejemplo de uso de mixins:**
```scss
// En el componente
@use '../../../../../../libs/shared/ui-components/src/styles/common' as common;

.mi-card {
  @include common.glassmorphism-card;
  @include common.shadow-lg;
}

.mi-texto {
  @include common.text-shadow-strong;
}
```

---

## 🎨 SISTEMA DE THEMING v8.0

### **Características:**
1. ✅ **Gradientes animados** en todos los temas (colores en movimiento)
2. ✅ **Cambio automático** según el mes del año
3. ✅ **8 temas completos** (base, mothers-day, fathers-day, etc.)
4. ✅ **Header con gradiente animado** que cambia según tema
5. ✅ **Partículas flotantes** temáticas en dashboard
6. ✅ **Explosión de iconos** en botones y tarjetas

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

### **Cómo Usar el Sistema de Temas:**

#### **1. En el HTML del componente:**
```html
<div class="mi-container" [attr.data-theme]="currentTheme().name">
  <!-- El fondo animado se hereda del tema SCSS -->
  <app-header></app-header>
  
  <!-- Partículas flotantes (opcional) -->
  <div class="floating-particles">
    <div *ngFor="let p of floatingParticles()" 
         class="theme-particle"
         [style.left.%]="p.x"
         [style.top.%]="p.y"
         [style.animation-delay.s]="p.delay">
      {{ p.icon }}
    </div>
  </div>
  
  <!-- Contenido -->
</div>
```

#### **2. En el TypeScript:**
```typescript
import { ThemeService } from '@placemy/shared/ui-components';

export class MiComponente {
  private themeService = inject(ThemeService);
  
  // Tema actual (reactivo)
  currentTheme = this.themeService.currentTheme;
  
  // Partículas flotantes (opcional)
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
  
  ngOnInit() {
    // Forzar un tema específico (opcional)
    this.themeService.setTheme('christmas');
    
    // O volver al tema automático por mes
    this.themeService.refreshTheme();
  }
}
```

#### **3. En el SCSS del componente:**
```scss
.mi-container {
  min-height: 100vh;
  // ⚠️ NO poner background aquí - se hereda del [data-theme]
  transition: background 0.8s ease;
  position: relative;
}

.mi-contenido {
  position: relative;
  z-index: 2; // Sobre el fondo
  padding: 2rem;
}
```

#### **4. Importar estilos en styles.scss de la app:**
```scss
// apps/fronthouse/src/styles.scss
@use '../../../libs/shared/ui-components/src/styles' as placemy;

// Ya tienes acceso a:
// - Todos los temas con gradientes animados
// - Partículas flotantes
// - Animaciones compartidas
// - Mixins y utilidades de _common.scss
```

### **Estructura de un Tema SCSS:**

Cada tema tiene esta estructura:

```scss
// Ejemplo: _christmas.scss
[data-theme="christmas"] {
  // Variables CSS
  --primary: #165B33;
  --accent: #BB2528;
  --secondary: #FFD700;
  
  // Gradiente animado de fondo
  background: linear-gradient(135deg, #165B33 0%, #BB2528 50%, #FFD700 100%);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  
  // Overlay oscuro para legibilidad del texto
  position: relative;
  
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    pointer-events: none;
    z-index: 0;
  }
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### **ThemeService API:**

```typescript
interface ThemeConfig {
  name: string;                    // 'base', 'christmas', etc.
  title: string;                   // 'PlaceMy', 'PlaceMy Navidad'
  subtitle: string;                // Subtítulo del tema
  primaryColor: string;            // Color principal (#165B33)
  accentColor: string;             // Color de acento (#BB2528)
  backgroundColor: string;         // Color de fondo
  decorativeElements: string[];    // Iconos temáticos ['🎄', '⛄']
  particles: Array<{
    icon: string;
    color: string;
  }>;
  hasSpecialEffects: boolean;      // true/false
  effectType?: 'snow' | 'hearts' | 'kites' | 'sparkles' | 'pumpkins';
}

// Métodos disponibles:
themeService.currentTheme        // Signal<ThemeConfig> - Tema actual
themeService.setTheme(name)      // Cambiar tema manualmente
themeService.refreshTheme()      // Volver al tema automático por mes
themeService.getAllThemes()      // Obtener todos los temas
```

---

## 🎨 BRANDING Y DISEÑO

### **Colores de Marca (Constantes):**
```scss
$brand-gold: #C9975B;      // Dorado PlaceMy (logo)
$brand-primary: #8B2635;   // Rojo vino (tema base)
$brand-accent: #FF6B6B;    // Coral (tema base)
$brand-secondary: #17BEBB; // Turquesa (tema base)
```

### **Logo:**
- Letra "P" con copa martini y pin de ubicación
- Colores: Rojo vino (#8B2635) con detalles dorados (#C9975B)
- Ubicaciones: favicon, header, login, PWA

### **Tipografía:**
- Fuente: **Roboto** (Google Fonts)
- Nombre app: "PlaceMy" en dorado (#C9975B)
- Tagline: "Front House" en itálica

---

## 🔐 AUTENTICACIÓN Y AUTORIZACIÓN

### **Sistema de Autenticación:**
- Backend: Laravel Sanctum
- Token: Bearer token en header
- Interceptor: Agrega token automáticamente
- Guards: Protegen rutas

**Usuario de prueba:**
```
Username: 42132501
Password: admin123
API: http://127.0.0.1:8000/api
Rol: Super Administrador (todos los permisos)
```

### **Modelo de Usuario:**

```typescript
// libs/shared/auth/src/lib/models/user.model.ts
export interface User {
  id: number;
  username: string;
  email: string;
  roles: Role[];
  permissions: Permission[];
  persona_natural?: {
    nombres: string;
    apellidos: string;
    documento_identidad: string;
  };
}

export interface Role {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Permission {
  id: number;
  nombre: string;
  descripcion: string;
}
```

### **Sistema de Permisos:**

#### **1. PermissionService:**
```typescript
// libs/shared/auth/src/lib/services/permission.service.ts
@Injectable({ providedIn: 'root' })
export class PermissionService {
  private currentUser = signal<User | null>(null);
  
  // Configurar usuario (llamar desde app.component.ts)
  setUser(user: User | null): void {
    this.currentUser.set(user);
  }
  
  // Verificar si tiene permiso
  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    
    return user.permissions.some(p => p.nombre === permission);
  }
  
  // Verificar si tiene rol
  hasRole(roleName: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    
    return user.roles.some(r => r.nombre === roleName);
  }
}
```

#### **2. Permission Guard:**
```typescript
// libs/shared/auth/src/lib/guards/permission.guard.ts
export const permissionGuard: (permission: string) => CanActivateFn = 
  (permission: string) => (route, state) => {
    const permissionService = inject(PermissionService);
    
    if (permissionService.hasPermission(permission)) {
      return true;
    }
    
    return false; // O redireccionar
  };
```

**Uso en rutas:**
```typescript
{
  path: 'admin',
  loadComponent: () => import('./admin/admin.component'),
  canActivate: [permissionGuard('admin.acceso')]
}
```

#### **3. Directiva *appHasPermission:**
```html
<button *appHasPermission="'productos.editar'" mat-button>
  Editar Producto
</button>

<!-- NO se renderiza si no tiene permiso -->
```

#### **4. Computed para filtrar por permisos:**
```typescript
export class DashboardComponent {
  private permissionService = inject(PermissionService);
  
  // Todas las opciones del menú
  private allMenuCards: MenuCard[] = [
    {
      title: 'Productos',
      route: '/productos',
      requiredPermission: 'productos.ver'
    },
    // ...
  ];
  
  // Filtrar por permisos
  menuCards = computed(() => {
    return this.allMenuCards.filter(card => 
      this.permissionService.hasPermission(card.requiredPermission)
    );
  });
}
```

---

## 🔧 COMPONENTES COMPARTIDOS

### **HeaderComponent:**

Componente reutilizable con gradiente animado que cambia según el tema.

**Uso:**
```html
<app-header></app-header>
```

**Características:**
- ✅ Gradiente animado con 3 colores del tema
- ✅ Logo PlaceMy con branding
- ✅ Información del usuario (nombre, rol)
- ✅ Avatar con iniciales
- ✅ Menú desplegable con opciones
- ✅ Botón de logout con confirmación (SweetAlert2)
- ✅ Responsive (oculta info en móvil)

**Configurar usuario desde el componente padre:**
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

### **ButtonBurstDirective:**

Explosión de iconos temáticos al hacer clic en botones/tarjetas.

**Uso:**
```html
<button mat-raised-button appButtonBurst>
  Click me!
</button>

<mat-card appButtonBurst (click)="navigate()">
  <!-- Contenido de la card -->
</mat-card>
```

**Características:**
- ✅ Explota 3 iconos del tema activo
- ✅ Animación suave y elegante
- ✅ Se autodestruye después de la animación
- ✅ Usa los decorativeElements del tema

---

## 🐛 TROUBLESHOOTING

### **El gradiente animado no se ve:**

**Problema:** El componente está sobrescribiendo el fondo del tema.

**Solución:**
```scss
// ❌ INCORRECTO
.mi-container {
  background: #000; // NO hacer esto
}

// ✅ CORRECTO
.mi-container {
  min-height: 100vh;
  // El fondo se hereda del [data-theme]
  transition: background 0.8s ease;
}
```

### **El header no cambia de color:**

**Verificar:**
1. ✅ El header inyecta ThemeService
2. ✅ El HTML usa `[style.background]="headerBackground()"`
3. ✅ Ejecutar `npx nx reset`

### **Las partículas no flotan:**

**Verificar:**
1. ✅ El computed `floatingParticles` está definido
2. ✅ El HTML tiene el `*ngFor`
3. ✅ Los estilos de `.theme-particle` están importados

### **Los temas no se ven:**

**Verificar:**
1. ✅ `index.scss` importa todos los temas
2. ✅ `styles.scss` de la app importa el sistema de temas
3. ✅ El componente usa `[attr.data-theme]`
4. ✅ Ejecutar `npx nx reset`

### **Error: "Can't find stylesheet":**

**Problema:** Ruta incorrecta en el import.

**Solución:**
```scss
// Desde apps/fronthouse/src/styles.scss son 3 niveles arriba:
@use '../../../libs/shared/ui-components/src/styles' as placemy;
```

---

## 📝 EJEMPLOS DE CÓDIGO COMPLETOS

### **Ejemplo 1: Componente con Tema y Permisos**

```typescript
// dashboard.component.ts
import { Component, inject, computed, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { AuthService } from '../../../../core/services/auth.service';
import { PermissionService } from '@placemy/shared/auth';
import { 
  HeaderComponent, 
  ThemeService, 
  ButtonBurstDirective 
} from '@placemy/shared/ui-components';

interface MenuCard {
  title: string;
  route: string;
  icon: string;
  requiredPermission: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatCardModule,
    ButtonBurstDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  
  private authService = inject(AuthService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);
  private themeService = inject(ThemeService);
  
  currentUser = this.authService.currentUser;
  currentTheme = this.themeService.currentTheme;
  
  // Partículas flotantes
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
  
  // Opciones del menú
  private allMenuCards: MenuCard[] = [
    {
      title: 'Productos',
      route: '/productos',
      icon: 'restaurant_menu',
      requiredPermission: 'productos.ver'
    },
    // ... más opciones
  ];
  
  // Filtrar por permisos
  menuCards = computed(() => {
    return this.allMenuCards.filter(card => 
      this.permissionService.hasPermission(card.requiredPermission)
    );
  });
  
  constructor() {
    // Configurar usuario en el header
    effect(() => {
      if (this.header) {
        this.header.setCurrentUser(this.currentUser());
      }
    });
    
    // Escuchar logout del header
    window.addEventListener('header-logout', () => {
      this.authService.logout().subscribe();
    });
  }
  
  ngOnInit() {
    this.loadUserData();
  }
  
  private loadUserData() {
    this.authService.getMe().subscribe();
  }
  
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
```

```html
<!-- dashboard.component.html -->
<div class="dashboard-container" [attr.data-theme]="currentTheme().name">
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
  
  <div class="dashboard-content">
    <h2>Bienvenido</h2>
    
    <!-- Grid de tarjetas con permisos -->
    <div class="menu-grid">
      <mat-card *ngFor="let card of menuCards()"
                appButtonBurst
                (click)="navigateTo(card.route)">
        <mat-icon>{{ card.icon }}</mat-icon>
        <h3>{{ card.title }}</h3>
      </mat-card>
    </div>
  </div>
</div>
```

```scss
// dashboard.component.scss
@use '../../../../../../libs/shared/ui-components/src/styles/common' as common;

.dashboard-container {
  min-height: 100vh;
  // Fondo heredado del tema
  transition: background 0.8s ease;
}

.dashboard-content {
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  mat-card {
    @include common.glassmorphism-card;
    @include common.shadow-lg;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      @include common.shadow-xl;
    }
  }
}
```

---

## 🚀 COMANDOS ÚTILES

```bash
# Limpiar cache de Nx
npx nx reset

# Servir app fronthouse
npx nx serve fronthouse

# Build para producción
npx nx build fronthouse --configuration=production

# Generar nuevo componente
npx nx g @nx/angular:component nombre --project=fronthouse --standalone

# Generar nueva librería
npx nx g @nx/angular:library nombre --directory=shared

# Lint
npx nx lint fronthouse

# Test
npx nx test fronthouse
```

---

## 📚 RECURSOS Y DOCUMENTACIÓN

- **Angular Docs:** https://angular.dev
- **Nx Docs:** https://nx.dev
- **Material Design:** https://material.angular.io
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## ✅ CHECKLIST PARA NUEVOS COMPONENTES

Al crear un nuevo componente, verificar:

- [ ] Es standalone
- [ ] Usa signals para estado
- [ ] Usa computed para valores derivados
- [ ] Sigue la estructura de carpetas correcta
- [ ] Importa solo lo necesario
- [ ] Los estilos usan mixins de `_common.scss`
- [ ] NO duplica código existente
- [ ] Tiene nombres descriptivos
- [ ] Maneja errores apropiadamente
- [ ] Es responsive
- [ ] Usa el sistema de temas si aplica
- [ ] Respeta los permisos si aplica

---

**FIN DEL PROMPT - PlaceMy Workspace v8.0** 🎨
