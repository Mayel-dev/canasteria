import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// @ts-ignore
pdfMake.vfs = pdfFonts.pdfMake?.vfs || pdfFonts.vfs;
import { Cliente } from '../models/client.interface';
import { Canasta } from '../models/canasta.interface';

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

    // 🔹 Calcular fechas
    const hoy = new Date();
    const fechaValidez = new Date();
    fechaValidez.setDate(hoy.getDate() + 15); // +15 días
    const formatoFecha = (d: Date) =>
      d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // 🔹 Calcular totales
    const total = canastas.reduce(
      (acc, item) => acc + item.canasta.precioUnitario * item.cantidad,
      0
    );
    const subtotal = +(total / 1.18).toFixed(2);
    const igv = +(total - subtotal).toFixed(2);

    // 🔹 Tabla de productos (solo los productos dentro de las canastas)
    const tablaProductos = canastas.flatMap((item, index) => {
      return item.canasta.productos.map((prod, i) => [
        { text: `${index + 1}.${i + 1}`, alignment: 'center', fontSize: 9 },
        { text: prod.cantidad, alignment: 'center', fontSize: 9 },
        { text: prod.nombre, fontSize: 9 },
      ]);
    });

    // 🔹 Definición del documento PDF
    const docDefinition: any = {
      pageSize: 'A4',
      pageMargins: [40, 40, 40, 60],
      content: [
        // 🔺 ENCABEZADO ROJO
        {
          table: {
            widths: ['*'],
            body: [
              [
                {
                  text: 'COTIZACIÓN',
                  fillColor: '#E30613',
                  color: 'white',
                  alignment: 'center',
                  fontSize: 14,
                  bold: true,
                  margin: [0, 4],
                },
              ],
            ],
          },
          layout: 'noBorders',
        },
        {
          columns: [
            [
              { text: `Empresa: ${cliente.empresa}`, bold: true },
              { text: `Contacto: ${cliente.contacto}` },
              { text: `RUC: ${cliente.ruc}` },
              { text: `Dirección: ${cliente.direccion}` },
            ],
            [
              { text: `Teléfono: ${cliente.telefono}` },
              { text: `Email: ${cliente.email}` },
              { text: `Distrito de entrega: ${cliente.distrito}` },
              {
                text: `VALIDEZ DE OFERTA: ${formatoFecha(fechaValidez)}`,
                background: '#FFF59D',
                bold: true,
                alignment: 'center',
                margin: [0, 3, 0, 0],
              },
            ],
          ],
          margin: [0, 10, 0, 10],
          columnGap: 20,
        },

        // 🔹 TÍTULO DE CANASTA
        {
          text: `DETALLE DE CANASTAS`,
          fillColor: '#007E33',
          color: 'white',
          bold: true,
          alignment: 'center',
          margin: [0, 6, 0, 6],
        },

        // 🔹 TABLA DE PRODUCTOS
        {
          table: {
            headerRows: 1,
            widths: [30, 35, '*'],
            body: [
              [
                { text: 'Item', style: 'tableHeader', alignment: 'center' },
                { text: 'Cant.', style: 'tableHeader', alignment: 'center' },
                { text: 'Detalle', style: 'tableHeader' },
              ],
              ...tablaProductos,
            ],
          },
          layout: {
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#4CAF50',
            vLineColor: () => '#4CAF50',
          },
          margin: [0, 5, 0, 10],
        },

        // 🔹 TOTALES
        {
          table: {
            widths: ['*', 100],
            body: [
              [
                { text: 'SUBTOTAL (sin IGV):', alignment: 'right', bold: true },
                { text: `S/ ${subtotal.toFixed(2)}`, alignment: 'right' },
              ],
              [
                { text: 'IGV (18% incluido):', alignment: 'right', bold: true },
                { text: `S/ ${igv.toFixed(2)}`, alignment: 'right' },
              ],
              [
                { text: 'TOTAL:', alignment: 'right', bold: true },
                { text: `S/ ${total.toFixed(2)}`, alignment: 'right', bold: true },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 10, 0, 0],
        },

        // 🔸 NOTA FINAL
        {
          text: '50% adelantado — 50% contraentrega',
          alignment: 'center',
          margin: [0, 20, 0, 0],
          bold: true,
          fontSize: 10,
        },
      ],
    };

    pdfMake.createPdf(docDefinition).open();
  }
}
