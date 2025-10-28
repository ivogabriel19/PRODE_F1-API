import {obtenerRoundPorNombre} from './obtenerRoundPorNombre.js';
import fetch from 'node-fetch';

export async function obtenerResultadoCompletoCarrera(nombreCarrera, year) {
    try {
        //console.log('Nombre de la carrera:', nombreCarrera);
        //console.log('Año de la carrera:', year);
        const round = await obtenerRoundPorNombre(nombreCarrera, year); // Desestructuración del slug

        //console.log('Round obtenido:', round);

        const url = `https://api.jolpi.ca/ergast/f1/${year}/${round}/results.json`; // Ej: "bahrain_2024"
        const res = await fetch(url);
        //console.log("Consultando: ", url);

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        const json = await res.json();

        // Acceder al array de resultados
        const resultados = json.MRData.RaceTable.Races[0].Results;
        //console.log('Resultados obtenidos:', resultados);

        return resultados;
    } catch (err) {
        console.error('Error al obtener resultados:', err.message);
        return [];
    }
}