import { doc, setDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

export const mockProducts = [
    { id: 'mesa-oct-01', name: 'Mesa octagonal', category: 'mesas', price: 185000, material: 'Terrazo blanco + mármol', dims: '90 × 90 cm', stock: 5, image: '/foto1.jpg' },
    { id: 'mesa-rect-04', name: 'Mesa baja rect', category: 'mesas', price: 220000, material: 'Terrazo negro + cuarzo', dims: '120 × 60 cm', stock: 3, image: '/foto2.jpg' },
    { id: 'mesa-comedor-05', name: 'Mesa Comedor Oval', category: 'mesas', price: 450000, material: 'Cemento alisado y madera', dims: '200 × 100 cm', stock: 2, image: '/foto3.jpg' },
    { id: 'mesa-lateral-06', name: 'Mesa Lateral Cilindro', category: 'mesas', price: 120000, material: 'Terrazo gris + granito', dims: '40 × 50 cm', stock: 8, image: '/foto4.jpg' },

    { id: 'rev-hex-02', name: 'Hex 15 natural', category: 'revestimientos', price: 8200, material: 'Cemento pigmentado', dims: '15 × 15 cm', stock: 200, image: '/revest1020.jpg' },
    { id: 'rev-hex-07', name: 'Hex 20 pigmento oscuro', category: 'revestimientos', price: 9500, material: 'Cemento con óxidos', dims: '20 × 20 cm', stock: 150, image: '/revest10x10.webp' },
    { id: 'rev-rect-08', name: 'Listón Rectangular', category: 'revestimientos', price: 7800, material: 'Terrazo grano fino', dims: '10 × 20 cm', stock: 300, image: '/revest30.webp' },
    { id: 'rev-cuad-09', name: 'Placa Cuadrada 30x30', category: 'revestimientos', price: 12500, material: 'Cemento pulido', dims: '30 × 30 cm', stock: 120, image: '/revest49.webp' },

    { id: 'pieza-03', name: 'Panel relieve', category: 'piezas', price: 42000, material: 'Cemento + áridos', dims: '40 × 60 cm', stock: 15, image: '/pieza1.jpeg' },
    { id: 'pieza-10', name: 'Macetero Brutalista', category: 'piezas', price: 35000, material: 'Cemento texturado', dims: '30 × 40 cm', stock: 20, image: '/pieza2.jpg' },
    { id: 'pieza-11', name: 'Bandeja Oval', category: 'piezas', price: 18000, material: 'Terrazo blanco + cuarzo', dims: '25 × 15 cm', stock: 45, image: '/pieza3.jpg' },
]

export const seedDatabase = async () => {
    try {
        console.log('Iniciando seed de base de datos...')
        for (const product of mockProducts) {
            // Usamos setDoc para que el document ID coincida con el product.id
            const docRef = doc(db, 'products', product.id)
            await setDoc(docRef, product)
            console.log(`Guardado producto: ${product.name}`)
        }
        console.log('Seed completado exitosamente.')
        return true
    } catch (error) {
        console.error('Error durante el seed:', error)
        return false
    }
}
