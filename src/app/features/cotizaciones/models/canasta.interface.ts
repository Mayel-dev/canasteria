import { Producto } from './producto.interface';

export interface Canasta {
  id: string;
  nombre: string;
  descripcion?: string;
  productos: Producto[];
  precioUnitario: number;
  imagen?: string;
}
