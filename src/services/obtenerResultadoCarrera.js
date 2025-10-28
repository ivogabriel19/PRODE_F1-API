import {obtenerRoundPorNombre} from './obtenerRoundPorNombre.js';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

export async function obtenerResultadoCarrera(nombreCarrera, year) {
    let resultados = await obtenerDesdeErgast(year, nombreCarrera);
    //if (resultados) return { fuente: 'ergast', resultados };
    if (resultados) return  resultados ;
    return [] ;
}

async function obtenerDesdeErgast(year, nombreCarrera) {
    try {
        //console.log('Nombre de la carrera:', nombreCarrera);
        //console.log('Año de la carrera:', year);

        //FIXME: normalizar nombre carreras

        const round = await obtenerRoundPorNombre(nombreCarrera, year); // Desestructuración del slug

        console.log('Round obtenido:', round);

        if (!round) return [];

        const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`; // Ej: "bahrain_2024"
        const res = await fetch(url, { agent });
        console.log("Consultando: ", url);

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        // Acceder al array de resultados
        const resultados = json.MRData.RaceTable.Races[0].Results;

        // Obtener la lista de pilotos por posición
        const pilotosOrdenados = resultados.map(r => r.Driver.driverId); // ej: "leclerc", "verstappen"

        return pilotosOrdenados; // ["verstappen", "leclerc", "norris", ...]
    } catch (err) {
        console.error('Error al obtener resultados:', err.message);
        return [];
    }
}