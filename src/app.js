import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from './config/db.js';
import {calcularPuntajePrediccion as calcularPuntaje} from "./utils/calcularPuntajePrediccion.js";

import userRoutes from './routes/userRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import resultadosRoutes from './routes/resultadosRoutes.js';
import obtenerRoutes from './routes/obtenerRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/resultados', resultadosRoutes);
app.use('/api/obtener', obtenerRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/admin", adminRoutes);

//mongo & mongoose sandbox routes
app.get('/user')

export default app;