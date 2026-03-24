import { createContext, useContext, useReducer, useEffect } from 'react'

// ─── estado inicial ────────────────────────────────────────────────────────
const initialState = {
  items: [],        // [{ id, name, price, category, material, dims, quantity }]
  isOpen: false,    // drawer del carrito abierto/cerrado
}

// ─── reducer ──────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {

    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + (action.payload.quantity ?? 1) }
              : i
          ),
        }
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: action.payload.quantity ?? 1 }],
      }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.payload),
      }

    case 'UPDATE_QTY': {
      if (action.payload.quantity < 1) {
        return { ...state, items: state.items.filter(i => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }
    }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'HYDRATE':
      return { ...state, items: action.payload }

    default:
      return state
  }
}

// ─── context ──────────────────────────────────────────────────────────────
const CartContext = createContext(null)

// ─── provider ─────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // persistencia en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('terrazo_cart')
      if (saved) dispatch({ type: 'HYDRATE', payload: JSON.parse(saved) })
    } catch (_) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('terrazo_cart', JSON.stringify(state.items))
    } catch (_) {}
  }, [state.items])

  // valores derivados
  const cartCount = state.items.reduce((acc, i) => acc + i.quantity, 0)
  const cartTotal = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0)
  const isEmpty   = state.items.length === 0

  // acciones
  const addToCart    = (product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, quantity } })
    dispatch({ type: 'OPEN_CART' })
  }
  const removeFromCart = (id)               => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty      = (id, quantity)     => dispatch({ type: 'UPDATE_QTY',  payload: { id, quantity } })
  const clearCart      = ()                 => dispatch({ type: 'CLEAR_CART' })
  const toggleCart     = ()                 => dispatch({ type: 'TOGGLE_CART' })
  const closeCart      = ()                 => dispatch({ type: 'CLOSE_CART' })

  return (
    <CartContext.Provider value={{
      items:    state.items,
      isOpen:   state.isOpen,
      cartCount,
      cartTotal,
      isEmpty,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  )
}

// ─── hook ─────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
