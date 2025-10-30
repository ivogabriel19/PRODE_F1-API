// src/routes/adminRoutes.js
import express from "express";
// Importamos los NUEVOS middlewares de autenticación
import { protect, admin } from "../middlewares/authMiddleware.js"; 
// Importamos los NUEVOS controladores de admin
import { procesarPuntajesCarrera, listarUsuarios } from '../controllers/adminController.js';

const router = express.Router();

// Ruta para procesar los puntajes (El "botón rojo")
router.post(
            "/procesar-puntajes", // Cambiado a un nombre más claro
            protect,              // 1. Verifica token
            admin,                // 2. Verifica rol de admin
            procesarPuntajesCarrera // 3. Ejecuta el controlador correcto
        );

// Ruta para listar todos los usuarios (para el panel de admin)
router.get(
            '/usuarios', // Cambiado a un nombre más claro
            protect, 
            admin, 
            listarUsuarios
          );

export default router;