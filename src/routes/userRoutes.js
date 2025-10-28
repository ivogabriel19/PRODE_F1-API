// src/routes/userRoutes.js
import express from 'express';
// ELIMINADO: registerUser ya no vive en userController
import { obtenerLeaderboard } from '../controllers/userController.js'; 
import { getNotificaciones, checkNotificacion } from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js'; // Middleware NUEVO

const router = express.Router();

// --- Rutas Públicas ---
router.get('/leaderboard', obtenerLeaderboard);

// ELIMINADO: router.post('/register', registerUser); (Movido a authRoutes)

// --- Rutas Privadas (para el usuario logueado) ---
router.get('/notificaciones', protect, getNotificaciones);
// Cambiado a PUT, es más correcto para una actualización
router.put('/notificaciones/:id/leida', protect, checkNotificacion); 

export default router;