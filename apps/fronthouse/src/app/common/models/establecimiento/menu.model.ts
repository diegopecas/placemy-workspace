import { PlatoMenu } from './plato.model';
import { ProductoMenu } from './producto.model';

export interface MenuCompleto {
  platos: PlatoMenu[];
  productos: ProductoMenu[];
}

export interface MenuCompletoResponse {
  success: boolean;
  data: MenuCompleto;
  message?: string;
}