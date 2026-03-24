import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFadeIn } from '../../hooks/useFadeIn'
import { TerrazoBg } from './TerrazoBg'
import { fmt } from '../../utils/format'
import { useCart } from '../../context/CartContext'

export function ProductCard({ product, index = 0 }) {
    const [ref, visible] = useFadeIn()
    const [hovered, setHovered] = useState(false)
    const [qty, setQty] = useState(1)
    const [adding, setAdding] = useState(false)
    const { addToCart, items } = useCart()

    const inCartQty = items.find(i => i.id === product.id)?.quantity || 0
    const outOfStock = product.stock <= 0
    const maxReached = inCartQty + qty > product.stock

    const handleAdd = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (outOfStock || maxReached) return
        addToCart(product, qty)
        setAdding(true)
        setQty(1)
        setTimeout(() => setAdding(false), 2000)
    }

    return (
        <div
            ref={ref}
            className={`flex flex-col h-full bg-[#ede9e3] border border-[#d9d1c5] transition-all duration-700 ease-out`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transitionDelay: `${index * 100}ms`
            }}
        >
            <Link
                to={`/producto/${product.id}`}
                className="block relative overflow-hidden h-[260px] cursor-pointer shrink-0"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {product.image ? (
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className={`w-full h-full object-cover transition-transform duration-700 ${hovered ? 'scale-105' : 'scale-100'}`} 
                    />
                ) : (
                    <TerrazoBg color="#8f7a62" density={55} />
                )}
                
                <div className="absolute top-3 left-3 bg-[#3a2e24] text-[#f7f5f2] text-[10px] tracking-widest uppercase px-3 py-1 z-10">
                    {product.category}
                </div>
                
                <div className={`absolute inset-0 bg-[#3a2e24]/20 flex items-center justify-center transition-opacity duration-300 z-10 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
                    <span className={`bg-[#f7f5f2] text-[#3a2e24] text-[11px] tracking-wide uppercase px-5 py-2 transition-transform duration-300 ${hovered ? 'translate-y-0' : 'translate-y-2'}`}>
                        Ver detalles
                    </span>
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-grow bg-[#f7f5f2]">
                 <div>
                    <Link to={`/producto/${product.id}`} className="no-underline block">
                        <h3 className="font-serif text-[22px] font-medium text-[#3a2e24] mb-2 hover:text-[#5e4d3d] transition-colors line-clamp-2 leading-tight">
                            {product.name}
                        </h3>
                    </Link>
                    <p className="text-[13px] text-[#8f7a62] mb-4 leading-relaxed line-clamp-3">
                        Pieza elaborada en {product.material.toLowerCase()}. Formato principal de {product.dims}.
                    </p>
                </div>
                
                <div className="mt-auto">
                    <div className="flex justify-between items-end mb-5 gap-2">
                        <p className="font-serif text-[24px] text-[#5e4d3d] font-medium m-0">
                            {fmt(product.price)}
                        </p>
                        
                        <div className="flex border border-[#d9d1c5]">
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.max(1, q - 1)) }}
                                className="bg-transparent border-none px-3 py-1 cursor-pointer text-[#5e4d3d] hover:bg-[#ede9e3] transition-colors"
                            >−</button>
                            <div className="px-3 py-1 border-x border-[#d9d1c5] text-[13px] flex items-center justify-center min-w-[28px] text-[#3a2e24]">
                                {qty}
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQty(q => Math.min(product.stock - inCartQty, q + 1)) }}
                                className={`bg-transparent border-none px-3 py-1 cursor-pointer text-[#5e4d3d] hover:bg-[#ede9e3] transition-colors disabled:opacity-30 disabled:cursor-not-allowed`}
                                disabled={maxReached || qty >= (product.stock - inCartQty)}
                            >+</button>
                        </div>
                    </div>

                    <button 
                        className={`w-full py-3.5 px-5 text-[11px] tracking-widest uppercase font-medium border-none transition-all duration-300 
                        ${(outOfStock || maxReached) 
                            ? 'bg-[#a99680] text-[#f7f5f2] cursor-not-allowed' 
                            : 'bg-[#3a2e24] text-[#f7f5f2] hover:bg-[#5e4d3d] cursor-pointer'}`}
                        disabled={outOfStock || maxReached}
                        onClick={handleAdd}
                    >
                        {outOfStock ? 'Sin Stock' : adding ? '¡Agregado!' : maxReached ? 'Límite alcanzado' : 'Sumar al carrito'}
                    </button>
                    
                    {product.stock > 0 && product.stock <= 5 && (
                        <p className="text-[10px] text-red-700/80 mt-2 text-center tracking-wide font-medium uppercase">
                            Solo quedan {product.stock} unidades
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
