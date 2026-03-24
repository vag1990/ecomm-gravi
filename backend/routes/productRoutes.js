import express from 'express';
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase.js';

const router = express.Router();

// GET /api/products
router.get('/', async (req, res) => {
    try {
        const snap = await getDocs(collection(db, 'products'));
        const products = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const { stock, price } = req.body;
        
        let updateData = {};
        if (stock !== undefined && typeof stock === 'number' && stock >= 0) {
            updateData.stock = stock;
        }
        if (price !== undefined && typeof price === 'number' && price >= 0) {
            updateData.price = price;
        }

        if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ error: 'Faltan datos válidos (stock o price)' });
        }
        
        const docRef = doc(db, 'products', pid);
        await updateDoc(docRef, updateData);
        
        const updated = await getDoc(docRef);
        res.json({ id: updated.id, ...updated.data() });
    } catch (error) {
        console.error("Error updating stock:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
