// src/routes/predictionRoutes.js
import express from 'express';
import {
  crearPrediccion,
  obtenerMisPredicciones,
  actualizarPrediccion,
  eliminarPrediccion,
  procesarPrediction,
  obtenerPrediccionCarrera
} from '../controllers/predictionController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware NUEVO
const router = express.Router();

// --- Rutas CRUD para Predicciones (Protegidas) ---
router.post('/', protect, crearPrediccion);
router.get('/mis-predicciones', protect, obtenerMisPredicciones); // Ruta más clara
router.put('/:id', protect, actualizarPrediccion);
router.delete('/:id', protect, eliminarPrediccion);
router.get('/race/:year/:raceId', protect, obtenerPrediccionCarrera);

// --- Ruta de Utilidad/Prueba ---
// (Usa la función 'procesarPrediction' que era solo un calculador)
router.post('/test-score', procesarPrediction); 

// ELIMINADAS: Rutas '/submit' y '/processPrediction' porque eran duplicados de POST /

export default router;