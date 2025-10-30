import Prediction from "../models/prediction.js";
import { verificarFechaCarrera } from "../services/verificarFechaCarrera.js";
import { obtenerResultadoCarrera } from "../services/obtenerResultadoCarrera.js";
import { obtenerFechaCarrera } from "../services/obtenerFechaCarrera.js";
// NOTA: 'calcularPuntajePrediccion' no se usa en este controlador.
// Se usará en 'adminController' o 'resultadosController' 
// cuando se procesen los puntajes para TODOS los usuarios.

/**
 * @desc    Crear una nueva predicción
 * @route   POST /api/predictions
 * @access  Private
 */
export const crearPrediccion = async (req, res) => {
    // req.user es insertado por el middleware 'protect'
    const userId = req.user.id;
    const { raceYear, raceId, prediccion } = req.body;

    if (!raceYear || !raceId || !prediccion) {
        return res.status(400).json({ message: "Faltan datos (raceYear, raceId, prediccion)" });
    }

    try {
        // 1. Verificar si la carrera ya se corrió (o está por empezar)
        // Asumimos que verificarFechaCarrera devuelve 'true' SI AÚN SE PUEDE PREDECIR
        const sePuedePredecir = await verificarFechaCarrera(raceYear, raceId);
        if (!sePuedePredecir) {
            return res.status(400).json({ message: "No se puede predecir, la carrera ya comenzó o finalizó." });
        }

        // 2. Verificar si ya existe una predicción para esta carrera
        const existing = await Prediction.findOne({ userId, raceYear, raceId });
        if (existing) {
            return res.status(400).json({ message: "Ya enviaste una predicción para esta carrera." });
        }

        // 3. Obtener la fecha de la carrera para guardarla (opcional pero útil)
        const raceDate = await obtenerFechaCarrera(raceYear, raceId);

        // 4. Crear y guardar la nueva predicción
        const nuevaPrediccion = new Prediction({
            userId,
            raceId,
            raceYear,
            raceDate,
            prediccion
        });

        const savedPrediction = await nuevaPrediccion.save();

        res.status(201).json({ message: "Predicción creada con éxito", prediccion: savedPrediction });

    } catch (err) {
        console.error("Error en crearPrediccion:", err.message);
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * @desc    Obtener todas las predicciones del usuario logueado
 * @route   GET /api/predictions/mis-predicciones
 * @access  Private
 */
export const obtenerMisPredicciones = async (req, res) => {
    try {
        const predicciones = await Prediction.find({ userId: req.user.id })
            .sort({ raceDate: 1 }); // Ordenadas por fecha
        res.json(predicciones);
    } catch (err) {
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * @desc    Actualizar una predicción existente
 * @route   PUT /api/predictions/:id
 * @access  Private
 */
export const actualizarPrediccion = async (req, res) => {
    const { id } = req.params; // ID de la predicción
    const { prediccion: nuevosDatos } = req.body; // Los nuevos datos de la predicción

    try {
        const prediction = await Prediction.findById(id);

        // 1. Verificar si la predicción existe
        if (!prediction) {
            return res.status(404).json({ message: "Predicción no encontrada" });
        }

        // 2. Verificar si el usuario es dueño de esta predicción
        if (prediction.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado para modificar esta predicción" });
        }

        // 3. Verificar si la carrera ya se corrió
        const sePuedeModificar = await verificarFechaCarrera(prediction.raceYear, prediction.raceId);
        if (!sePuedeModificar) {
            return res.status(400).json({ message: "No se puede modificar, la carrera ya comenzó o finalizó." });
        }

        // 4. Actualizar y guardar
        prediction.prediccion = nuevosDatos;
        const updatedPrediction = await prediction.save();

        res.json({ message: "Predicción actualizada", prediccion: updatedPrediction });

    } catch (err) {
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * @desc    Eliminar una predicción
 * @route   DELETE /api/predictions/:id
 * @access  Private
 */
export const eliminarPrediccion = async (req, res) => {
    const { id } = req.params; // ID de la predicción

    try {
        const prediction = await Prediction.findById(id);

        // 1. Verificar si la predicción existe
        if (!prediction) {
            return res.status(404).json({ message: "Predicción no encontrada" });
        }

        // 2. Verificar si el usuario es dueño
        if (prediction.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "No autorizado para eliminar esta predicción" });
        }

        // 3. Verificar si la carrera ya se corrió
        const sePuedeEliminar = await verificarFechaCarrera(prediction.raceYear, prediction.raceId);
        if (!sePuedeEliminar) {
            return res.status(400).json({ message: "No se puede eliminar, la carrera ya comenzó o finalizó." });
        }

        // 4. Eliminar
        await Prediction.deleteOne({ _id: id, userId: req.user.id }); // Doble chequeo por si acaso

        res.json({ message: "Predicción eliminada" });

    } catch (err) {
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};

/**
 * @desc    Endpoint de prueba para calcular puntaje (NO GUARDA NADA)
 * @route   POST /api/predictions/test-score
 * @access  Public (o Admin, según definas en tus rutas)
 */
export async function procesarPrediction(req, res) {
    // Este endpoint es solo un "calculador" de prueba.
    try {
        const { anio, carrera, pilotoP1, pilotoP2, pilotoP3 } = req.body;

        if (!anio || !carrera || !pilotoP1 || !pilotoP2 || !pilotoP3) {
            return res.status(400).json({ error: "Faltan datos en la solicitud.", datos: req.body });
        }

        const resultadoReal = await obtenerResultadoCarrera(carrera, anio);
        if (!resultadoReal || resultadoReal.length === 0) {
            return res.status(404).json({
                error: "No se encontraron resultados para la carrera especificada.",
            });
        }

        const prediccionUsuario = [pilotoP1, pilotoP2, pilotorP3]; // Ajusta esto a tu lógica

        // ¡Esta función debe venir de tus utils!
        const puntajes = calcularPuntajePrediccion(prediccionUsuario, resultadoReal);

        res.json({ puntajes });
    } catch (error) {
        console.error("Error al procesar la predicción:", error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
}

export async function obtenerPrediccionCarrera(req, res) {
    try {
        // Obtenemos los parámetros de la URL
        const { year, raceId } = req.params;

        // Obtenemos el userId del token (añadido por el middleware 'protect')
        const userId = req.user._id;

        const prediction = await Prediction.findOne({
            userId: userId,
            raceYear: year, // Asumo que se llama 'raceYear' en tu modelo
            // Si usas 'round' en lugar de 'raceId' para identificarla, usa esto.
            // Si usas 'raceId', cambia 'raceRound: round' por 'raceId: req.params.raceId'
            raceId: raceId // !! Ajusta esto si el campo se llama 'raceId' en tu modelo 'prediction'
        });

        if (!prediction) {
            // No es un error, simplemente no se encontró
            return res.status(200).json(null);
        }

        res.json(prediction);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al buscar la predicción' });
    }
}