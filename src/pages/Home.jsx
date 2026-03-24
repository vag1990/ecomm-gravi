import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFadeIn } from '../hooks/useFadeIn'
import { TerrazoBg } from '../components/ui/TerrazoBg'
import { ProductCard } from '../components/ui/ProductCard'

// ─── datos mock (después vienen de Firebase) ───────────────────────────────
const CATEGORIES = [
    {
        slug: 'mesas',
        label: 'Mesas',
        sub: 'Diseño en cemento',
        accent: '#c2b5a3',
        pattern: 'M0 0 L60 0 L60 60 L0 60Z M10 10 L50 10 L50 50 L10 50Z',
    },
    {
        slug: 'revestimientos',
        label: 'Revestimientos',
        sub: 'Pisos y paredes',
        accent: '#8f7a62',
        pattern: 'M0 0 L20 0 L20 20 L0 20Z M20 20 L40 20 L40 40 L20 40Z M40 40 L60 40 L60 60 L40 60Z',
    },
    {
        slug: 'piezas',
        label: 'Piezas',
        sub: 'Arte cementiceo',
        accent: '#5e4d3d',
        pattern: 'M30 0 L60 30 L30 60 L0 30Z',
    },
]

const FEATURED = [
    { id: 'mesa-oct-01', name: 'Mesa octagonal', category: 'mesas', price: 185000, material: 'Terrazo blanco + mármol', dims: '90 × 90 cm', image: '/foto1.jpg' },
    { id: 'rev-hex-02', name: 'Hex 15 natural', category: 'revestimientos', price: 8200, material: 'Cemento pigmentado', dims: '15 × 15 cm', image: '/revest1020.jpg' },
    { id: 'pieza-03', name: 'Panel relieve', category: 'piezas', price: 42000, material: 'Cemento + áridos', dims: '40 × 60 cm', image: '/pieza1.jpeg' },
    { id: 'mesa-rect-04', name: 'Mesa baja rect', category: 'mesas', price: 220000, material: 'Terrazo negro + cuarzo', dims: '120 × 60 cm', image: '/foto2.jpg' },
]



// ─── CategoryCard ─────────────────────────────────────────────────────────
function CategoryCard({ cat, index }) {
    const [ref, visible] = useFadeIn()
    const [hovered, setHovered] = useState(false)

    return (
        <div
            ref={ref}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${index * 0.12}s, transform 0.5s ease ${index * 0.12}s`,
            }}
        >
            <Link
                to={`/categoria/${cat.slug}`}
                style={{ display: 'block', textDecoration: 'none' }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                <div style={{
                    position: 'relative',
                    height: 220,
                    backgroundColor: cat.accent,
                    overflow: 'hidden',
                    marginBottom: 14,
                    transition: 'transform 0.3s ease',
                    transform: hovered ? 'scale(1.02)' : 'scale(1)',
                }}>
                    <TerrazoBg color="#f7f5f2" density={30} />
                    <svg
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}
                        viewBox="0 0 60 60"
                    >
                        <path d={cat.pattern} fill="#f7f5f2" />
                    </svg>
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '16px 20px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.35))',
                    }}>
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 22, fontWeight: 500, color: '#f7f5f2', margin: 0 }}>
                            {cat.label}
                        </p>
                    </div>
                </div>
                <p style={{ fontSize: 12, color: '#8f7a62', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {cat.sub}
                </p>
            </Link>
        </div>
    )
}

// ─── Home ─────────────────────────────────────────────────────────────────
export default function Home() {
    const [heroRef, heroVisible] = useFadeIn()
    const [catRef, catVisible] = useFadeIn()
    const [featRef, featVisible] = useFadeIn()
    const [ticker] = useState(['Mesas de diseño', 'Revestimientos únicos', 'Arte en cemento', 'Hechos a mano', 'Buenos Aires'])

    return (
        <div style={{ backgroundColor: '#f7f5f2', minHeight: '100vh' }}>

            {/* ── TICKER ── */}
            <div style={{
                backgroundColor: '#3a2e24', color: '#c2b5a3',
                fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                padding: '8px 0', overflow: 'hidden', whiteSpace: 'nowrap',
            }}>
                <div style={{
                    display: 'inline-block',
                    animation: 'ticker 18s linear infinite',
                }}>
                    {[...ticker, ...ticker].map((t, i) => (
                        <span key={i} style={{ marginRight: 60 }}>{t} &nbsp;·</span>
                    ))}
                </div>
            </div>

            {/* ── HERO ── */}
            <section style={{
                position: 'relative',
                minHeight: '88vh',
                backgroundColor: '#3a2e24',
                display: 'flex',
                alignItems: 'flex-end',
                overflow: 'hidden',
                padding: '0 0 64px',
            }}>
                {/* patrón terrazo de fondo */}
                <TerrazoBg color="#c2b5a3" density={80} />

                {/* línea decorativa vertical */}
                <div style={{
                    position: 'absolute', top: 0, left: '58%',
                    width: 1, height: '100%',
                    background: 'rgba(194,181,163,0.15)',
                }} />

                {/* número editorial grande */}
                <div style={{
                    position: 'absolute', top: 40, right: 60,
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: 140, fontWeight: 300, lineHeight: 1,
                    color: 'rgba(194,181,163,0.08)',
                    userSelect: 'none',
                }}>01</div>

                <div
                    ref={heroRef}
                    style={{
                        position: 'relative', zIndex: 1,
                        maxWidth: 1200, margin: '0 auto', padding: '0 32px',
                        width: '100%',
                        opacity: heroVisible ? 1 : 0,
                        transform: heroVisible ? 'none' : 'translateY(32px)',
                        transition: 'opacity 0.9s ease, transform 0.9s ease',
                    }}
                >
                    <p style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase',
                        color: '#a99680', marginBottom: 20,
                    }}>
                        Buenos Aires · Diseño artesanal
                    </p>

                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: 'clamp(52px, 8vw, 100px)',
                        fontWeight: 300, lineHeight: 1.05,
                        color: '#f7f5f2',
                        margin: '0 0 32px',
                        maxWidth: 700,
                    }}>
                        Terrazo<br />
                        <em style={{ fontStyle: 'italic', color: '#c2b5a3' }}>hecho a mano</em>
                    </h1>

                    <p style={{
                        fontSize: 16, color: '#8f7a62', maxWidth: 440,
                        lineHeight: 1.75, marginBottom: 48,
                    }}>
                        Mesas de diseño, revestimientos y piezas únicas en cemento y piedra natural. Cada pieza es irrepetible.
                    </p>

                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <Link to="/categoria/mesas" style={{
                            display: 'inline-block',
                            backgroundColor: '#f7f5f2', color: '#3a2e24',
                            padding: '14px 36px', fontSize: 13,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            textDecoration: 'none', fontWeight: 500,
                            transition: 'background 0.2s',
                        }}>
                            Ver colección
                        </Link>
                        <Link to="/categoria/revestimientos" style={{
                            display: 'inline-block',
                            border: '1px solid rgba(194,181,163,0.4)', color: '#c2b5a3',
                            padding: '14px 36px', fontSize: 13,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'border-color 0.2s',
                        }}>
                            Revestimientos
                        </Link>
                        <Link to="/admin/login" style={{
                            display: 'inline-block',
                            border: '1px dashed rgba(194,181,163,0.5)', color: '#c2b5a3',
                            padding: '14px 36px', fontSize: 13,
                            letterSpacing: '0.08em', textTransform: 'uppercase',
                            textDecoration: 'none',
                            transition: 'border-color 0.2s, background-color 0.2s',
                        }}>
                            Admin
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── STRIP DATOS ── */}
            <div style={{
                backgroundColor: '#ede9e3',
                borderTop: '1px solid #d9d1c5',
                borderBottom: '1px solid #d9d1c5',
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 32px',
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    divide: 'x',
                }}>
                    {[
                        { n: '+200', label: 'Piezas únicas' },
                        { n: '12 años', label: 'De experiencia' },
                        { n: 'BA', label: 'Made in Buenos Aires' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            padding: '24px 32px',
                            borderRight: i < 2 ? '1px solid #d9d1c5' : 'none',
                        }}>
                            <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 28, fontWeight: 500, color: '#3a2e24', margin: '0 0 4px' }}>{s.n}</p>
                            <p style={{ fontSize: 12, color: '#8f7a62', letterSpacing: '0.06em', textTransform: 'uppercase', margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── CATEGORÍAS ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
                <div
                    ref={catRef}
                    style={{
                        opacity: catVisible ? 1 : 0,
                        transform: catVisible ? 'none' : 'translateY(20px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
                        <div>
                            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 8px' }}>
                                Explorar
                            </p>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 400, color: '#3a2e24', margin: 0 }}>
                                Categorías
                            </h2>
                        </div>
                        <Link to="/categoria/mesas" style={{ fontSize: 12, color: '#8f7a62', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #c2b5a3', paddingBottom: 2 }}>
                            Ver todo
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
                        {CATEGORIES.map((cat, i) => <CategoryCard key={cat.slug} cat={cat} index={i} />)}
                    </div>
                </div>
            </section>

            {/* ── FRANJA EDITORIAL ── */}
            <section style={{
                backgroundColor: '#3a2e24',
                padding: '72px 32px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <TerrazoBg color="#8f7a62" density={40} />
                <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
                    <div>
                        <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, fontWeight: 300, color: '#f7f5f2', margin: '0 0 8px', maxWidth: 480, lineHeight: 1.3 }}>
                            "El terrazo no es una moda.<br /><em>Es memoria en cemento.</em>"
                        </p>
                        <p style={{ fontSize: 12, color: '#8f7a62', letterSpacing: '0.08em', margin: 0 }}>— Estudio Terrazo Shop</p>
                    </div>
                    <Link to="/categoria/piezas" style={{
                        border: '1px solid rgba(194,181,163,0.5)', color: '#c2b5a3',
                        padding: '14px 32px', fontSize: 12, letterSpacing: '0.1em',
                        textTransform: 'uppercase', textDecoration: 'none',
                        transition: 'all 0.2s', whiteSpace: 'nowrap',
                    }}>
                        Ver piezas
                    </Link>
                </div>
            </section>

            {/* ── PRODUCTOS FEATURED ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px' }}>
                <div
                    ref={featRef}
                    style={{
                        opacity: featVisible ? 1 : 0,
                        transform: featVisible ? 'none' : 'translateY(20px)',
                        transition: 'opacity 0.6s ease, transform 0.6s ease',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40 }}>
                        <div>
                            <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 8px' }}>
                                Selección
                            </p>
                            <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 400, color: '#3a2e24', margin: 0 }}>
                                Destacados
                            </h2>
                        </div>
                        <Link to="/categoria/mesas" style={{ fontSize: 12, color: '#8f7a62', letterSpacing: '0.06em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #c2b5a3', paddingBottom: 2 }}>
                            Ver todo
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 32 }}>
                        {FEATURED.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                    </div>
                </div>
            </section>

            {/* ── PROCESO ── */}
            <section style={{ backgroundColor: '#ede9e3', borderTop: '1px solid #d9d1c5', padding: '80px 32px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a99680', marginBottom: 8 }}>Cómo trabajamos</p>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 36, fontWeight: 400, color: '#3a2e24', margin: '0 0 48px' }}>
                        El proceso
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
                        {[
                            { n: '01', title: 'Diseño', desc: 'Trabajamos el molde y la mezcla según cada pieza.' },
                            { n: '02', title: 'Colado', desc: 'Cemento, áridos y pigmentos naturales mezclados a mano.' },
                            { n: '03', title: 'Curado', desc: '28 días de curado controlado para máxima dureza.' },
                            { n: '04', title: 'Entrega', desc: 'Embalaje artesanal y envío a todo el país.' },
                        ].map((s, i) => (
                            <div key={i} style={{ borderTop: '1px solid #c2b5a3', paddingTop: 20 }}>
                                <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 32, color: '#c2b5a3', margin: '0 0 12px' }}>{s.n}</p>
                                <p style={{ fontSize: 14, fontWeight: 500, color: '#3a2e24', margin: '0 0 8px' }}>{s.title}</p>
                                <p style={{ fontSize: 13, color: '#8f7a62', lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA FINAL ── */}
            <section style={{ backgroundColor: '#f7f5f2', padding: '80px 32px', textAlign: 'center' }}>
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a99680', marginBottom: 16 }}>Pedido a medida</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 300, color: '#3a2e24', margin: '0 0 20px' }}>
                    ¿Tenés un proyecto?
                </h2>
                <p style={{ fontSize: 15, color: '#8f7a62', maxWidth: 400, margin: '0 auto 36px', lineHeight: 1.7 }}>
                    Hacemos piezas a medida para arquitectos, diseñadores y particulares.
                </p>
                <a href="mailto:info@terrazoshop.com" style={{
                    display: 'inline-block',
                    backgroundColor: '#3a2e24', color: '#f7f5f2',
                    padding: '14px 40px', fontSize: 13,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textDecoration: 'none',
                }}>
                    Contactanos
                </a>
            </section>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&display=swap');
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
        </div>
    )
}
