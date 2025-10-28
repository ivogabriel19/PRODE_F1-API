// test/auth.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/models/user.js';

// --- Hook: ANTES de TODOS los tests ---
beforeAll(async () => {
    // Damos más tiempo, la BD en memoria puede tardar en arrancar
    jest.setTimeout(30000); 
    // Nos conectamos a la BD de prueba (definida en setup.js)
    await mongoose.connect(process.env.MONGO_URI); 
});

// --- Hook: ANTES de CADA test ---
beforeEach(async () => {
    // ARREGLO: Limpiamos la base de datos ANTES de cada test.
    // Esto asegura que cada 'it()' sea independiente.
    await User.deleteMany({});
});

// --- Hook: DESPUÉS de TODOS los tests ---
afterAll(async () => {
    // Cerramos la conexión
    await mongoose.connection.close();
});


// --- Bloque de Pruebas para Autenticación ---
describe('API de Autenticación (/api/auth)', () => {

  it('debería registrar un nuevo usuario (POST /register)', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
    
    // Verificamos que el usuario realmente se creó en la BD
    const user = await User.findOne({ email: 'test@example.com' });
    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  it('debería loguear un usuario existente (POST /login)', async () => {
    // 1. Creamos el usuario (necesario para este test)
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'password123'
      });
    
    // 2. Probamos el login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
  
  it('debería fallar el login con contraseña incorrecta', async () => {
    // 1. Creamos el usuario
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'loginuser2',
        email: 'login2@example.com',
        password: 'password123'
      });

    // 2. Probamos login fallido
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser2',
        password: 'passwordINCORRECTA'
      });
      
    expect(res.statusCode).toEqual(400);
  });

  it('debería acceder a una ruta protegida con un token válido (GET /perfil)', async () => {
    // ARREGLO: Este test ahora es independiente.
    
    // 1. Registramos un usuario
    const resRegister = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'perfiluser',
        email: 'perfil@example.com',
        password: 'password123'
      });
      
    // 2. Extraemos el token y el ID de la respuesta de registro
    const token = resRegister.body.token;
    const userId = resRegister.body.user.id;
    
    // 3. Usamos el token para probar la ruta protegida
    const resPerfil = await request(app)
      .get('/api/auth/perfil')
      .set('Authorization', `Bearer ${token}`);

    // 4. Verificamos la respuesta
    expect(resPerfil.statusCode).toEqual(200);
    expect(resPerfil.body._id).toEqual(userId);
    expect(resPerfil.body.username).toEqual('perfiluser');
  });

  it('debería bloquear una ruta protegida sin token (GET /perfil)', async () => {
    const res = await request(app)
      .get('/api/auth/perfil'); // Sin token

    expect(res.statusCode).toEqual(401);
  });

});