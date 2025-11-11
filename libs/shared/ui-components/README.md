# @placemy/shared/ui-components

Librería de componentes UI compartidos para el workspace PlaceMy.

## 📦 Contenido

- **HeaderComponent**: Componente de cabecera reutilizable
- **FooterComponent**: (Futuro) Componente de pie de página
- **SidebarComponent**: (Futuro) Componente de navegación lateral

## 🚀 Instalación

Esta librería es parte del monorepo y no requiere instalación adicional.

## 📖 Uso

### HeaderComponent

**Importar en tu componente:**
```typescript
import { HeaderComponent } from '@placemy/shared/ui-components';
import { AuthService } from './core/services/auth.service';

@Component({
  imports: [HeaderComponent]
})
export class MiComponente implements OnInit {
  @ViewChild(HeaderComponent) header!: HeaderComponent;
  private authService = inject(AuthService);

  ngOnInit() {
    // Configurar el usuario en el header
    this.authService.currentUser$.subscribe(user => {
      this.header.setCurrentUser(user);
    });

    // O usar signals
    effect(() => {
      this.header.setCurrentUser(this.authService.currentUser());
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

**Manejar el evento de logout:**
```typescript
ngOnInit() {
  // Escuchar el evento de logout
  window.addEventListener('header-logout', () => {
    this.authService.logout().subscribe();
  });
}
```

## 🎨 Características del Header

- ✅ Logo PlaceMy con navegación al dashboard
- ✅ Información del usuario (nombre, rol)
- ✅ Avatar con iniciales del usuario
- ✅ Menú desplegable con opciones:
  - Mi Perfil
  - Dashboard
  - Cerrar Sesión (con confirmación SweetAlert2)
- ✅ Diseño responsive (oculta detalles en móvil)
- ✅ Sticky positioning
- ✅ Tema consistente con PlaceMy

## 🔧 Configuración

El header necesita que se le pase el usuario actual:

```typescript
// Opción 1: Manualmente
header.setCurrentUser(user);

// Opción 2: Automáticamente con signals
effect(() => {
  header.setCurrentUser(this.authService.currentUser());
});
```

## 🎯 Eventos

### `header-logout`

Evento personalizado que se emite cuando el usuario confirma cerrar sesión.

```typescript
window.addEventListener('header-logout', () => {
  // Manejar el logout
  this.authService.logout().subscribe();
});
```

## 📝 Notas

- El header usa Angular Material para los componentes UI
- Requiere SweetAlert2 para las confirmaciones
- Usa las variables CSS del tema PlaceMy
- Es completamente standalone (no requiere NgModule)

## 🔗 Dependencias

- `@angular/material` - Componentes UI
- `sweetalert2` - Alertas y confirmaciones
- `@placemy/shared/auth` - Modelo User

## 🎨 Personalización

El header usa las variables CSS definidas en `styles.scss`:

```scss
--primary: #8B2635;        // Color principal
--brand-gold: #C9975B;     // Color del logo
--accent: #FF6B6B;         // Color de acento
--secondary: #17BEBB;      // Color secundario
```

## 📋 Futuras Mejoras

- [ ] Agregar soporte para notificaciones
- [ ] Agregar búsqueda global
- [ ] Agregar breadcrumbs
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
