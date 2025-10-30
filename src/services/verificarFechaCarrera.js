import fetch from 'node-fetch';

export async function verificarFechaCarrera(year, raceId) {
  try {
    const res = await fetch(`https://api.jolpi.ca/ergast/f1/${year}.json`);
    const data = await res.json();
    const carreras = data.MRData.RaceTable.Races;
    const carrera = carreras.find((c) =>
      c.Circuit.circuitId.toLowerCase() === raceId.toLowerCase()
    );
    if (!carrera) {
      console.log("No se encontro la carrera en el calendario");
      return false;
    }
      const fechaCarrera = new Date(carrera.date);
      const fechaLimite = new Date(fechaCarrera.getTime() + 2 * 60 * 60 * 1000);
    return fechaLimite > new Date(); // true si aún no ocurrió
  } catch (err) {
    console.error("Error al verificar fecha de carrera", err.message);
    return false;
  }
}
