import { calcularPuntajePrediccion } from '../utils/calcularPuntajePrediccion.js';
import { obtenerResultadoCarrera } from '../services/obtenerResultadoCarrera.js';
import { obtenerResultadoCompletoCarrera as serviceObtenerResultadoCompletoCarrera } from '../services/obtenerResultadoCompletoCarrera.js';
// 'obtenerRoundPorNombre' no se está usando aquí, pero lo dejamos por si acaso.
import Result from "../models/result.js";
// import { obtenerRoundPorNombre } from '../services/obtenerRoundPorNombre.js';

/*
=======================================================================
NOTA IMPORTANTE:
Este controlador es más una "utilidad pública". 
No contiene la lógica principal de "calcular y guardar"
los puntajes de todos los usuarios.

Esa lógica (la más importante del Prode) debe vivir en
'adminController.js', ya que es una acción de administrador.
=======================================================================
*/


/**
 * @desc    Endpoint de prueba para evaluar una predicción (no guarda nada)
 * @route   POST /api/resultados/evaluar-prode
 * @access  Public (o Private, según definas)
 */
export async function evaluarProde(req, res) {
    try {
        const { nombreCarrera, año, prediccion } = req.body;

        if (!nombreCarrera || !año || !Array.isArray(prediccion)) {
            return res.status(400).json({ message: 'Faltan datos (nombreCarrera, año, prediccion)' });
        }

        const resultadoReal = await obtenerResultadoCarrera(nombreCarrera, año);
        if (!resultadoReal) {
            return res.status(404).json({ message: 'Resultados reales no encontrados para esa carrera.' });
        }
        
        const resultado = await calcularPuntajePrediccion(prediccion, resultadoReal);

        res.json({
            carrera: nombreCarrera,
            puntosCalculados: resultado, // 'resultado' era ambiguo
            resultadoReal: resultadoReal
        });
    } catch (err) {
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
}

/**
 * @desc    Obtener los resultados completos y públicos de una carrera
 * @route   GET /api/resultados/:anio/:nombreCarrera
 * @access  Public
 */
export async function obtenerResultadoCompletoCarrera(req, res) {
    try {
        const { anio, nombreCarrera } = req.params;

        if (!anio || !nombreCarrera) {
            return res.status(400).json({ message: 'Faltan parámetros (anio, nombreCarrera)' });
        }
        
        const resultado = await serviceObtenerResultadoCompletoCarrera(nombreCarrera, anio);
        
        if (!resultado) {
            return res.status(404).json({ message: 'Resultados no encontrados' });
        }

        // Devolvemos el resultado directamente, no anidado
        res.json(resultado); 
    } catch (err) {
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
}

/**
 * @desc    Obtener todos los resultados (predicciones procesadas) del usuario logueado
 * @route   GET /api/resultados/mis-resultados
 * @access  Private (¡NUEVO!)
 */
export const obtenerMisResultados = async (req, res) => {
  try {
    // 1. Buscamos en la colección 'Result'
    // 2. Usamos 'req.user.id' que viene del middleware 'protect'
    const resultados = await Result.find({ userId: req.user.id })
      .sort({ processedAt: -1 }); // Ordenamos por fecha (más nuevos primero)
    
    res.json(resultados);
  
  } catch (err) {
    console.error("Error al obtener mis resultados:", err);
    res.status(500).json({ message: "Error del servidor", error: err.message });
  }
};