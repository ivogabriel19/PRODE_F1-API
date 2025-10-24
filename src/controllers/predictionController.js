import Prediction from "../models/prediction.js";
import { calcularPuntajePrediccion } from "../utils/calcularPuntajePrediccion.js";
import { verificarFechaCarrera } from "../services/verificarFechaCarrera.js";
import { obtenerResultadoCarrera } from "../services/obtenerResultadoCarrera.js"; 
import { obtenerFechaCarrera } from "../services/obtenerFechaCarrera.js"; 

// export async function submitPrediction(req, res) {
//   procesarPrediction(req, res)
// }

/*
export async function submitPrediction(req, res) {
  const { userId, raceId, raceYear, predictions } = req.body;

  try {
    // Obtener resultados reales de la carrera desde la API
    const resultadosReales = await obtenerResultadoCarrera(raceId, raceYear);

    if (!resultadosReales) {
      return res
        .status(404)
        .json({ message: "No se encontraron resultados para esa carrera." });
    }

    // Calcular puntaje
    const points = calcularPuntajePrediccion(predictions, resultadosReales);

    // Crear y guardar la predicción
    const newPrediction = new Prediction({
      user: userId,
      raceId,
      raceYear,
      predictions,
      points,
    });

    await newPrediction.save();

    res.status(201).json(newPrediction);
  } catch (err) {
    console.error("Error al guardar predicción:", err);
    res
      .status(400)
      .json({ message: "Error al guardar predicción", error: err });
  }
}
*/

export const crearPrediccion = async (req, res) => {
  const { raceYear, raceId, prediccion } = req.body;
  const userId = req.userId;
  const raceDate = await obtenerFechaCarrera(raceYear, raceId);
  console.log("Prediccion recibida:", prediccion);

  try {
    const nueva = new Prediction({ userId,  raceId, raceYear, raceDate, prediccion });

    const existing = await Prediction.findOne({ userId,raceYear,raceId});

    if (existing)
      return res.status(400).json({ message: "Ya enviaste una predicción para esta carrera." });

    await nueva.save();
    res.status(201).json({message:nueva});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const obtenerMisPredicciones = async (req, res) => {
  try {
    const predicciones = await Prediction.find({ userId: req.userId });
    res.json(predicciones);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const actualizarPrediccion = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;//FIXME: OJOO
  const prediction = await Prediction.findById(id);

  // if (!prediction || prediction.userId.toString() !== req.user.userId) {
  //   return res.status(403).json({ message: "No autorizado" });
  // }

  //FIXME: la API no tiene cargadas las carreras 2025
  //const carreraAunNoCorrio = await verificarFechaCarrera(prediction.raceYear,prediction.raceName);
  //if (!carreraAunNoCorrio) return res.status(400).json({message:"No se puede modificar una prediccion de una carrera que ya se corrio"});

  prediction.prediccion = req.body.prediccion;
  await prediction.save();
  res.json({ message: "Actualizado", prediction });
};

export const eliminarPrediccion = async (req, res) => {
  const { id } = req.params;
  const prediction = await Prediction.findById(id);

  if (!prediction || prediction.userId.toString() !== req.user.userId) {
    return res.status(403).json({ message: "No autorizado" });
  }

  //FIXME: la API no tiene cargadas las carreras 2025
  //const carreraAunNoCorrio = await verificarFechaCarrera(prediction.year, prediction.raceName );
  //if (!carreraAunNoCorrio) return res.status(400).json({ message: "La carrera ya se corrió" });

  try {
    await Prediction.deleteOne({ _id: id, userId: req.userId });
    res.json({ message: "Eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function procesarPrediction(req, res) {
  //endpoint para calcular un puntaje
  try {
    const { anio, carrera, pilotoP1, pilotoP2, pilotoP3 } = req.body;

    if (!anio || !carrera || !pilotoP1 || !pilotoP2 || !pilotoP3) {
      return res.status(400).json({ error: "Faltan datos en la solicitud.", datos: req.body });
    }

    // Obtener los resultados reales de la carrera
    const resultadoReal = await obtenerResultadoCarrera(carrera, anio);
    if (!resultadoReal || resultadoReal.length === 0) {
      return res.status(404).json({
        error: "No se encontraron resultados para la carrera especificada.",
      });
    }

    // Construir la predicción del usuario
    const prediccionUsuario = [pilotoP1, pilotoP2, pilotoP3];

    // Calcular el puntaje
    const puntajes = calcularPuntajePrediccion(prediccionUsuario, resultadoReal);

    res.json({ puntajes });
  } catch (error) {
    console.error("Error al procesar la predicción:", error);
    res.status(500).json({ error: "Error interno del servidor." });
  }
}