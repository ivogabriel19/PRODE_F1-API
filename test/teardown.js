// test/teardown.js
import mongoose from 'mongoose';

export default async function globalTeardown() {
  // Leemos la instancia desde la variable GLOBAL
  const mongod = globalThis.__MONGOD__;

  if (mongod) {
    // Desconectamos mongoose y paramos el servidor en memoria
    await mongoose.disconnect();
    await mongod.stop();
  }
};