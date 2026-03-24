import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { generarRemito } from '../services/remitoService'

const fmt = n => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(n)

// ─── selector de cantidad ──────────────────────────────────────────────────
function QtySelector({ value, onChange }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center',
      border: '1px solid #d9d1c5',
    }}>
      <button
        onClick={() => onChange(value - 1)}
        style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', color: '#8f7a62', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >−</button>
      <span style={{ width: 36, textAlign: 'center', fontSize: 14, color: '#3a2e24', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', color: '#8f7a62', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >+</button>
    </div>
  )
}

// ─── fila de producto ──────────────────────────────────────────────────────
function CartRow({ item }) {
  const { updateQty, removeFromCart } = useCart()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '64px 1fr auto auto auto',
      gap: 20, alignItems: 'center',
      padding: '20px 0',
      borderBottom: '1px solid #ede9e3',
    }}>
      {/* miniatura */}
      <div style={{ width: 64, height: 64, backgroundColor: '#ede9e3', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: '#c2b5a3' }} viewBox="0 0 100 100">
          {Array.from({ length: 14 }, (_, i) => (
            <circle key={i}
              cx={10 + (i * 17) % 80} cy={10 + (i * 23) % 80}
              r={1 + (i % 3)} fill="currentColor" opacity={0.2 + (i % 4) * 0.1}
            />
          ))}
        </svg>
      </div>

      {/* info */}
      <div>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 500, color: '#3a2e24', margin: '0 0 3px' }}>
          {item.name}
        </p>
        <p style={{ fontSize: 12, color: '#8f7a62', margin: '0 0 2px', textTransform: 'capitalize' }}>
          {item.category}
        </p>
        {item.material && (
          <p style={{ fontSize: 11, color: '#a99680', margin: 0 }}>{item.material}</p>
        )}
      </div>

      {/* precio unitario */}
      <div style={{ textAlign: 'right', minWidth: 100 }}>
        <p style={{ fontSize: 11, color: '#a99680', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>c/u</p>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 15, color: '#5e4d3d', margin: 0 }}>
          {fmt(item.price)}
        </p>
      </div>

      {/* cantidad */}
      <QtySelector value={item.quantity} onChange={qty => updateQty(item.id, qty)} />

      {/* subtotal + eliminar */}
      <div style={{ textAlign: 'right', minWidth: 110 }}>
        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#3a2e24', margin: '0 0 6px' }}>
          {fmt(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeFromCart(item.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#c2b5a3', letterSpacing: '0.05em', textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

// ─── formulario de datos del cliente ──────────────────────────────────────
function CustomerForm({ data, onChange }) {
  const field = (label, key, type = 'text', required = false) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, color: '#8f7a62', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#D85A30' }}> *</span>}
      </label>
      <input
        type={type}
        value={data[key]}
        onChange={e => onChange({ ...data, [key]: e.target.value })}
        required={required}
        style={{
          padding: '10px 12px', fontSize: 14, color: '#3a2e24',
          border: '1px solid #d9d1c5', background: '#f7f5f2',
          outline: 'none', width: '100%', boxSizing: 'border-box',
          fontFamily: 'inherit',
        }}
      />
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      {field('Nombre', 'nombre', 'text', true)}
      {field('Apellido', 'apellido', 'text', true)}
      <div style={{ gridColumn: '1 / -1' }}>
        {field('Email', 'email', 'email', true)}
      </div>
      {field('Teléfono', 'telefono')}
      <div style={{ gridColumn: '1 / -1' }}>
        {field('Dirección de entrega', 'direccion')}
      </div>
      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ fontSize: 11, color: '#8f7a62', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
          Notas del pedido
        </label>
        <textarea
          value={data.notas}
          onChange={e => onChange({ ...data, notas: e.target.value })}
          rows={3}
          placeholder="Medidas especiales, instrucciones de entrega..."
          style={{
            padding: '10px 12px', fontSize: 13, color: '#3a2e24',
            border: '1px solid #d9d1c5', background: '#f7f5f2',
            outline: 'none', width: '100%', boxSizing: 'border-box',
            resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
          }}
        />
      </div>
    </div>
  )
}

// ─── CartPage ──────────────────────────────────────────────────────────────
const CUSTOMER_INIT = { nombre: '', apellido: '', email: '', telefono: '', direccion: '', notas: '' }

export default function CartPage() {
  const { items, cartTotal, cartCount, isEmpty, clearCart } = useCart()
  const [customer, setCustomer] = useState(CUSTOMER_INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const envio    = cartTotal > 300000 ? 0 : 15000
  const total    = cartTotal + envio
  const canSubmit = customer.nombre && customer.apellido && customer.email && !loading

  const handleGenerarRemito = async () => {
    if (!canSubmit) { setError('Completá nombre, apellido y email para continuar.'); return }
    setError('')
    setLoading(true)
    try {
      await generarRemito({ items, customer, cartTotal, envio, total })
    } catch (e) {
      setError('Hubo un error al generar el remito. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  // ── carrito vacío ─────────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c2b5a3" strokeWidth="1" style={{ marginBottom: 20 }}>
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 400, color: '#3a2e24', margin: '0 0 10px' }}>
          Tu carrito está vacío
        </h1>
        <p style={{ fontSize: 14, color: '#8f7a62', margin: '0 0 32px' }}>
          Explorá nuestra colección y encontrá tu pieza ideal.
        </p>
        <Link to="/" style={{
          backgroundColor: '#3a2e24', color: '#f7f5f2',
          padding: '13px 36px', fontSize: 12,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Ver colección
        </Link>
      </div>
    )
  }

  // ── carrito con items ─────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* encabezado */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, color: '#a99680', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            Tu pedido
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 400, color: '#3a2e24', margin: '0 0 4px' }}>
            Carrito
          </h1>
          <p style={{ fontSize: 13, color: '#8f7a62', margin: 0 }}>
            {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'start' }}>

          {/* ── columna izquierda ─────────────────────────────────────── */}
          <div>
            {/* lista de items */}
            <div style={{ marginBottom: 40 }}>
              {/* cabecera tabla */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '64px 1fr auto auto auto',
                gap: 20,
                paddingBottom: 12,
                borderBottom: '1px solid #3a2e24',
                fontSize: 10, color: '#a99680',
                letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                <span />
                <span>Producto</span>
                <span style={{ textAlign: 'right' }}>Precio</span>
                <span>Cantidad</span>
                <span style={{ textAlign: 'right' }}>Subtotal</span>
              </div>

              {items.map(item => <CartRow key={item.id} item={item} />)}

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 16 }}>
                <button
                  onClick={clearCart}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#c2b5a3', textDecoration: 'underline', textUnderlineOffset: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>

            {/* formulario cliente */}
            <div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, fontWeight: 400, color: '#3a2e24', margin: '0 0 20px' }}>
                Datos del pedido
              </h2>
              <CustomerForm data={customer} onChange={setCustomer} />
            </div>
          </div>

          {/* ── columna derecha: resumen ───────────────────────────────── */}
          <div style={{
            backgroundColor: '#ede9e3',
            border: '1px solid #d9d1c5',
            padding: 28,
            position: 'sticky', top: 88,
          }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 400, color: '#3a2e24', margin: '0 0 24px' }}>
              Resumen
            </h2>

            {/* detalle items */}
            <div style={{ marginBottom: 20 }}>
              {items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: '#5e4d3d', flex: 1, marginRight: 12 }}>
                    {item.name}
                    <span style={{ color: '#a99680', marginLeft: 6 }}>×{item.quantity}</span>
                  </span>
                  <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: '#3a2e24', whiteSpace: 'nowrap' }}>
                    {fmt(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #c2b5a3', paddingTop: 16, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#8f7a62' }}>Subtotal productos</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: '#3a2e24' }}>{fmt(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontSize: 13, color: '#8f7a62' }}>Envío</span>
                <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 14, color: envio === 0 ? '#3B6D11' : '#3a2e24' }}>
                  {envio === 0 ? 'Gratis' : fmt(envio)}
                </span>
              </div>
              {envio === 0 && (
                <p style={{ fontSize: 11, color: '#3B6D11', margin: '0 0 16px', letterSpacing: '0.03em' }}>
                  Envío sin cargo en pedidos mayores a {fmt(300000)}
                </p>
              )}
            </div>

            <div style={{ borderTop: '1px solid #3a2e24', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: '#3a2e24', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, color: '#3a2e24' }}>
                {fmt(total)}
              </span>
            </div>

            {error && (
              <p style={{ fontSize: 12, color: '#993C1D', backgroundColor: '#FAECE7', padding: '8px 12px', marginBottom: 14, lineHeight: 1.5 }}>
                {error}
              </p>
            )}

            <button
              onClick={handleGenerarRemito}
              disabled={loading}
              style={{
                display: 'block', width: '100%',
                backgroundColor: loading ? '#8f7a62' : '#3a2e24',
                color: '#f7f5f2', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                padding: '15px', fontSize: 12,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: 10, transition: 'background 0.2s',
              }}
            >
              {loading ? 'Generando remito...' : 'Generar remito PDF'}
            </button>

            <p style={{ fontSize: 11, color: '#a99680', textAlign: 'center', margin: 0, lineHeight: 1.6 }}>
              El remito se descarga automáticamente.<br />
              Te contactamos para coordinar el pago y la entrega.
            </p>
          </div>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`}</style>
    </div>
  )
}
