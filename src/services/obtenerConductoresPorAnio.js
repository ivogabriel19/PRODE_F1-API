import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

export async function obtenerConductoresPorAnio(anio) {
    try {
        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${anio}/drivers.json`, { agent });
        const data = await response.json();
        const conductores = data.MRData.DriverTable.Drivers.map(d => d.driverId);
        return conductores;
    } catch (err) {
        throw new Error("Error al obtener los conductores: " + err.message);
    }
}