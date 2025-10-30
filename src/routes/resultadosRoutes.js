// src/routes/resultados.routes.js
import { Router } from 'express';
import {  evaluarProde, 
          obtenerResultadoCompletoCarrera, 
          obtenerMisResultados } from '../controllers/resultadosController.js';

import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/evaluar', evaluarProde);


// GET /api/resultados/:anio/:nombreCarrera
router.get('/:anio/:nombreCarrera', obtenerResultadoCompletoCarrera);

router.get(
  '/mis-resultados', 
  protect,
  obtenerMisResultados
);


export default router;
