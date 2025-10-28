// test/setup.js
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default async function globalSetup() {
  // Creamos la instancia
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();

  // Guardamos la instancia en una variable GLOBAL
  // 'globalThis' es el objeto global en Node.js
  globalThis.__MONGOD__ = mongod;

  // Seteamos la variable de entorno para que tu app se conecte a esta BD
  process.env.MONGO_URI = uri;

  // Conectamos Mongoose solo para verificar
  await mongoose.connect(uri);
  await mongoose.connection.close();
};