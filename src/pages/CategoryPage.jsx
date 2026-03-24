// src/pages/CategoryPage.jsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useProductsByCategory } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'

const fmt = n => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0,
}).format(n)

const CATEGORY_META = {
  mesas:          { label: 'Mesas de terrazo',   desc: 'Diseño y funcionalidad en cemento' },
  revestimientos: { label: 'Revestimientos',      desc: 'Piezas para pisos y paredes' },
  piezas:         { label: 'Piezas decorativas',  desc: 'Arte cementiceo para tu espacio' },
}

// ── tarjeta de producto ────────────────────────────────────────────────────
function ProductCard({ product }) {
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAdd = e => {
    e.preventDefault()
    addToCart(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link to={`/producto/${product.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        {/* imagen placeholder con patrón */}
        <div style={{
          position: 'relative', height: 260,
          backgroundColor: '#ede9e3', overflow: 'hidden', marginBottom: 14,
        }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: '#c2b5a3' }}
            viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            {Array.from({ length: 20 }, (_, i) => (
              <circle key={i}
                cx={5 + (i * 19) % 90} cy={5 + (i * 31) % 90}
                r={0.8 + (i % 4) * 0.6} fill="currentColor"
                opacity={0.15 + (i % 5) * 0.08}
              />
            ))}
          </svg>

          {product.featured && (
            <div style={{
              position: 'absolute', top: 10, left: 10,
              backgroundColor: '#3a2e24', color: '#f7f5f2',
              fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '3px 8px',
            }}>Destacado</div>
          )}

          {product.stock <= 3 && product.stock > 0 && (
            <div style={{
              position: 'absolute', top: 10, right: 10,
              backgroundColor: '#993C1D', color: '#f7f5f2',
              fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '3px 8px',
            }}>Últimas {product.stock}</div>
          )}
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, fontWeight: 500, color: '#3a2e24', margin: '0 0 3px' }}>
          {product.name}
        </p>
        <p style={{ fontSize: 11, color: '#8f7a62', margin: '0 0 2px' }}>{product.material}</p>
        <p style={{ fontSize: 11, color: '#a99680', margin: '0 0 10px' }}>{product.dims}</p>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 600, color: '#3a2e24' }}>
          {fmt(product.price)}
        </span>
        <button
          onClick={handleAdd}
          style={{
            backgroundColor: added ? '#3B6D11' : '#3a2e24',
            color: '#f7f5f2', border: 'none', cursor: 'pointer',
            fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '8px 14px', transition: 'background 0.3s',
          }}
        >
          {added ? 'Agregado ✓' : 'Agregar'}
        </button>
      </div>
    </div>
  )
}

// ── skeleton loader ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
      <div style={{ height: 260, backgroundColor: '#ede9e3', marginBottom: 14 }} />
      <div style={{ height: 14, backgroundColor: '#ede9e3', borderRadius: 2, marginBottom: 8, width: '75%' }} />
      <div style={{ height: 11, backgroundColor: '#ede9e3', borderRadius: 2, marginBottom: 6, width: '55%' }} />
      <div style={{ height: 11, backgroundColor: '#ede9e3', borderRadius: 2, width: '40%' }} />
    </div>
  )
}

// ── CategoryPage ───────────────────────────────────────────────────────────
export default function CategoryPage() {
  const { category } = useParams()
  const { products, loading, error } = useProductsByCategory(category)
  const meta = CATEGORY_META[category] ?? { label: category, desc: '' }

  return (
    <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh' }}>

      {/* banner de categoría */}
      <div style={{
        backgroundColor: '#3a2e24', padding: '48px 24px 40px',
        borderBottom: '1px solid rgba(194,181,163,0.2)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 10, color: '#8f7a62', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 10px' }}>
            <Link to="/" style={{ color: '#8f7a62', textDecoration: 'none' }}>Inicio</Link>
            {' '}·{' '}
            <span style={{ color: '#c2b5a3' }}>{meta.label}</span>
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 400, color: '#f7f5f2', margin: '0 0 8px' }}>
            {meta.label}
          </h1>
          <p style={{ fontSize: 14, color: '#8f7a62', margin: 0 }}>{meta.desc}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        {/* contador */}
        {!loading && !error && (
          <p style={{ fontSize: 12, color: '#a99680', marginBottom: 32, letterSpacing: '0.04em' }}>
            {products.length} {products.length === 1 ? 'producto' : 'productos'}
          </p>
        )}

        {/* error */}
        {error && (
          <div style={{ backgroundColor: '#FAECE7', border: '1px solid #F5C4B3', padding: '16px 20px', color: '#712B13', fontSize: 14, marginBottom: 32 }}>
            Error al cargar los productos: {error}
          </div>
        )}

        {/* grilla */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 36 }}>
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {/* vacío */}
        {!loading && !error && products.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#3a2e24', margin: '0 0 10px' }}>
              No hay productos en esta categoría todavía
            </p>
            <p style={{ fontSize: 13, color: '#8f7a62', margin: '0 0 28px' }}>
              Estamos preparando nuevas piezas. Volvé pronto.
            </p>
            <Link to="/" style={{
              backgroundColor: '#3a2e24', color: '#f7f5f2',
              padding: '12px 32px', fontSize: 12,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              textDecoration: 'none',
            }}>Volver al inicio</Link>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </div>
  )
}
