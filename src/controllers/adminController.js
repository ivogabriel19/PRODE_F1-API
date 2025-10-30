import User from "../models/user.js";
// 'Result' (modelo) ya no es necesario si no guardamos los resultados manualmente
// import Result from "../models/result.js"; 

// --- Servicios Externos ---
// Necesitamos el servicio que trae los resultados reales de la API de F1
import { obtenerResultadoCarrera } from '../services/obtenerResultadoCarrera.js'; 

// --- Lógica Interna ---
import { processPredictions } from "../utils/processPredictions.js"; // Tu script de cálculo

/**
 * @desc    (ADMIN) Procesar puntajes de una carrera para TODOS los usuarios
 * @route   POST /api/admin/procesar-puntajes
 * @access  Private (Admin)
 *
 * Este endpoint es el "Botón Rojo":
 * 1. Obtiene los resultados OFICIALES de la API externa (Ergast).
 * 2. Llama al script 'processPredictions' para calcular y guardar los puntajes.
 */
export async function procesarPuntajesCarrera(req, res) {
    const { raceYear, raceId, round } = req.body; 

        if (!raceYear || !raceId || !round) {
        return res.status(400).json({ message: "Faltan raceYear, raceId y round" });
}

    try {
        // 1. Obtener los resultados OFICIALES desde la API externa
        // Asumimos que este servicio devuelve el formato que 'processPredictions' espera
        const resultadosOficiales = await obtenerResultadoCarrera(round, raceYear);
        
        if (!resultadosOficiales || resultadosOficiales.length === 0) {
            return res.status(404).json({ message: "Aún no hay resultados oficiales en la API externa para esa carrera." });
        }

        // 2. Llamar al script de 'utils' para que haga la magia
        // Le pasamos los resultados que acabamos de obtener.
        // Asumimos que processPredictions(..) hace lo siguiente:
        //  - Busca TODAS las predicciones para esa carrera
        //  - Compara con 'resultadosOficiales'
        //  - Actualiza el 'score' en CADA 'User' (User.findByIdAndUpdate)
        await processPredictions(raceId, raceYear, resultadosOficiales);

        res.status(200).json({ message: `Puntajes para ${raceId} (${raceYear}) procesados correctamente.` });
    
    } catch (err) {
        console.error("Error al procesar predicciones:", err);
        res.status(500).json({ message: "Error al procesar predicciones.", error: err.message });
    }
}


/**
 * @desc    (ADMIN) Listar todos los usuarios y sus puntajes
 * @route   GET /api/admin/usuarios
 * @access  Private (Admin)
 */
export async function listarUsuarios(req, res) {
    try {
        // Leemos el puntaje que ya está guardado en el documento del usuario
        // (Calculado por 'processPredictions')
        const usuarios = await User.find()
            .select("username role email score exactMatches perfectPredictions") 
            .sort({ score: -1 }); 

        res.json(usuarios);

    } catch (err) {
        res.status(500).json({ message: "Error al obtener usuarios", error: err.message });
    }
}