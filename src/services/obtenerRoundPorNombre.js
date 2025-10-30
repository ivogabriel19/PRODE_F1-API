import fetch from 'node-fetch';

export async function obtenerRoundPorNombre(nombreCarrera, anio) {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/${anio}.json`;
        const res = await fetch(url);
        //console.log("Consultando: ", url);
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const data = await res.json();

        const carreras = data.MRData.RaceTable.Races;

        const carreraEncontrada = carreras.find(c =>
            c.raceName.toLowerCase().includes(nombreCarrera.toLowerCase())
        );

        //console.log("Carrera encontrada:", carreraEncontrada);

        if (!carreraEncontrada) throw new Error(`Carrera "${nombreCarrera}" no encontrada`);

        //console.log(`Carrera encontrada: ${carreraEncontrada.raceName}, Round: ${carreraEncontrada.round}`);

        return parseInt(carreraEncontrada.round);
    } catch (err) {
        console.error("Error al buscar el round:", err.message);
        return null;
    }
}