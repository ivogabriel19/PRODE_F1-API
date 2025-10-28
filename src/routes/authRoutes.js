// src/routes/authRoutes.js
import express from 'express'
// Importamos los NUEVOS controladores de auth
import { registerUser, loginUser, getUserProfile } from '../controllers/authController.js'; 
// Importamos el NUEVO middleware
import { protect } from '../middlewares/authMiddleware.js'; 
// ELIMINADO: 'viewsController.js' ya no existe

const router = express.Router();

// --- Rutas Públicas ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// ELIMINADO: router.get('/login', loginView);

// --- Rutas Privadas ---
// Ruta para que el usuario logueado obtenga sus propios datos
router.get('/perfil', protect, getUserProfile); 

export default router;