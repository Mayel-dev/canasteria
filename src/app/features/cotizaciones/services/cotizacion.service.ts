import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;
import { Cliente } from '../models/client.interface';
import { Canasta } from '../models/canasta.interface';
import { buildCotizacionBasicaDocDefinition } from '../pdf-templates/cotizacion-basica.template';

@Injectable({
  providedIn: 'root',
})
export class CotizacionService {
  constructor() {}

  generarCotizacionPDF(cliente: Cliente, canastas: { canasta: Canasta; cantidad: number }[]) {
    if (!cliente || canastas.length === 0) {
      alert('Faltan datos para generar la cotización.');
      return;
    }

    // Build the PDF docDefinition using the template
    const docDefinition = buildCotizacionBasicaDocDefinition(cliente, canastas, {
      locale: 'es-PE',
      fechaValidezDays: 15,
    });

    // Generate and open the PDF
    pdfMake.createPdf(docDefinition).open();
  }
}
