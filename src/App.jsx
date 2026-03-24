import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './services/firebase'

function App() {
  const [status, setStatus] = useState('Conectando a Firebase...')
  const [seeding, setSeeding] = useState(false)

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocs(collection(db, 'test'))
        setStatus('Firebase conectado correctamente')
      } catch (error) {
        setStatus('Error: ' + error.message)
      }
    }
    testConnection()
  }, [])

  const handleSeed = async () => {
    const { seedDatabase } = await import('./utils/seedProducts')
    setSeeding(true)
    const success = await seedDatabase()
    if (success) {
      alert('Productos cargados a Firebase exitosamente!')
    } else {
      alert('Hubo un error cargando los productos.')
    }
    setSeeding(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f2]">
      <div className="text-center p-8 bg-[#ede9e3] shadow-md max-w-md w-full border border-[#d9d1c5]">
        <h1 className="text-4xl font-medium text-[#3a2e24] mb-3 font-serif">
          Terrazo Shop
        </h1>
        <p className="text-[#8f7a62] text-sm mt-4 mb-8">{status}</p>
        
        <button 
          onClick={handleSeed}
          disabled={seeding}
          className="bg-[#3a2e24] text-[#f7f5f2] px-6 py-3 uppercase text-xs tracking-widest hover:bg-[#5e4d3d] transition-colors disabled:opacity-50"
        >
          {seeding ? 'Cargando...' : 'Cargar Productos Mock'}
        </button>
      </div>
    </div>
  )
}

export default App