import { Cliente } from '../models/client.interface';
import { Canasta } from '../models/canasta.interface';

export interface CotizacionBasicaOptions {
  locale?: string;
  fechaValidezDays?: number;
  fecha?: Date;
  condicionesPago?: string;
}

/**
 * Builds a PDFMake docDefinition for a basic invoice quotation (cotización básica)
 * Extracts design and calculations from the service logic.
 *
 * @param cliente - Client information
 * @param canastas - Array of canastas with quantities
 * @param options - Optional configuration (locale, validity days, payment conditions)
 * @returns PDFMake docDefinition object
 */
export function buildCotizacionBasicaDocDefinition(
  cliente: Cliente,
  canastas: { canasta: Canasta; cantidad: number }[],
  options?: CotizacionBasicaOptions
): any {
  const locale = options?.locale || 'es-PE';
  const fechaValidezDays = options?.fechaValidezDays || 15;
  const condicionesPago = options?.condicionesPago || '50% adelantado — 50% contraentrega';

  // 🔹 Calcular fechas
  const hoy = options?.fecha || new Date();
  const fechaValidez = new Date(hoy);
  fechaValidez.setDate(hoy.getDate() + fechaValidezDays);

  const formatoFecha = (d: Date) =>
    d.toLocaleDateString(locale, { day: '2-digit', month: '2-digit', year: 'numeric' });

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
        text: condicionesPago,
        alignment: 'center',
        margin: [0, 20, 0, 0],
        bold: true,
        fontSize: 10,
      },
    ],
  };

  return docDefinition;
}
