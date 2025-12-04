// apps/fronthouse/src/app/features/mesero/components/alerta-alergia/alerta-alergia.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Alergeno } from '../../../../common/models/establecimiento/alergeno.model';

@Component({
  selector: 'app-alerta-alergia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta-alergia.component.html',
  styleUrl: './alerta-alergia.component.scss'
})
export class AlertaAlergiaComponent {
  @Input() alergenos: Alergeno[] = [];
  @Input() nombreItem = '';

  @Output() continuar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();

  onContinuar(): void {
    this.continuar.emit();
  }

  onCancelar(): void {
    this.cancelar.emit();
  }
}