import { useParams, Link } from 'react-router-dom'
import { useFadeIn } from '../hooks/useFadeIn'
import { TerrazoBg } from '../components/ui/TerrazoBg'

export default function OrderConfirmation() {
    const { orderId } = useParams()
    const [ref, visible] = useFadeIn()

    return (
        <div style={{ backgroundColor: '#f7f5f2', minHeight: '80vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <TerrazoBg color="#c2b5a3" density={80} />
            
            <div 
                ref={ref}
                style={{ 
                    position: 'relative', zIndex: 1,
                    backgroundColor: '#ede9e3', padding: '64px 48px',
                    maxWidth: 600, width: '90%', textAlign: 'center',
                    border: '1px solid #d9d1c5',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(24px)',
                    transition: 'opacity 0.8s ease, transform 0.8s ease'
                }}
            >
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#8f7a62', marginBottom: 16 }}>
                    Gracias por tu compra
                </p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 44, fontWeight: 300, color: '#3a2e24', margin: '0 0 24px' }}>
                    Orden Confirmada
                </h1>
                
                <p style={{ fontSize: 14, color: '#5e4d3d', margin: '0 0 8px', lineHeight: 1.6 }}>
                    Hemos recibido correctamente tu pedido. En breve nos pondremos en contacto para coordinar los detalles de entrega.
                </p>
                
                <div style={{ backgroundColor: '#f7f5f2', padding: '16px 24px', margin: '32px 0', border: '1px dashed #c2b5a3' }}>
                    <p style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a99680', margin: '0 0 4px' }}>Número de Orden</p>
                    <p style={{ fontSize: 16, fontFamily: 'monospace', color: '#3a2e24', margin: 0 }}>{orderId}</p>
                </div>

                <Link to="/" style={{
                    display: 'inline-block',
                    backgroundColor: '#3a2e24', color: '#f7f5f2',
                    padding: '16px 36px', fontSize: 12,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    textDecoration: 'none', transition: 'background 0.3s'
                }}
                onMouseEnter={e => e.target.style.backgroundColor = '#5e4d3d'}
                onMouseLeave={e => e.target.style.backgroundColor = '#3a2e24'}
                >
                    Volver al inicio
                </Link>
            </div>
        </div>
    )
}