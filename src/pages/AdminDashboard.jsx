import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savingId, setSavingId] = useState(null)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth')
    if (isAuth !== 'true') {
      navigate('/admin/login')
      return
    }
    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (!res.ok) throw new Error('Error al conectar con la API del servidor local')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      setError(err.message + ". Asegúrate de tener el backend corriendo en el puerto 3001 (cd backend && npm install && npm start)")
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleStockChange = (id, delta) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const newStock = Math.max(0, (p.stock || 0) + delta)
        return { ...p, stock: newStock }
      }
      return p
    }))
  }

  const handleStockDirectChange = (id, value) => {
    if (value === '') {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: '' } : p))
      return
    }
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed)) {
      const newStock = Math.max(0, parsed)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p))
    }
  }

  const handlePriceDirectChange = (id, value) => {
    if (value === '') {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, price: '' } : p))
      return
    }
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed)) {
      const newPrice = Math.max(0, parsed)
      setProducts(prev => prev.map(p => p.id === id ? { ...p, price: newPrice } : p))
    }
  }

  const handleSaveProduct = async (product) => {
    setSavingId(product.id)
    try {
      const finalStock = parseInt(product.stock, 10) || 0;
      const finalPrice = parseInt(product.price, 10) || 0;
      
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: finalStock, price: finalPrice })
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.error || 'Error al actualizar mediante la API')
      }
      showToast(`Actualizado: "${product.name}" (Stock: ${finalStock}, Precio: $${finalPrice})`)
    } catch (err) {
      alert(err.message)
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terrazo-50">
        <p className="text-terrazo-600 tracking-widest text-sm uppercase">Cargando productos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-terrazo-50 p-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-terrazo-900 text-terrazo-50 px-6 py-3 shadow-lg z-50 text-sm flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
          {toastMessage}
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-terrazo-200 pb-6">
          <div>
            <h1 className="text-3xl font-serif text-terrazo-900">Admin Dashboard</h1>
            <p className="text-terrazo-600 text-sm mt-2 uppercase tracking-widest">Gestión de Stock via Express API</p>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('adminAuth')
              navigate('/admin/login')
            }}
            className="text-sm border border-terrazo-300 text-terrazo-700 px-5 py-2 hover:bg-terrazo-200 transition-colors uppercase tracking-wider"
          >
            Cerrar sesión
          </button>
        </div>

        {error && (
          <div className="bg-red-50/80 border border-red-200 text-red-700 p-4 mb-6 text-sm flex flex-col gap-2">
            <strong>Error de conexión</strong>
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white border border-terrazo-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-terrazo-100/50 border-b border-terrazo-200 text-terrazo-800 text-xs tracking-widest uppercase">
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio</th>
                <th className="p-4 font-medium text-center">Stock Actual</th>
                <th className="p-4 font-medium text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 && !error ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-terrazo-500 text-sm">
                    No hay productos en Firebase. Usá el botón de "Cargar Productos Mock" en Home.
                  </td>
                </tr>
              ) : (
                products.map(p => (
                  <tr key={p.id} className="border-b border-terrazo-100 last:border-0 hover:bg-terrazo-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-terrazo-900">{p.name}</p>
                      <p className="text-xs text-terrazo-500 mt-1">{p.id}</p>
                    </td>
                    <td className="p-4 text-sm text-terrazo-600 capitalize">{p.category}</td>
                    <td className="p-4 text-sm text-terrazo-800">
                      <div className="flex items-center gap-1">
                        <span className="text-terrazo-500">$</span>
                        <input 
                          type="text" 
                          value={p.price !== undefined ? p.price : 0}
                          onChange={(e) => handlePriceDirectChange(p.id, e.target.value)}
                          className="w-20 border border-terrazo-200 py-1 px-2 focus:outline-none focus:border-terrazo-500 text-terrazo-900 bg-transparent"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleStockChange(p.id, -1)}
                          className="w-8 h-8 rounded border border-terrazo-300 flex items-center justify-center text-terrazo-600 hover:bg-terrazo-200 transition-colors"
                        >-</button>
                        <input 
                          type="text" 
                          value={p.stock !== undefined ? p.stock : 0}
                          onChange={(e) => handleStockDirectChange(p.id, e.target.value)}
                          className="w-16 text-center border border-terrazo-200 py-1 focus:outline-none focus:border-terrazo-500 text-terrazo-900 bg-transparent"
                        />
                        <button 
                          onClick={() => handleStockChange(p.id, 1)}
                          className="w-8 h-8 rounded border border-terrazo-300 flex items-center justify-center text-terrazo-600 hover:bg-terrazo-200 transition-colors"
                        >+</button>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleSaveProduct(p)}
                        disabled={savingId === p.id}
                        className="bg-terrazo-900 text-terrazo-50 px-5 py-2 text-xs tracking-widest uppercase hover:bg-terrazo-800 disabled:opacity-50 transition-colors min-w-[120px]"
                      >
                        {savingId === p.id ? 'Guardando...' : 'Guardar'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
