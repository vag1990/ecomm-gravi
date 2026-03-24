// src/services/productService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  writeBatch,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from './firebase'

const COL = 'products'

// ── leer todos los productos ───────────────────────────────────────────────
export async function getProducts() {
  const snap = await getDocs(
    query(collection(db, COL), orderBy('createdAt', 'desc'))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── leer por categoría ─────────────────────────────────────────────────────
export async function getProductsByCategory(category) {
  const snap = await getDocs(
    query(
      collection(db, COL),
      where('category', '==', category)
    )
  )
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  return docs.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0))
}

// ── leer un producto por ID ────────────────────────────────────────────────
export async function getProductById(id) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

// ── leer productos destacados ──────────────────────────────────────────────
export async function getFeaturedProducts() {
  const snap = await getDocs(
    query(collection(db, COL), where('featured', '==', true))
  )
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── agregar un producto ────────────────────────────────────────────────────
export async function addProduct(product) {
  return addDoc(collection(db, COL), {
    ...product,
    createdAt: serverTimestamp(),
  })
}

// ── carga inicial de datos de ejemplo (solo correr una vez) ───────────────
export async function seedProducts() {
  const PRODUCTS = [
    {
      name:     'Mesa octagonal grande',
      category: 'mesas',
      price:    185000,
      material: 'Terrazo blanco + mármol carrara',
      dims:     '90 × 90 cm · Alt. 75 cm',
      weight:   '42 kg',
      stock:    3,
      featured: true,
      description:
        'Mesa de comedor en terrazo blanco con incrustaciones de mármol carrara. Base de hierro pintado. Ideal para espacios modernos y minimalistas. Cada pieza es única.',
    },
    {
      name:     'Mesa baja rectangular',
      category: 'mesas',
      price:    220000,
      material: 'Terrazo negro + cuarzo blanco',
      dims:     '120 × 60 cm · Alt. 40 cm',
      weight:   '55 kg',
      stock:    2,
      featured: true,
      description:
        'Mesa ratona en terrazo negro profundo con áridos de cuarzo blanco. Terminación pulida a espejo. Base de hierro negro mate.',
    },
    {
      name:     'Mesa redonda café',
      category: 'mesas',
      price:    98000,
      material: 'Terrazo ocre + piedra beige',
      dims:     'Ø 70 cm · Alt. 72 cm',
      weight:   '28 kg',
      stock:    5,
      featured: false,
      description:
        'Mesa pequeña para living o rincón de lectura. Colores cálidos que combinan con ambientes naturales.',
    },
    {
      name:     'Hex 15 natural',
      category: 'revestimientos',
      price:    8200,
      material: 'Cemento pigmentado natural',
      dims:     '15 × 15 cm · 1,5 cm espesor',
      weight:   '0,8 kg/u',
      stock:    200,
      featured: true,
      description:
        'Baldosa hexagonal artesanal en tono natural. Apta para pisos y paredes. Venta por unidad o por m².',
    },
    {
      name:     'Panel hexagonal gris',
      category: 'revestimientos',
      price:    9800,
      material: 'Cemento gris + áridos negros',
      dims:     '15 × 15 cm · 1,5 cm espesor',
      weight:   '0,9 kg/u',
      stock:    150,
      featured: false,
      description:
        'Versión en gris oscuro con áridos negros visibles. Ideal para baños y cocinas de estética industrial.',
    },
    {
      name:     'Placa rectangular lisa',
      category: 'revestimientos',
      price:    6500,
      material: 'Cemento blanco puro',
      dims:     '30 × 15 cm · 1,2 cm espesor',
      weight:   '1,1 kg/u',
      stock:    300,
      featured: false,
      description:
        'Placa de cemento blanco sin áridos visibles. Superficie lisa y mate. Perfecta para revestimiento de paredes.',
    },
    {
      name:     'Panel relieve geométrico',
      category: 'piezas',
      price:    42000,
      material: 'Cemento + áridos mixtos',
      dims:     '40 × 60 cm · 3 cm espesor',
      weight:   '8 kg',
      stock:    8,
      featured: true,
      description:
        'Pieza decorativa con patrón geométrico en relieve. Pensada para colgar en pared o apoyar sobre muebles.',
    },
    {
      name:     'Escultura cónica',
      category: 'piezas',
      price:    28000,
      material: 'Cemento pigmentado ocre',
      dims:     'Ø 18 cm · Alt. 35 cm',
      weight:   '4 kg',
      stock:    12,
      featured: false,
      description:
        'Pieza escultórica en forma de cono truncado. Superficie con textura de encofrado de madera visible.',
    },
    {
      name:     'Macetero cuadrado',
      category: 'piezas',
      price:    18500,
      material: 'Cemento natural con fibra',
      dims:     '20 × 20 cm · Alt. 22 cm',
      weight:   '3,2 kg',
      stock:    20,
      featured: false,
      description:
        'Macetero de cemento reforzado con fibra de vidrio. Liviano y resistente al exterior. Drenaje incluido.',
    },
  ]

  const batch = writeBatch(db)
  PRODUCTS.forEach(p => {
    const ref = doc(collection(db, COL))
    batch.set(ref, { ...p, createdAt: serverTimestamp() })
  })
  await batch.commit()
  console.log(`${PRODUCTS.length} productos cargados en Firestore.`)
}
