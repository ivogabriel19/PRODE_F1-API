// src/services/obtenerCarrerasPorAnio.js
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

export async function obtenerCarrerasPorAnio(anio) {
  try {
    const response = await fetch(`https://api.jolpi.ca/ergast/f1/${anio}.json`, { agent });
    const data = await response.json();
    
    // --- ARREGLO PRINCIPAL ---
    // En lugar de devolver solo el nombre, devolvemos el objeto completo de la carrera.
    // Usamos .map() para extraer solo los datos que nos interesan.
    const carreras = data.MRData.RaceTable.Races.map(race => ({
      round: race.round,
      raceName: race.raceName,
      date: race.date,
      time: race.time,
      Circuit: race.Circuit // Incluimos el objeto Circuit completo
    }));
    
    return carreras;
    // --- FIN DEL ARREGLO ---

  } catch (err) {
    throw new Error("Error al obtener las carreras: " + err.message);
  }
}