// apps/fronthouse/src/app/features/mesero/components/resumen-cuenta/resumen-cuenta.component.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@placemy/shared/ui-components';

@Component({
  selector: 'app-resumen-cuenta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-cuenta.component.html',
  styleUrl: './resumen-cuenta.component.scss'
})
export class ResumenCuentaComponent {
  private themeService = inject(ThemeService);

  @Input() subtotal = 0;
  @Input() impuestos = 0;
  @Input() descuentos = 0;
  @Input() propina = 0;
  @Input() total = 0;
  @Input() cuentaCreada = false;
  @Input() guardando = false;

  @Output() crearCuenta = new EventEmitter<void>();
  @Output() guardarCambios = new EventEmitter<void>();

  // Tema actual
  currentTheme = this.themeService.currentTheme;

  onCrearCuenta(): void {
    this.crearCuenta.emit();
  }

  onGuardarCambios(): void {
    this.guardarCambios.emit();
  }

  get porcentajeImpuestos(): number {
    return this.subtotal > 0 ? (this.impuestos / this.subtotal) * 100 : 0;
  }
}