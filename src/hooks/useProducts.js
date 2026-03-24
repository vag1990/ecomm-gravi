// src/hooks/useProducts.js
import { useState, useEffect } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore'
import { db } from '../services/firebase'
import {
  getProducts,
  getProductsByCategory,
  getFeaturedProducts,
} from '../services/productService'

// ── hook general: todos los productos (con listener en tiempo real) ─────────
export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    setLoading(true)
    const q = query(
      collection(db, 'products'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      snap => {
        setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      }
    )
    return () => unsub()   // limpia el listener al desmontar
  }, [])

  return { products, loading, error }
}

// ── hook por categoría (con listener en tiempo real) ──────────────────────
export function useProductsByCategory(category) {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    if (!category) return
    setLoading(true)
    setProducts([])

    const q = query(
      collection(db, 'products'),
      where('category', '==', category)
    )
    const unsub = onSnapshot(
      q,
      snap => {
        const sorted = snap.docs
          .map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
        setProducts(sorted)
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      }
    )
    return () => unsub()
  }, [category])   // re-corre cuando cambia la categoría

  return { products, loading, error }
}

// ── hook para productos destacados (getDocs, solo una vez) ────────────────
export function useFeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getFeaturedProducts()
      .then(data => { if (!cancelled) { setProducts(data); setLoading(false) } })
      .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}

// ── hook para un solo producto por ID (getDocs, solo una vez) ─────────────
export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    import('../services/productService').then(({ getProductById }) =>
      getProductById(id)
        .then(data => { if (!cancelled) { setProduct(data); setLoading(false) } })
        .catch(err  => { if (!cancelled) { setError(err.message); setLoading(false) } })
    )
    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}
