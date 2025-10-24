import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

//import { users } from '../data/users.js';

export async function register(req, res) {
  const { username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(409).json({ message: "Usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar usuario", error: err });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    //console.log("🔎 Usuario encontrado:", user);

    if (!user) return res.status(401).json({ message: "Usuario no encontrado" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Contraseña incorrecta" });

    // if (!JWT_SECRET) {
    //   console.error("🚨 JWT_SECRET está indefinido");
    //   return res.status(500).json({ message: "Error interno: token no configurado" });
    // }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    console.log("tokenJWT de",username,":", token);
    res.status(200).json({ token });
  } catch (err) {
    console.error("🧨 Error en login:", err);
    res.status(500).json({ message: "Error al iniciar sesión", error: err.message });
  }
}
