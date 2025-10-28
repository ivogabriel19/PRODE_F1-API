// test/procesarPredicciones.js
// ¡ESTO NO ES UN TEST DE JEST! Es un script de utilidad.
// Ejecútalo con: node test/procesarPredicciones.js

import fetch from 'node-fetch';

const API_URL = "http://localhost:3000";
const ADMIN_USER = "ivogabriel"; // Tu usuario admin
const ADMIN_PASS = "ivogabriel"; // Tu pass admin

// Datos de la carrera que quieres procesar
const CARRERA_A_PROCESAR = {
    raceYear: 2024,
    raceId: "miami" // La carrera que quieres que se calcule
};


async function login() {
  try {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: ADMIN_USER,
        password: ADMIN_PASS,
      }),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Error en login de admin:", error);
    return null;
  }
}

(async () => {
  console.log("Logueando como admin...");
  const token = await login();

  if (!token) {
    console.error("No se pudo loguear como admin. Abortando.");
    return;
  }

  console.log(`Disparando procesamiento para: ${CARRERA_A_PROCESAR.raceId} (${CARRERA_A_PROCESAR.raceYear})...`);

  try {
    // Usamos la ruta de admin que creamos
    const response = await fetch(`${API_URL}/api/admin/procesar-puntajes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(CARRERA_A_PROCESAR)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`[${response.status}] ${data.message}`);
    }
    
    console.log("Petición procesada. Respuesta del servidor:");
    console.log(data);

  } catch (error) {
    console.error("Error al procesar predicciones:", error);
  }
})();