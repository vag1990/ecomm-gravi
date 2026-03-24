import { Link } from 'react-router-dom'
import { useCart } from "../../context/CartContext"; 

const fmt = n => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', maximumFractionDigits: 0
}).format(n)

// ─── fila de un item en el drawer ─────────────────────────────────────────
function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart()

  return (
    <div style={{
      display: 'flex', gap: 14, padding: '16px 0',
      borderBottom: '1px solid #ede9e3',
    }}>
      {/* miniatura placeholder */}
      <div style={{
        width: 64, height: 64, flexShrink: 0,
        backgroundColor: '#ede9e3',
        position: 'relative', overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', color: '#c2b5a3' }}
          viewBox="0 0 100 100">
          {Array.from({ length: 12 }, (_, i) => (
            <circle key={i}
              cx={Math.random() * 100} cy={Math.random() * 100}
              r={Math.random() * 3 + 1} fill="currentColor"
              opacity={Math.random() * 0.5 + 0.1}
            />
          ))}
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 15, fontWeight: 500, color: '#3a2e24',
          margin: '0 0 2px', overflow: 'hidden',
          textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{item.name}</p>
        <p style={{ fontSize: 11, color: '#8f7a62', margin: '0 0 10px' }}>{item.category}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* selector cantidad */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #d9d1c5' }}>
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#8f7a62', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >−</button>
            <span style={{ width: 28, textAlign: 'center', fontSize: 13, color: '#3a2e24' }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              style={{ width: 28, height: 28, background: 'none', border: 'none', cursor: 'pointer', color: '#8f7a62', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >+</button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 15, color: '#5e4d3d', fontWeight: 600,
            }}>{fmt(item.price * item.quantity)}</span>
            <button
              onClick={() => removeFromCart(item.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c2b5a3', padding: 4 }}
              title="Eliminar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── drawer lateral del carrito ───────────────────────────────────────────
export function CartDrawer() {
  const { items, isOpen, closeCart, cartTotal, cartCount, isEmpty, clearCart } = useCart()

  return (
    <>
      {/* overlay */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed', inset: 0, zIndex: 99,
          backgroundColor: 'rgba(58,46,36,0.4)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 100,
        width: 'min(420px, 100vw)',
        backgroundColor: '#f7f5f2',
        borderLeft: '1px solid #d9d1c5',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #ede9e3',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 22, fontWeight: 400, color: '#3a2e24', margin: 0,
            }}>Carrito</h2>
            {cartCount > 0 && (
              <span style={{ fontSize: 12, color: '#8f7a62' }}>({cartCount} {cartCount === 1 ? 'ítem' : 'ítems'})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f7a62', padding: 4 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* items o estado vacío */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px' }}>
          {isEmpty ? (
            <div style={{ textAlign: 'center', paddingTop: 64 }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c2b5a3" strokeWidth="1"
                style={{ marginBottom: 16 }}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#3a2e24', margin: '0 0 8px' }}>
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: 13, color: '#8f7a62', margin: '0 0 28px' }}>
                Explorá nuestra colección
              </p>
              <Link
                to="/categoria/mesas"
                onClick={closeCart}
                style={{
                  display: 'inline-block',
                  backgroundColor: '#3a2e24', color: '#f7f5f2',
                  padding: '12px 28px', fontSize: 12,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                Ver colección
              </Link>
            </div>
          ) : (
            <>
              {items.map(item => <CartItem key={item.id} item={item} />)}
              <button
                onClick={clearCart}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, color: '#a99680', letterSpacing: '0.06em',
                  textTransform: 'uppercase', marginTop: 12, padding: '8px 0',
                  textDecoration: 'underline', textUnderlineOffset: 3,
                }}
              >
                Vaciar carrito
              </button>
            </>
          )}
        </div>

        {/* footer con total y checkout */}
        {!isEmpty && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #ede9e3' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#8f7a62', letterSpacing: '0.04em' }}>Subtotal</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: 22, fontWeight: 500, color: '#3a2e24',
              }}>{fmt(cartTotal)}</span>
            </div>
            <p style={{ fontSize: 11, color: '#a99680', margin: '0 0 18px' }}>
              Envío calculado al confirmar
            </p>
            <Link
              to="/carrito"
              onClick={closeCart}
              style={{
                display: 'block', textAlign: 'center',
                backgroundColor: '#3a2e24', color: '#f7f5f2',
                padding: '14px', fontSize: 13,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                textDecoration: 'none', marginBottom: 10,
              }}
            >
              Confirmar pedido
            </Link>
            <button
              onClick={closeCart}
              style={{
                display: 'block', width: '100%', textAlign: 'center',
                background: 'none', border: '1px solid #d9d1c5',
                color: '#8f7a62', padding: '12px', fontSize: 12,
                letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
              }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');`}</style>
    </>
  )
}
