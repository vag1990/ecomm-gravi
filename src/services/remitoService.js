// src/services/remitoService.js
// Genera un remito PDF profesional usando jsPDF
// Instalación: npm install jspdf

import { jsPDF } from 'jspdf'

const fmt = n => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(n)

const BRAND = {
  name:    'Terrazo Shop',
  tagline: 'Diseño en cemento y piedra natural',
  email:   'info@terrazoshop.com',
  phone:   '+54 9 11 0000-0000',
  address: 'Buenos Aires, Argentina',
  web:     'www.terrazoshop.com',
}

// colores en RGB
const COLOR = {
  dark:   [58,  46,  36],   // #3a2e24
  mid:    [143, 122, 98],   // #8f7a62
  light:  [194, 181, 163],  // #c2b5a3
  bg:     [247, 245, 242],  // #f7f5f2
  bgAlt:  [237, 233, 227],  // #ede9e3
  white:  [255, 255, 255],
  green:  [59,  109, 17],
  red:    [153, 60,  29],
}

function setColor(doc, rgb, type = 'text') {
  if (type === 'text') doc.setTextColor(...rgb)
  else if (type === 'fill') doc.setFillColor(...rgb)
  else if (type === 'draw') doc.setDrawColor(...rgb)
}

export async function generarRemito({ items, customer, cartTotal, envio, total }) {
  const doc  = new jsPDF({ unit: 'mm', format: 'a4' })
  const W    = 210   // ancho A4
  const PAD  = 18    // margen lateral
  let   y    = 0     // cursor vertical

  const orderId = `TS-${Date.now().toString(36).toUpperCase()}`
  const fecha   = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })

  // ── HEADER ───────────────────────────────────────────────────────────────
  setColor(doc, COLOR.dark, 'fill')
  doc.rect(0, 0, W, 42, 'F')

  // logo cuadrado
  setColor(doc, COLOR.light, 'fill')
  doc.rect(PAD, 10, 10, 10, 'F')

  // nombre marca
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  setColor(doc, COLOR.white, 'text')
  doc.text(BRAND.name, PAD + 14, 17)

  // tagline
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setColor(doc, COLOR.light, 'text')
  doc.text(BRAND.tagline, PAD + 14, 23)

  // REMITO label (derecha)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  setColor(doc, COLOR.white, 'text')
  doc.text('REMITO', W - PAD, 18, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setColor(doc, COLOR.light, 'text')
  doc.text(`N° ${orderId}`, W - PAD, 24, { align: 'right' })
  doc.text(fecha,            W - PAD, 30, { align: 'right' })

  y = 52

  // ── INFO EMPRESA + CLIENTE ─────────────────────────────────────────────
  const col1 = PAD
  const col2 = W / 2 + 4

  // bloque empresa
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, COLOR.mid, 'text')
  doc.text('EMISOR', col1, y)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor(doc, COLOR.dark, 'text')
  doc.text(BRAND.name,    col1, y + 6)
  doc.text(BRAND.address, col1, y + 11)
  doc.text(BRAND.email,   col1, y + 16)
  doc.text(BRAND.phone,   col1, y + 21)
  doc.text(BRAND.web,     col1, y + 26)

  // bloque cliente
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  setColor(doc, COLOR.mid, 'text')
  doc.text('CLIENTE', col2, y)

  const nombre = `${customer.nombre} ${customer.apellido}`.trim() || '—'
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor(doc, COLOR.dark, 'text')
  doc.text(nombre,                       col2, y + 6)
  doc.text(customer.email || '—',        col2, y + 11)
  doc.text(customer.telefono || '—',     col2, y + 16)
  doc.text(customer.direccion || '—',    col2, y + 21)

  y += 38

  // línea separadora
  setColor(doc, COLOR.light, 'draw')
  doc.setLineWidth(0.3)
  doc.line(PAD, y, W - PAD, y)
  y += 8

  // ── TABLA DE PRODUCTOS ─────────────────────────────────────────────────
  // cabecera
  setColor(doc, COLOR.dark, 'fill')
  doc.rect(PAD, y, W - PAD * 2, 8, 'F')

  const COL = {
    prod:  PAD + 3,
    cat:   PAD + 78,
    qty:   PAD + 112,
    price: PAD + 136,
    sub:   W - PAD - 3,
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  setColor(doc, COLOR.white, 'text')
  doc.text('PRODUCTO',   COL.prod,  y + 5)
  doc.text('CATEGORÍA',  COL.cat,   y + 5)
  doc.text('CANT.',      COL.qty,   y + 5, { align: 'right' })
  doc.text('P. UNITARIO',COL.price, y + 5, { align: 'right' })
  doc.text('SUBTOTAL',   COL.sub,   y + 5, { align: 'right' })
  y += 8

  // filas
  items.forEach((item, idx) => {
    const rowH = 10
    if (idx % 2 === 0) {
      setColor(doc, COLOR.bgAlt, 'fill')
      doc.rect(PAD, y, W - PAD * 2, rowH, 'F')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setColor(doc, COLOR.dark, 'text')
    doc.text(item.name, COL.prod, y + 6.5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    setColor(doc, COLOR.mid, 'text')

    const catText = item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : '—'
    doc.text(catText,           COL.cat,   y + 6.5)
    doc.text(`${item.quantity}`,COL.qty,   y + 6.5, { align: 'right' })

    setColor(doc, COLOR.dark, 'text')
    doc.text(fmt(item.price),             COL.price, y + 6.5, { align: 'right' })
    doc.text(fmt(item.price * item.quantity), COL.sub, y + 6.5, { align: 'right' })

    y += rowH
  })

  // borde tabla
  setColor(doc, COLOR.light, 'draw')
  doc.setLineWidth(0.3)
  doc.rect(PAD, y - items.length * 10 - 8, W - PAD * 2, items.length * 10 + 8, 'S')

  y += 10

  // ── TOTALES ───────────────────────────────────────────────────────────
  const totalX  = W - PAD
  const labelX  = W - PAD - 55

  // subtotal
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  setColor(doc, COLOR.mid, 'text')
  doc.text('Subtotal productos:', labelX, y, { align: 'right' })
  setColor(doc, COLOR.dark, 'text')
  doc.text(fmt(cartTotal), totalX, y, { align: 'right' })
  y += 7

  // envío
  setColor(doc, COLOR.mid, 'text')
  doc.text('Envío:', labelX, y, { align: 'right' })
  if (envio === 0) {
    setColor(doc, COLOR.green, 'text')
    doc.text('Sin cargo', totalX, y, { align: 'right' })
  } else {
    setColor(doc, COLOR.dark, 'text')
    doc.text(fmt(envio), totalX, y, { align: 'right' })
  }
  y += 9

  // línea total
  setColor(doc, COLOR.dark, 'draw')
  doc.setLineWidth(0.5)
  doc.line(labelX - 30, y - 2, totalX, y - 2)
  y += 3

  // total
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  setColor(doc, COLOR.dark, 'text')
  doc.text('TOTAL:', labelX, y, { align: 'right' })
  doc.setFontSize(14)
  doc.text(fmt(total), totalX, y, { align: 'right' })
  y += 12

  // ── NOTAS ─────────────────────────────────────────────────────────────
  if (customer.notas) {
    setColor(doc, COLOR.bgAlt, 'fill')
    doc.rect(PAD, y, W - PAD * 2, 4, 'F') // solo encabezado

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setColor(doc, COLOR.mid, 'text')
    doc.text('NOTAS DEL PEDIDO', PAD + 3, y + 2.8)
    y += 7

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    setColor(doc, COLOR.dark, 'text')
    const lines = doc.splitTextToSize(customer.notas, W - PAD * 2 - 6)
    doc.text(lines, PAD + 3, y)
    y += lines.length * 5 + 6
  }

  // ── CONDICIONES ───────────────────────────────────────────────────────
  y += 4
  setColor(doc, COLOR.light, 'draw')
  doc.setLineWidth(0.2)
  doc.line(PAD, y, W - PAD, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7.5)
  setColor(doc, COLOR.mid, 'text')
  doc.text('CONDICIONES', PAD, y)
  y += 5

  const condiciones = [
    '· Este remito no tiene valor fiscal. Es un comprobante de pedido.',
    '· El pago y la coordinación de entrega se confirman por email o WhatsApp.',
    '· Los precios están expresados en pesos argentinos (ARS).',
    '· El envío sin cargo aplica a pedidos mayores a $300.000 dentro de CABA y GBA.',
    '· Las piezas son artesanales — pueden existir variaciones menores en textura y color.',
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setColor(doc, COLOR.mid, 'text')
  condiciones.forEach(c => {
    doc.text(c, PAD, y)
    y += 4.5
  })

  // ── FOOTER ────────────────────────────────────────────────────────────
  const footerY = 285
  setColor(doc, COLOR.dark, 'fill')
  doc.rect(0, footerY, W, 12, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  setColor(doc, COLOR.light, 'text')
  doc.text(`${BRAND.name} · ${BRAND.web} · ${BRAND.email}`, W / 2, footerY + 7, { align: 'center' })

  // ── DESCARGAR ─────────────────────────────────────────────────────────
  doc.save(`remito-${orderId}.pdf`)

  return orderId
}
