// test/services.test.js
import { obtenerResultadoCarrera } from '../src/services/obtenerResultadoCarrera.js';
import { obtenerConductoresPorAnio } from '../src/services/obtenerConductoresPorAnio.js';

describe('Services (API Externa)', () => {

  // Aumentamos el timeout para llamadas a APIs externas
  jest.setTimeout(10000); 

  it('debería obtener los resultados reales de una carrera (Miami 2024)', async () => {
    const resultados = await obtenerResultadoCarrera("miami", "2024");
    
    expect(Array.isArray(resultados)).toBe(true);
    
    // ARREGLO: Usamos los IDs correctos que devuelve la API
    expect(resultados[0]).toEqual("norris");      // P1
    expect(resultados[1]).toEqual("max_verstappen");  // P2
    expect(resultados[2]).toEqual("leclerc");     // P3
  });

  it('debería obtener la lista de conductores de 2024', async () => {
    const conductores = await obtenerConductoresPorAnio("2024");

    expect(Array.isArray(conductores)).toBe(true);
    expect(conductores.length).toBeGreaterThan(19);
    
    // ARREGLO: Buscamos el ID correcto
    expect(conductores).toContain("max_verstappen"); 
    expect(conductores[0]).toEqual("albon");
  });

});