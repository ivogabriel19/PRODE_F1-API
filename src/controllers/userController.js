import User from "../models/user.js";

/*
=======================================================================
NOTA IMPORTANTE: 
La función 'registerUser' que tenías aquí fue ELIMINADA.

La lógica de registro (registerUser) ahora vive en 'authController.js',
porque la nueva versión que te pasé es mucho más completa:
1. Hashea la contraseña con bcrypt (¡Más seguro!).
2. Verifica si el email o username ya existen.
3. Genera un Token JWT y lo devuelve como JSON para el autologin.

Este controlador de 'user' se queda solo con la lógica de 
obtener datos de usuarios, como el leaderboard.
=======================================================================
*/

/**
 * @desc    Obtener el leaderboard de usuarios (Top 10)
 * @route   GET /api/users/leaderboard
 * @access  Public
 */
export async function obtenerLeaderboard(req, res) {
  try {
    // Esta función ya estaba perfecta. Devuelve JSON. No necesita cambios.
    const topUsers = await User.find({}, "username score exactMatches perfectPredictions")
                                .sort({ score: -1 })
                                .limit(10); // top 10 por puntaje
    res.json(topUsers);
  } catch (err) {
    console.error("Error al obtener leaderboard:", err.message);
    res.status(500).json({ message: "Error al obtener leaderboard", error: err.message });
  }
}

// NOTA: La función 'getUserProfile' (para el usuario logueado) 
// ya la incluí en el 'authController.js' que te pasé.