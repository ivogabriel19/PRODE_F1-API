import {obtenerFechaCarrera} from "../src/services/obtenerFechaCarrera.js"

const year = 2025;

function getRandom(c) {
  const indiceAleatorio = Math.floor(Math.random() * c.length);
  return c[indiceAleatorio];
}

async function login() {
  try {
    const usr = getUserRandom();
    console.log("Logueando a :", usr);
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usr,
        password: usr,
      }),
    });

    //console.log("Respuesta del login:", response.status);

    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    //console.log("Cuerpo del login:", data);

    if (data.token) {
      //console.log("Login exitoso. Token recibido:", data.token);
      return data.token;
    } else {
      //console.error("No se recibió el token.");
      return null;
    }
  } catch (error) {
    console.error("Error en login:", error);
    return null;
  }
}

function getUserRandom() {
  const users = [
    "ivogabriel",
    "user1",
    "user2",
    "user3"
  ];
  return getRandom(users);
}

async function getCarreraRandom(anio) {
  return await fetch(`http://localhost:3000/api/obtener/carreras/${anio}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      //console.log("Peticion procesada, respuesta del servidor:", data);
      return getRandom(data.carreras);
    })
    .catch((error) => {
      console.error("Error al obtener carreras:", error);
    });
}

async function getPrediccionRandom(anio) {
  try {
    const response = await fetch(`http://localhost:3000/api/obtener/conductores/${anio}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    const data = await response.json();
    const conductores = data.conductores;

    if (conductores.length < 3) {
      throw new Error("No hay suficientes conductores para armar una predicción.");
    }

    // Elegimos 3 distintos aleatorios
    const seleccionados = [];
    while (seleccionados.length < 3) {
      const elegido = getRandom(conductores);
      if (!seleccionados.includes(elegido)) {
        seleccionados.push(elegido);
      }
    }

    return {
      P1: seleccionados[0],
      P2: seleccionados[1],
      P3: seleccionados[2],
    };
  } catch (error) {
    console.error("Error al obtener conductores:", error);
    return [];
  }
}

async function cargarPredic(year, token) {
  //console.log(year, token);
  let carreraACargar = await getCarreraRandom(year);
  let prediccionACargar = await getPrediccionRandom(year);
  //let fechaCarrera = await obtenerFechaCarrera(year, carreraACargar);

  console.log("Cargando el podio ", prediccionACargar, " para la carrera ", carreraACargar, year);

  //Peticion1
  await fetch("http://localhost:3000/api/predictions/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      raceYear: year,
      raceId: carreraACargar,
      //raceDate: fechaCarrera,
      prediccion: prediccionACargar,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        console.error("Error en la petición:", response, "code:", response.status);
        throw new Error(`Error: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Peticion procesada, respuesta del servidor:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error al enviar la predicción:", error);
    });
}

// (() => {
//   getPrediccionRandom(year).then((res) => {
//     console.log("Pdio ", res);
//   });
// })();

async function main() {
  const token = await login();
  //console.log("Token obtenido:", token);
  if (token) {
    await cargarPredic(year, token);
  } else {
    console.error("No se pudo obtener el token.");
  }
}

for (let i = 0; i < 10; i++) await main(); 
//FIXME: no espera a que termine una para iniciar la siguiente