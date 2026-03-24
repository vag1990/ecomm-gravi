import { useState } from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'
import { CartProvider, useCart } from '../../context/CartContext'

const NAV_LINKS = [
  { to: '/categoria/mesas',          label: 'Mesas' },
  { to: '/categoria/revestimientos', label: 'Revestimientos' },
  { to: '/categoria/piezas',         label: 'Piezas' },
]

function CartIcon({ count = 0 }) {
  return (
    <Link to="/carrito" className="relative flex items-center gap-1.5 text-terrazo-600 hover:text-terrazo-900 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-terrazo-700 text-terrazo-50 text-xs w-4 h-4 rounded-full flex items-center justify-center font-medium">
          {count}
        </span>
      )}
    </Link>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { getCartTotalItems } = useCart()
  const cartTotal = getCartTotalItems()

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-terrazo-900 font-medium border-b border-terrazo-700 pb-0.5'
      : 'text-terrazo-500 hover:text-terrazo-800 transition-colors'

  return (
    <header className="sticky top-0 z-50 bg-terrazo-50 border-b border-terrazo-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-terrazo-700 rounded-sm" />
          <span className="text-lg font-medium text-terrazo-800 tracking-tight">
            Terrazo Shop
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <CartIcon count={cartTotal} />
          <button
            className="md:hidden text-terrazo-600 hover:text-terrazo-900"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-terrazo-200 bg-terrazo-50 px-4 py-3 flex flex-col gap-4 text-sm">
          {NAV_LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className={linkClass} onClick={() => setMenuOpen(false)}>
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-terrazo-900 text-terrazo-300 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">

        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-terrazo-400 rounded-sm" />
            <span className="text-terrazo-100 font-medium">Terrazo Shop</span>
          </div>
          <p className="text-sm leading-relaxed text-terrazo-400">
            Diseño artesanal en cemento y piedra natural. Cada pieza es única.
          </p>
        </div>

        <div>
          <h3 className="text-terrazo-100 text-sm font-medium mb-3">Categorías</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {NAV_LINKS.map(l => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-terrazo-100 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-terrazo-100 text-sm font-medium mb-3">Contacto</h3>
          <ul className="flex flex-col gap-2 text-sm text-terrazo-400">
            <li>Buenos Aires, Argentina</li>
            <li>info@terrazoshop.com</li>
            <li>WhatsApp: +54 9 11 0000-0000</li>
          </ul>
        </div>

      </div>
      <div className="border-t border-terrazo-700 py-5">
        <p className="text-center text-xs text-terrazo-500">
          © {new Date().getFullYear()} Terrazo Shop. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}

function MainLayout() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-terrazo-50">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CartProvider>
  )
}

export default MainLayout