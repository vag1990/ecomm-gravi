import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useFadeIn } from '../hooks/useFadeIn'
import { TerrazoBg } from '../components/ui/TerrazoBg'
import { fmt } from '../utils/format'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
    const { productId } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const [imgRef, imgVisible] = useFadeIn(0.1)
    const [infoRef, infoVisible] = useFadeIn(0.1)
    const { addToCart, items } = useCart()

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true)
            try {
                const docRef = doc(db, 'products', productId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setProduct({ id: docSnap.id, ...docSnap.data() })
                }
            } catch (err) {
                console.error("Error al cargar producto:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProduct()
    }, [productId])

    if (loading) {
        return (
            <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8f7a62' }}>
                    Cargando pieza...
                </p>
            </div>
        )
    }

    if (!product) {
        return (
            <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, color: '#3a2e24', marginBottom: 16 }}>
                    Pieza no encontrada
                </p>
                <Link to="/" style={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8f7a62', textDecoration: 'underline' }}>
                    Volver al inicio
                </Link>
            </div>
        )
    }

    const handleAdd = () => {
        addToCart(product, 1)
        setAdding(true)
        setTimeout(() => setAdding(false), 2000)
    }

    const inCartQty = items.find(i => i.id === product.id)?.quantity || 0
    const outOfStock = product.stock <= 0
    const maxReached = inCartQty >= product.stock

    let btnText = 'Agregar al carrito'
    if (outOfStock) btnText = 'Sin Stock'
    else if (maxReached) btnText = 'Máximo permitido en carrito'
    else if (adding) btnText = '¡Agregado!'

    return (
        <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh' }}>
            <div style={{ 
                maxWidth: 1400, margin: '0 auto', 
                display: 'flex', flexWrap: 'wrap', 
                minHeight: '100vh' 
            }}>
                {/* ── COLUMNA IMAGEN (IZQ) ── */}
                <div 
                    ref={imgRef}
                    style={{ 
                        flex: '1 1 500px', 
                        backgroundColor: '#ede9e3', 
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                        opacity: imgVisible ? 1 : 0,
                        transform: imgVisible ? 'none' : 'translateY(32px)',
                        transition: 'opacity 0.8s ease, transform 0.8s ease',
                        minHeight: '50vh'
                    }}
                >
                    {product.image ? (
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                    ) : (
                        <TerrazoBg color="#8f7a62" density={100} />
                    )}
                    
                    {/* Sutil placa / etiqueta de material en la imagen */}
                    <div style={{
                        position: 'absolute', bottom: 40, left: 40,
                        background: 'rgba(58,46,36,0.9)', color: '#f7f5f2',
                        padding: '12px 20px', 
                        backdropFilter: 'blur(4px)',
                    }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 20, margin: '0 0 4px', fontStyle: 'italic' }}>
                            Detalle de superficie
                        </p>
                        <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c2b5a3', margin: 0 }}>
                            {product.material}
                        </p>
                    </div>
                </div>

                {/* ── COLUMNA INFO (DER) ── */}
                <div 
                    ref={infoRef}
                    style={{ 
                        flex: '1 1 400px', 
                        padding: '10% 8%', 
                        display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        opacity: infoVisible ? 1 : 0,
                        transform: infoVisible ? 'none' : 'translateX(32px)',
                        transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
                    }}
                >
                    <Link to={`/categoria/${product.category}`} style={{ 
                        fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', 
                        color: '#8f7a62', textDecoration: 'none', marginBottom: 24, display: 'inline-block',
                        borderBottom: '1px solid transparent', transition: 'border-color 0.2s'
                    }} 
                    onMouseEnter={e => e.target.style.borderBottomColor = '#8f7a62'}
                    onMouseLeave={e => e.target.style.borderBottomColor = 'transparent'}
                    >
                        ← Volver a {product.category}
                    </Link>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(42px, 5vw, 64px)',
                        fontWeight: 300, lineHeight: 1.1,
                        color: '#3a2e24',
                        margin: '0 0 24px',
                    }}>
                        {product.name}
                    </h1>

                    <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, color: '#5e4d3d', margin: '0 0 48px' }}>
                        {fmt(product.price)}
                    </p>

                    <div style={{ 
                        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, 
                        borderTop: '1px solid #d9d1c5', borderBottom: '1px solid #d9d1c5',
                        padding: '32px 0', marginBottom: 48
                    }}>
                        <div>
                            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 8px' }}>Materialidad</p>
                            <p style={{ fontSize: 15, color: '#3a2e24', margin: 0 }}>{product.material}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 8px' }}>Dimensiones</p>
                            <p style={{ fontSize: 15, color: '#3a2e24', margin: 0 }}>{product.dims}</p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 8px' }}>Identificador</p>
                            <p style={{ fontSize: 13, color: '#8f7a62', margin: 0 }}>REF. {product.id.toUpperCase()}</p>
                        </div>
                    </div>

                    <button style={{
                        backgroundColor: (outOfStock || maxReached) ? '#a99680' : '#3a2e24', color: '#f7f5f2',
                        border: 'none', padding: '18px 40px',
                        fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                        cursor: (outOfStock || maxReached) ? 'not-allowed' : 'pointer', 
                        transition: 'background 0.3s',
                        width: '100%', marginBottom: 16
                    }}
                    disabled={outOfStock || maxReached}
                    onMouseEnter={e => { if(!outOfStock && !maxReached) e.target.style.backgroundColor = '#5e4d3d' }}
                    onMouseLeave={e => { if(!outOfStock && !maxReached) e.target.style.backgroundColor = '#3a2e24' }}
                    onClick={handleAdd}
                    >
                        {btnText}
                    </button>
                    
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#a99680', margin: 0 }}>
                        Envíos a todo el país. Producción artesanal.
                    </p>
                </div>
            </div>
        </div>
    )
}