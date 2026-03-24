import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import CartPage from './pages/CartPage'
import OrderConfirmation from './pages/OrderConfirmation'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,                   element: <Home /> },
      { path: 'categoria/:category',   element: <CategoryPage /> },
      { path: 'producto/:productId',   element: <ProductDetail /> },
      { path: 'carrito',               element: <CartPage /> },
      { path: 'orden/:orderId',        element: <OrderConfirmation /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/admin/dashboard', element: <AdminDashboard /> }
])

export default router