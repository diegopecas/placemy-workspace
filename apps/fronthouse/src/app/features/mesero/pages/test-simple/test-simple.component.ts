// apps/fronthouse/src/app/features/mesero/pages/test-simple/test-simple.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-simple',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 40px; background: #f0f0f0; min-height: 100vh;">
      <h1 style="color: green;">✅ COMPONENTE TEST SIMPLE</h1>
      <p>Si ves esto sin recarga = el routing funciona bien</p>
      <p>URL actual: {{ getCurrentUrl() }}</p>
      
      <button 
        type="button"
        (click)="volver()" 
        style="padding: 10px 20px; background: blue; color: white; border: none; cursor: pointer; margin-top: 20px;">
        Volver al Dashboard
      </button>
    </div>
  `,
  styles: []
})
export class TestSimpleComponent {
  constructor(private router: Router) {
    console.log('🟢 TestSimpleComponent CREADO');
  }

  getCurrentUrl(): string {
    return this.router.url;
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}