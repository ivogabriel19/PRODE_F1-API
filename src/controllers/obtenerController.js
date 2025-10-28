import { obtenerCarrerasPorAnio as obtenerCarreras } from '../services/obtenerCarrerasPorAnio.js';
import { obtenerConductoresPorAnio as obtenerConductores } from '../services/obtenerConductoresPorAnio.js';

/**
 * @desc    Obtener el calendario de carreras por año
 * @route   GET /api/obtener/carreras/:anio
 * @access  Public
 */
export async function obtenerCarrerasPorAnio(req, res) {
    const { anio } = req.params;

    try {
        const carreras = await obtenerCarreras(anio);
        if (!carreras || carreras.length === 0) {
            return res.status(404).json({ message: `No se encontraron carreras para el año ${anio}` });
        }

        // Devolvemos el array directamente
        res.json(carreras); 
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las carreras", error: err.message });
    }
}

/**
 * @desc    Obtener el listado de conductores por año
 * @route   GET /api/obtener/conductores/:anio
 * @access  Public
 */
export async function obtenerConductoresPorAnio(req, res) {
    const { anio } = req.params;

    try {
        const conductores = await obtenerConductores(anio);
        if (!conductores || conductores.length === 0) {
            return res.status(404).json({ message: `No se encontraron conductores para el año ${anio}` });
        }

        // Devolvemos el array directamente
        res.json(conductores);
    } catch (err) {
        res.status(500).json({ message: "Error al obtener los conductores", error: err.message });
    }
}