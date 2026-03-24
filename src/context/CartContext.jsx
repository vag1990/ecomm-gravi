import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
    const [items, setItems] = useState(() => {
        const localData = localStorage.getItem('terrazo-cart')
        return localData ? JSON.parse(localData) : []
    })

    useEffect(() => {
        localStorage.setItem('terrazo-cart', JSON.stringify(items))
    }, [items])

    const addToCart = (product, quantity = 1) => {
        setItems(current => {
            const existing = current.find(item => item.id === product.id)
            if (existing) {
                // Check stock limits
                const newQuantity = Math.min(existing.quantity + quantity, product.stock)
                return current.map(item => 
                    item.id === product.id ? { ...item, quantity: newQuantity } : item
                )
            }
            return [...current, { ...product, quantity: Math.min(quantity, product.stock) }]
        })
    }

    const removeFromCart = (productId) => {
        setItems(current => current.filter(item => item.id !== productId))
    }

    const updateQuantity = (productId, newQuantity) => {
        setItems(current => current.map(item => {
            if (item.id === productId) {
                return { ...item, quantity: Math.max(1, Math.min(newQuantity, item.stock)) }
            }
            return item
        }))
    }

    const clearCart = () => {
        setItems([])
        localStorage.removeItem('terrazo-cart')
    }

    const getCartTotalItems = () => items.reduce((total, item) => total + item.quantity, 0)
    
    const getCartTotal = () => items.reduce((total, item) => total + (item.price * item.quantity), 0)

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotalItems,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}
