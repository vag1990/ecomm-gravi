import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);

// Optional: catch-all
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend Express corriendo en puerto ${PORT}`);
});
