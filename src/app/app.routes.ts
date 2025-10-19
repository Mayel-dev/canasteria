import { Routes } from '@angular/router';
import { CotizacionPageComponent } from './features/cotizaciones/pages/cotizacion-page/cotizacion-page.component';

export const routes: Routes = [
  {
    path: 'cotizacion',
    component: CotizacionPageComponent,
  },
  {
    path: '**',
    redirectTo: 'cotizacion',
  },
];
