async function login() {
  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "ivogabriel",
        password: "ivogabriel",
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

(async () => {
  const token = await login();

  await fetch("http://localhost:3000/api/admin/processPredictions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  })
    .then((response) => {
      if (!response.ok) {
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
})();