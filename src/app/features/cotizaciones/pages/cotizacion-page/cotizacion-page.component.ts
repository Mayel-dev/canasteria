import { Component } from '@angular/core';
import { SummaryTableComponent } from '../../components/summary-table/summary-table.component';
import { ClientFormComponent } from '../../components/client-form/client-form.component';
import { CanastaFormComponent } from '../../components/canasta-form/canasta-form.component';
import { Canasta } from '../../models/canasta.interface';
import { Cliente } from '../../models/client.interface';

@Component({
  selector: 'app-cotizacion-page',
  standalone: true,
  imports: [ClientFormComponent, CanastaFormComponent, SummaryTableComponent],
  templateUrl: './cotizacion-page.component.html',
})
export class CotizacionPageComponent {
  cliente: Cliente | null = null;
  canastasSeleccionadas: { canasta: Canasta; cantidad: number }[] = [];

  guardarCliente(clienteData: Cliente) {
    this.cliente = clienteData;
    console.log('Cliente guardado en página:', this.cliente);
  }

  agregarCanasta(event: { canasta: Canasta; cantidad: number }) {
    this.canastasSeleccionadas.push(event);
  }

  eliminarCanasta(index: number) {
    this.canastasSeleccionadas.splice(index, 1);
  }
}
