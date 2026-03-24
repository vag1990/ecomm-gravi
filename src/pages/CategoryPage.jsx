import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../services/firebase'
import { useFadeIn } from '../hooks/useFadeIn'
import { TerrazoBg } from '../components/ui/TerrazoBg'
import { ProductCard } from '../components/ui/ProductCard'

const CATEGORY_INFO = {
    mesas: { 
        title: 'Mesas', 
        subtitle: 'Diseño en cemento', 
        desc: 'Nuestras mesas combinan la robustez del cemento con la delicadeza del diseño artesanal, creando piezas centrales que respiran personalidad.',
        color: '#c2b5a3'
    },
    revestimientos: { 
        title: 'Revestimientos', 
        subtitle: 'Pisos y paredes', 
        desc: 'Colección de placas y listones cementicios. Geometrías pensadas para dar carácter, textura y calidez a cualquier superficie.',
        color: '#8f7a62'
    },
    piezas: { 
        title: 'Piezas', 
        subtitle: 'Arte cementicio', 
        desc: 'Objetos esculturales y utilitarios donde la materialidad cruda del terrazo se convierte en la protagonista indiscutida del espacio.',
        color: '#5e4d3d'
    }
}

export default function CategoryPage() {
    const { category } = useParams()
    const info = CATEGORY_INFO[category] || { title: category, subtitle: 'Colección', desc: '', color: '#c2b5a3' }
    
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [heroRef, heroVisible] = useFadeIn()
    const [gridRef, gridVisible] = useFadeIn()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const q = query(collection(db, 'products'), where('category', '==', category))
                const querySnapshot = await getDocs(q)
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
                setProducts(data)
            } catch (err) {
                console.error("Error cargando productos:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [category])

    return (
        <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh', paddingBottom: 120 }}>
            {/* ── HERO CATEGORÍA ── */}
            <section style={{
                position: 'relative',
                minHeight: '45vh',
                backgroundColor: info.color,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                padding: '100px 32px 64px',
            }}>
                <TerrazoBg color="#f7f5f2" density={40} />
                
                <div
                    ref={heroRef}
                    style={{
                        position: 'relative', zIndex: 1,
                        maxWidth: 1200, margin: '0 auto', width: '100%',
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'none' : 'translateY(24px)',
                        transition: 'opacity 0.8s ease, transform 0.8s ease',
                    }}
                >
                    <Link to="/" style={{ 
                        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', 
                        color: 'rgba(247,245,242,0.8)', textDecoration: 'none', marginBottom: 24, display: 'inline-block' 
                    }}>
                        ← Volver a Inicio
                    </Link>
                    
                    <p style={{
                        fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase',
                        color: 'rgba(247,245,242,0.9)', marginBottom: 12,
                    }}>
                        {info.subtitle}
                    </p>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(48px, 6vw, 84px)',
                        fontWeight: 300, lineHeight: 1.05,
                        color: '#f7f5f2',
                        margin: '0 0 24px',
                        textTransform: 'capitalize'
                    }}>
                        {info.title}
                    </h1>

                    <p style={{
                        fontSize: 16, color: 'rgba(247,245,242,0.9)', maxWidth: 500,
                        lineHeight: 1.6, margin: 0,
                    }}>
                        {info.desc}
                    </p>
                </div>
            </section>

            {/* ── GRILLA PRODUCTOS ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
                <div
                    ref={gridRef}
                    style={{
                        opacity: gridVisible || loading ? 1 : 0,
                        transform: gridVisible || loading ? 'none' : 'translateY(20px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d9d1c5', paddingBottom: 16, marginBottom: 48 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 24, color: '#3a2e24', margin: 0 }}>
                            Catálogo
                        </p>
                        <p style={{ fontSize: 12, color: '#8f7a62', letterSpacing: '0.05em', margin: 0 }}>
                            {loading ? 'Cargando...' : `${products.length} producto${products.length !== 1 ? 's' : ''}`}
                        </p>
                    </div>

                    {loading ? (
                        <div style={{ padding: '80px 0', textAlign: 'center', color: '#8f7a62', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Obteniendo piezas...
                        </div>
                    ) : products.length === 0 ? (
                        <div style={{ padding: '80px 0', textAlign: 'center', color: '#8f7a62' }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, color: '#3a2e24', margin: '0 0 16px' }}>Sin resultados</p>
                            <p>No se encontraron productos en esta categoría por el momento.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '48px 32px' }}>
                            {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}