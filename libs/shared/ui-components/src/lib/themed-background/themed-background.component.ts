// libs/shared/ui-components/src/lib/themed-background/themed-background.component.ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

/**
 * Componente de fondo animado temático
 * 
 * Muestra un fondo con gradiente animado que cambia según el tema activo
 * 
 * Uso:
 * <app-themed-background></app-themed-background>
 */
@Component({
  selector: 'app-themed-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="themed-backdrop" [attr.data-theme]="currentTheme().name">
      <!-- Capa de gradiente animado -->
      <div class="gradient-layer"></div>
      
      <!-- Capa de overlay oscuro -->
      <div class="overlay-layer"></div>
      
      <!-- Partículas flotantes temáticas -->
      <div class="background-particles">
        <div *ngFor="let p of backgroundParticles()" 
             class="bg-particle"
             [style.left.%]="p.x"
             [style.top.%]="p.y"
             [style.animation-delay.s]="p.delay"
             [style.animation-duration.s]="p.duration"
             [style.font-size.rem]="p.size">
          {{ p.icon }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .themed-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }

    .gradient-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        var(--primary) 0%,
        var(--accent) 50%,
        var(--primary) 100%
      );
      background-size: 400% 400%;
      animation: gradientShift 15s ease infinite;
    }

    .overlay-layer {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
    }

    .background-particles {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    }

    .bg-particle {
      position: absolute;
      opacity: 0;
      animation: floatUpBackground linear infinite;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
      will-change: transform, opacity;
    }

    @keyframes gradientShift {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes floatUpBackground {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }

    // Responsive
    @media (max-width: 768px) {
      .bg-particle {
        font-size: 1.2rem !important;
      }
    }
  `]
})
export class ThemedBackgroundComponent {
  private themeService = inject(ThemeService);
  
  currentTheme = this.themeService.currentTheme;

  // Partículas flotantes de fondo (menos que en el dashboard)
  backgroundParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: 15 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 20 + Math.random() * 15,
      size: 1.5 + Math.random() * 1,
      icon: theme.decorativeElements[Math.floor(Math.random() * theme.decorativeElements.length)]
    }));
  });
}
