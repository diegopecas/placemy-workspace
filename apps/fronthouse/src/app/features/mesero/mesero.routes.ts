import { Routes } from '@angular/router';

export const MESERO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/mesero-layout/mesero-layout.component').then(
        (m) => m.MeseroLayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/mesero-dashboard/mesero-dashboard.component').then(
            (m) => m.MeseroDashboardComponent
          ),
      },
      {
        path: 'buscar-cliente',
        loadComponent: () =>
          import('./pages/buscar-cliente/buscar-cliente.component').then(
            (m) => m.BuscarClienteComponent
          ),
      },
      {
        path: 'crear-cuenta/:mesaId',
        loadComponent: () =>
          import('./pages/crear-cuenta/crear-cuenta.component').then(
            (m) => m.CrearCuentaComponent
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
    ]
  },
];