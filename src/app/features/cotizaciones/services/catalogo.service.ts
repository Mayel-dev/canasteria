import { Injectable } from '@angular/core';
import { Canasta } from '../models/canasta.interface';
import { CANASTAS } from '../../../data/canastas.data';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private canastas: Canasta[] = CANASTAS;

  getCanastas(): Canasta[] {
    return this.canastas;
  }

  getCanastaById(id: string): Canasta | undefined {
    return this.canastas.find((c) => c.id === id);
  }
}
