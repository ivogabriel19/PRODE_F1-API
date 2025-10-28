import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// --- Función Auxiliar para generar el Token ---
// Es buena práctica tenerla separada
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, JWT_SECRET, {
        expiresIn: '24h', // El token durará 24 horas
    });
};

// --- Registro de Nuevo Usuario ---
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Verificar si faltan campos
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Por favor, completa todos los campos' });
        }

        // 2. Verificar si el usuario (por username o email) ya existe
        const userByUsername = await User.findOne({ username });
        if (userByUsername) {
            return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        }
        
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // 3. Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Crear el nuevo usuario
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            // role se asigna por default según tu modelo
        });

        const savedUser = await newUser.save();

        // 5. Generar un token
        const token = generateToken(savedUser._id, savedUser.role);

        // 6. Enviar la respuesta JSON al frontend
        res.status(201).json({
            message: 'Usuario registrado con éxito',
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al registrar el usuario' });
    }
};

// --- Login de Usuario ---
export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Verificar si el usuario existe
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Credenciales inválidas (usuario)' });
        }

        // 2. Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales inválidas (contraseña)' });
        }

        // 3. Generar un token
        const token = generateToken(user._id, user.role);

        // 4. Enviar la respuesta JSON al frontend
        res.status(200).json({
            message: 'Login exitoso',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor al intentar loguear' });
    }
};

// --- Obtener Perfil de Usuario (Ejemplo de ruta protegida) ---
export const getUserProfile = async (req, res) => {
    try {
        // req.user es adjuntado por el middleware 'protect'
        // Buscamos al usuario pero excluimos la contraseña
        const user = await User.findById(req.user.id).select('-password');
        
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};