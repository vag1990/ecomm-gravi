import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useCart } from '../context/CartContext'
import { fmt } from '../utils/format'

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleCheckout = async () => {
        if (items.length === 0) return
        setLoading(true)
        setError('')

        try {
            const orderId = await runTransaction(db, async (transaction) => {
                // 1. Obtener referencias y documentos actuales de Firestore
                const productRefs = items.map(item => doc(db, 'products', item.id))
                const productDocs = await Promise.all(productRefs.map(ref => transaction.get(ref)))

                // 2. Validar que exista el documento y haya stock suficiente
                productDocs.forEach((pDoc, index) => {
                    const item = items[index]
                    if (!pDoc.exists()) {
                        throw new Error(`El producto ${item.name} ya no existe.`)
                    }
                    const data = pDoc.data()
                    if (data.stock < item.quantity) {
                        throw new Error(`Stock insuficiente para ${item.name}. Disponibles: ${data.stock}`)
                    }
                })

                // 3. Restar el stock
                productDocs.forEach((pDoc, index) => {
                    const item = items[index]
                    const newStock = pDoc.data().stock - item.quantity;
                    transaction.update(pDoc.ref, { stock: newStock })
                })

                // 4. Crear la orden de compra
                const orderRef = doc(collection(db, 'orders'))
                transaction.set(orderRef, {
                    items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
                    total: getCartTotal(),
                    createdAt: serverTimestamp(),
                    status: 'completed'
                })

                return orderRef.id
            })

            clearCart()
            navigate(`/orden/${orderId}`)

        } catch (err) {
            console.error(err)
            setError(err.message || 'Error al procesar la compra.')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div style={{ backgroundColor: '#f7f5f2', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, color: '#3a2e24', margin: '0 0 16px' }}>
                    Tu carrito está vacío
                </p>
                <Link to="/" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8f7a62', textDecoration: 'underline' }}>
                    Explorar colección
                </Link>
            </div>
        )
    }

    return (
        <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh', padding: '80px 32px' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 300, color: '#3a2e24', marginBottom: 48 }}>
                    Tu selección
                </h1>

                {error && (
                    <div style={{ backgroundColor: '#fde8e8', color: '#c53030', padding: '16px 24px', marginBottom: 32, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 64 }}>
                    {/* Lista de productos */}
                    <div>
                        <div style={{ borderTop: '1px solid #d9d1c5' }}>
                            {items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: 24, padding: '32px 0', borderBottom: '1px solid #d9d1c5' }}>
                                    <Link to={`/producto/${item.id}`} style={{ width: 100, height: 100, backgroundColor: '#ede9e3', flexShrink: 0, position: 'relative', overflow: 'hidden', display: 'block' }}>
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: '#3a2e24' }} />
                                        )}
                                    </Link>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, color: '#3a2e24', margin: '0 0 8px' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ fontSize: 12, color: '#8f7a62', margin: '0 0 16px', letterSpacing: '0.04em' }}>
                                            {item.material}
                                        </p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ display: 'flex', border: '1px solid #d9d1c5' }}>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{ background: 'transparent', border: 'none', padding: '6px 14px', cursor: 'pointer', color: '#5e4d3d' }}
                                                >−</button>
                                                <div style={{ 
                                                    padding: '6px 16px', borderLeft: '1px solid #d9d1c5', borderRight: '1px solid #d9d1c5', 
                                                    fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44 
                                                }}>
                                                    {item.quantity}
                                                </div>
                                                <button 
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    style={{ background: 'transparent', border: 'none', padding: '6px 14px', cursor: 'pointer', color: '#5e4d3d' }}
                                                    disabled={item.quantity >= item.stock}
                                                >+</button>
                                            </div>
                                            <button 
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ background: 'transparent', border: 'none', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8f7a62', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, color: '#5e4d3d', margin: 0 }}>
                                            {fmt(item.price * item.quantity)}
                                        </p>
                                        {item.quantity > 1 && (
                                            <p style={{ fontSize: 11, color: '#a99680', margin: '4px 0 0' }}>{fmt(item.price)} c/u</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumen */}
                    <div style={{ backgroundColor: '#ede9e3', padding: 40, height: 'fit-content', position: 'sticky', top: 100 }}>
                        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#3a2e24', margin: '0 0 32px' }}>
                            Resumen
                        </h2>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14, color: '#5e4d3d' }}>
                            <span>Subtotal</span>
                            <span>{fmt(getCartTotal())}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32, fontSize: 14, color: '#5e4d3d' }}>
                            <span>Envío</span>
                            <span style={{ fontSize: 12, color: '#8f7a62', fontStyle: 'italic' }}>Calculado en checkout</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #c2b5a3', paddingTop: 24, marginBottom: 40 }}>
                            <span style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, color: '#3a2e24' }}>Total</span>
                            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: '#3a2e24' }}>{fmt(getCartTotal())}</span>
                        </div>

                        <button style={{
                            backgroundColor: '#3a2e24', color: '#f7f5f2',
                            border: 'none', padding: '18px 40px',
                            fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                            cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.3s',
                            width: '100%', opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={e => { if(!loading) e.target.style.backgroundColor = '#5e4d3d' }}
                        onMouseLeave={e => { if(!loading) e.target.style.backgroundColor = '#3a2e24' }}
                        onClick={handleCheckout}
                        disabled={loading}
                        >
                            {loading ? 'Procesando...' : 'Finalizar compra'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}