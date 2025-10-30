import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
    rejectUnauthorized: false
});

export async function obtenerConductoresPorAnio(anio) {
    try {
        const response = await fetch(`https://api.jolpi.ca/ergast/f1/${anio}/drivers.json`, { agent });
        const data = await response.json();
        const conductores = data.MRData.DriverTable.Drivers.map(driver => ({
            driverId: driver.driverId,
            givenName: driver.givenName,
            familyName: driver.familyName,
            code: driver.code // ej: "VER"
        }));
        return conductores;
    } catch (err) {
        throw new Error("Error al obtener los conductores: " + err.message);
    }
}