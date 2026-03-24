import { seedDatabase } from './src/utils/seedProducts.js';

seedDatabase().then(() => {
    console.log("Completado automatizado desde consola.");
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
