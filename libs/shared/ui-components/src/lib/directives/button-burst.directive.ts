// libs/shared/ui-components/src/lib/directives/button-burst.directive.ts
import { Directive, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import { ThemeService } from '../services/theme.service';

/**
 * Directiva que crea una explosión de iconos temáticos al hacer clic en un botón
 * 
 * Uso:
 * <button appButtonBurst>Click me</button>
 */
@Directive({
  selector: '[appButtonBurst]',
  standalone: true
})
export class ButtonBurstDirective {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private themeService = inject(ThemeService);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.createBurst(event);
  }

  private createBurst(event: MouseEvent): void {
    const theme = this.themeService.currentTheme();
    const buttonRect = this.el.nativeElement.getBoundingClientRect();
    
    // Posición del clic relativa al viewport
    const clickX = event.clientX;
    const clickY = event.clientY;

    // Crear 3 iconos que explotan
    for (let i = 0; i < 3; i++) {
      this.createBurstIcon(clickX, clickY, theme.decorativeElements, i);
    }
  }

  private createBurstIcon(x: number, y: number, icons: string[], index: number): void {
    // Seleccionar un icono aleatorio del tema
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    
    // Crear el elemento del icono
    const icon = this.renderer.createElement('div');
    this.renderer.addClass(icon, 'burst-icon');
    this.renderer.setStyle(icon, 'position', 'fixed');
    this.renderer.setStyle(icon, 'left', `${x}px`);
    this.renderer.setStyle(icon, 'top', `${y}px`);
    this.renderer.setStyle(icon, 'font-size', '2rem');
    this.renderer.setStyle(icon, 'pointer-events', 'none');
    this.renderer.setStyle(icon, 'z-index', '9999');
    this.renderer.setStyle(icon, 'user-select', 'none');
    
    // Texto del icono
    const text = this.renderer.createText(randomIcon);
    this.renderer.appendChild(icon, text);
    
    // Agregar al body
    this.renderer.appendChild(document.body, icon);
    
    // Calcular ángulo de explosión (120 grados de separación)
    const angle = (index * 120) - 60; // -60°, 60°, 180°
    const distance = 100 + Math.random() * 50; // 100-150px
    const angleRad = (angle * Math.PI) / 180;
    
    // Calcular posición final
    const endX = x + Math.cos(angleRad) * distance;
    const endY = y + Math.sin(angleRad) * distance;
    
    // Animación
    const duration = 800;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      // Calcular posición actual
      const currentX = x + (endX - x) * easeProgress;
      const currentY = y + (endY - y) * easeProgress;
      
      // Calcular opacidad (desaparece al final)
      const opacity = 1 - progress;
      
      // Calcular escala (crece un poco y luego decrece)
      const scale = 1 + (Math.sin(progress * Math.PI) * 0.5);
      
      // Aplicar transformaciones
      this.renderer.setStyle(icon, 'left', `${currentX}px`);
      this.renderer.setStyle(icon, 'top', `${currentY}px`);
      this.renderer.setStyle(icon, 'opacity', opacity.toString());
      this.renderer.setStyle(icon, 'transform', `translate(-50%, -50%) scale(${scale}) rotate(${progress * 360}deg)`);
      this.renderer.setStyle(icon, 'filter', `drop-shadow(0 0 ${10 * (1 - progress)}px currentColor)`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Remover el elemento cuando termine la animación
        this.renderer.removeChild(document.body, icon);
      }
    };
    
    requestAnimationFrame(animate);
  }
}
