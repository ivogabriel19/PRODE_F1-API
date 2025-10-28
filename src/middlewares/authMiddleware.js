import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js'; // Necesitamos el modelo para buscar al usuario

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// --- Middleware de Protección ---
// Verifica si el usuario está autenticado
export const protect = async (req, res, next) => {
    let token;

    // 1. Leer el token del header "Authorization"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 2. Obtener el token (formato: "Bearer TOKEN...")
            token = req.headers.authorization.split(' ')[1];

            // 3. Verificar el token
            const decoded = jwt.verify(token, JWT_SECRET);

            // 4. Buscar al usuario por el ID del token y adjuntarlo al 'req'
            // Excluimos la contraseña del objeto 'user'
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                 return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            // 5. Continuar con la siguiente función (el controlador)
            next();

        } catch (error) {
            console.error(error);
            // Si el token falla (expirado, inválido)
            return res.status(401).json({ message: 'No autorizado, token falló' });
        }
    }

    // 6. Si no hay token o no tiene el formato "Bearer"
    if (!token) {
        return res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

// --- Middleware de Administración ---
// Verifica si el usuario es Admin (después de 'protect')
export const admin = (req, res, next) => {
    // Primero debe pasar por 'protect', por lo que 'req.user' debe existir
    if (req.user && req.user.role === 'admin') {
        next(); // Es admin, continuar
    } else {
        res.status(403).json({ message: 'No autorizado, se requiere rol de administrador' });
    }
};