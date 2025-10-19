import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Cliente } from '../../models/client.interface';
import { Canasta } from '../../models/canasta.interface';
import { CotizacionService } from '../../services/cotizacion.service';

@Component({
  selector: 'app-summary-table',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './summary-table.component.html',
})
export class SummaryTableComponent {
  @Input() cliente: Cliente | null = null;
  @Input() items: { canasta: Canasta; cantidad: number }[] = [];
  @Output() eliminar = new EventEmitter<number>();

  constructor(private cotizacionService: CotizacionService) {} // ✅ Inyección del servicio

  /** Total con IGV incluido */
  get total(): number {
    return this.items.reduce((acc, it) => acc + it.canasta.precioUnitario * it.cantidad, 0);
  }

  /** Subtotal sin IGV */
  get subtotal(): number {
    return +(this.total / 1.18).toFixed(2);
  }

  /** IGV incluido dentro del total */
  get igv(): number {
    return +(this.total - this.subtotal).toFixed(2);
  }

  generarPDF() {
    if (!this.cliente || this.items.length === 0) {
      alert('Faltan datos del cliente o canastas para generar la cotización.');
      return;
    }

    this.cotizacionService.generarCotizacionPDF(this.cliente, this.items);
  }
}
