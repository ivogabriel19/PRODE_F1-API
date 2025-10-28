export default {
  // Transforma tus archivos JS usando Babel
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  
  // ELIMINADA: La línea 'extensionsToTreatAsEsm' que causaba el error

  // Forzar a Jest a usar el runner de ES Modules
  testEnvironment: "node",
  
  // Ruta al script que se ejecuta ANTES de todos los tests
  globalSetup: "./test/setup.js", 
  
  // Ruta al script que se ejecuta DESPUÉS de todos los tests
  globalTeardown: "./test/teardown.js",
};