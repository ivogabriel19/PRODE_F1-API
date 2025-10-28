// test/cargarPrediccionesRandom.js
// ¡ESTO NO ES UN TEST DE JEST! Es un script de utilidad.
// Ejecútalo con: node test/cargarPrediccionesRandom.js

import fetch from 'node-fetch'; // Necesitarás 'node-fetch' o similar
import { obtenerFechaCarrera } from "../src/services/obtenerFechaCarrera.js";

const year = 2024; // O el año que estés probando
const API_URL = "http://localhost:3000"; // Tu API local

function getRandom(c) {
  const indiceAleatorio = Math.floor(Math.random() * c.length);
  return c[indiceAleatorio];
}

async function login(username, password) {
  try {
    console.log(`Logueando a: ${username}`);
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error(`Error en login para ${username}:`, error.message);
    return null;
  }
}

function getUserRandom() {
  const users = [
    { user: "ivogabriel", pass: "ivogabriel" },
    { user: "user1", pass: "user1" },
    { user: "user2", pass: "user2" },
    { user: "user3", pass: "user3" }
    // Asume que estos usuarios ya están registrados en tu BD
  ];
  return getRandom(users);
}

async function getCarreraRandom(anio) {
  try {
    const response = await fetch(`${API_URL}/api/obtener/carreras/${anio}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const carreras = await response.json(); // La API ahora devuelve un array
    return getRandom(carreras).raceId; // Asumo que el ID se llama 'raceId'
  } catch (error) {
    console.error("Error al obtener carreras:", error);
    return null;
  }
}

async function getPrediccionRandom(anio) {
  try {
    const response = await fetch(`${API_URL}/api/obtener/conductores/${anio}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const conductores = await response.json(); // La API ahora devuelve un array

    if (conductores.length < 3) throw new Error("No hay suficientes conductores");

    const seleccionados = {};
    while (Object.keys(seleccionados).length < 3) {
      const elegido = getRandom(conductores).driverId;
      if (!Object.values(seleccionados).includes(elegido)) {
        if (!seleccionados.p1) seleccionados.p1 = elegido;
        else if (!seleccionados.p2) seleccionados.p2 = elegido;
        else if (!seleccionados.p3) seleccionados.p3 = elegido;
      }
    }
    return seleccionados;
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    return null;
  }
}

async function cargarPredic(year, token) {
  const carreraACargar = await getCarreraRandom(year);
  const prediccionACargar = await getPrediccionRandom(year);

  if (!carreraACargar || !prediccionACargar) {
    console.error("No se pudo obtener carrera o predicción, saltando...");
    return;
  }

  console.log(`Cargando podio ${JSON.stringify(prediccionACargar)} para la carrera ${carreraACargar} (${year})`);

  try {
    // Usamos la ruta POST /api/predictions que creamos
    const response = await fetch(`${API_URL}/api/predictions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        raceYear: year,
        raceId: carreraACargar,
        prediccion: prediccionACargar,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Error al enviar predicción [${response.status}]: ${data.message}`);
    } else {
      console.log("Respuesta del servidor:", data.message);
    }
  } catch (error) {
    console.error("Error fatal al enviar la predicción:", error);
  }
}

async function main() {
  const { user, pass } = getUserRandom();
  const token = await login(user, pass);
  
  if (token) {
    await cargarPredic(year, token);
  } else {
    console.error(`No se pudo obtener token para ${user}.`);
  }
}

// --- Bucle Principal Corregido ---
// Esta función IIFE (autoejecutable) asegura que el bucle for
// espere a que termine cada 'main()' antes de empezar el siguiente.
(async () => {
  console.log("--- Iniciando carga de 10 predicciones random ---");
  for (let i = 0; i < 10; i++) {
    console.log(`\n--- Predicción #${i + 1} ---`);
    await main();
  }
  console.log("\n--- Carga finalizada ---");
})();