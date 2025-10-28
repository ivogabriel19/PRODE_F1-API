import fetch from 'node-fetch';

export async function obtenerCarrerasPorAnio(anio) {
    try {
      const response = await fetch(`https://api.jolpi.ca/ergast/f1/${anio}.json`);
      const data = await response.json();
      const carreras = data.MRData.RaceTable.Races.map(r => r.raceName);
      return carreras;
    } catch (err) {
      throw new Error("Error al obtener las carreras: " + err.message);
    }
};