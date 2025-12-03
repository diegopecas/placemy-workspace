import { Routes } from '@angular/router';

export const MESERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/mesero-dashboard/mesero-dashboard.component').then(
        (m) => m.MeseroDashboardComponent
      ),
  },
  {
    path: 'cuenta/:mesaId',
    loadComponent: () =>
      import('./pages/tomar-pedido/tomar-pedido.component').then(
        (m) => m.TomarPedidoComponent
      ),
  },
  {
    path: 'cuenta/:mesaId/ver/:cuentaId',
    loadComponent: () =>
      import('./pages/tomar-pedido/tomar-pedido.component').then(
        (m) => m.TomarPedidoComponent
      ),
  },
];