import { useCart } from '../context/CartContext'

function ProductDetail() {
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)

  const product = {
    id: 'mesa-oct-01',
    name: 'Mesa octagonal',
    price: 185000,
    category: 'mesas',
    material: 'Terrazo blanco + mármol',
    dims: '90 × 90 cm',
  }

  return (
    <div>
      {/* ... detalle del producto ... */}
      <button onClick={() => addToCart(product, qty)}>
        Agregar al carrito
      </button>
    </div>
  )
}