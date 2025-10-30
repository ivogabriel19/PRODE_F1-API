import Prediction from "../models/prediction.js";
import Result from "../models/result.js";
import User from "../models/user.js";
import Notification from "../models/notification.js";
import { calcularPuntajePrediccion } from "./calcularPuntajePrediccion.js";
import { obtenerResultadoCarrera } from "../services/obtenerResultadoCarrera.js";

export async function processPredictions(raceId, raceYear, resultadosOficiales) {
  try {
    const now = new Date();
    const predictions = await Prediction.find({ 
      raceId: raceId, 
      raceYear: raceYear 
    });
    if (!predictions || predictions.length === 0) {
      console.log("No hay predicciones vencidas para procesar.");
      return;
    }

    for (const prediction of predictions) {
      const { raceId, raceYear, userId, prediccion } = prediction;

      // 1. Obtener resultado real desde la función proporcionada
      //const resultadoReal = await obtenerResultadoCarrera(raceId, raceYear); // raceId = nombre carrera
      const resultadoReal = resultadosOficiales;

      if (!resultadoReal || resultadoReal.length === 0) {
        console.log(`Sin resultados para carrera ${raceId} ${raceYear}`);
        continue;
      }

      // 2. Calcular puntaje
      const prediccionArray = [prediccion.p1, prediccion.p2, prediccion.p3];
      const { puntos, coincidenciasExactas, prediccionPerfecta } =
        calcularPuntajePrediccion(prediccionArray, resultadoReal);

      // 3. Crear result
      await Result.create({
        userId,
        raceId,
        raceYear,
        prediccion,
        submittedAt: prediction.submittedAt,
        score: puntos,
        processedAt: new Date(),
      });

      // 4. Eliminar prediction original
      await Prediction.deleteOne({ _id: prediction._id });

      // 5. Actualizar usuario
      await User.findByIdAndUpdate(userId, {
        $inc: {
          score: puntos,
          exactMatches: coincidenciasExactas,
          perfectPredictions: prediccionPerfecta ? 1 : 0,
        },
      });

      //6. Crear una notificación para el usuario
      await Notification.create({
        userId: userId,
        message: `Se procesó tu predicción para la carrera ${raceId}. Puntaje: ${puntos}.`,
      });


      console.log(`✔ Procesada predicción para ${raceId} (${raceYear}) de ${userId}`);
      console.log(`Puntos: ${puntos}, Coincidencias exactas: ${coincidenciasExactas}, Perfecta: ${prediccionPerfecta}`);
    }

    console.log(`✔ Todas las predicciones para ${raceId} (${raceYear}) han sido procesadas.`);
  } catch (error) {
    console.error("❌ Error procesando predicciones:", error);
  }
};