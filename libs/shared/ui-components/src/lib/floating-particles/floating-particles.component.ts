// libs/shared/ui-components/src/lib/floating-particles/floating-particles.component.ts
import { Component, inject, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-floating-particles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './floating-particles.component.html',
  styleUrl: './floating-particles.component.scss',
})
export class FloatingParticlesComponent {
  private themeService = inject(ThemeService);

  // Inputs configurables
  @Input() particleCount = 20;
  @Input() starCount = 80;
  @Input() showStars = true;

  currentTheme = this.themeService.currentTheme;

  // Partículas
  floatingParticles = computed(() => {
    const theme = this.currentTheme();
    return Array.from({ length: this.particleCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 15, // 10-25 segundos (suave)
      icon: theme.decorativeElements[
        Math.floor(Math.random() * theme.decorativeElements.length)
      ],
    }));
  });
  // Estrellas
  stars = computed(() => {
    return Array.from({ length: this.starCount }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: 0.2 + Math.random() * 0.3, // 0.2-0.5 segundos (PARPADEO)
    }));
  });
}
