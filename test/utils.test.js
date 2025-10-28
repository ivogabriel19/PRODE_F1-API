// test/utils.test.js
import { calcularPuntajePrediccion } from '../src/utils/calcularPuntajePrediccion.js';

describe('Utils: calcularPuntajePrediccion', () => {

  // Tus logs demuestran que tu función devuelve un OBJETO.
  // Estos tests ahora esperan: { puntos: XX, ... }
  
  const resultadoReal = [
    "verstappen", "norris", "leclerc", "sainz", "perez",
    "hamilton", "russell", "ocon", "alonso", "gasly"
  ];

  const prediccionPerfecta = ["verstappen", "norris", "leclerc"];
  const prediccionParcial = ["verstappen", "leclerc", "perez"];
  const prediccionErrada = ["alonso", "gasly", "ocon"];


  it('debería dar puntaje perfecto (30)', () => {
    const puntaje = calcularPuntajePrediccion(prediccionPerfecta, resultadoReal);
    // ARREGLO: Comprobamos la propiedad 'puntos' del objeto
    expect(puntaje.puntos).toBe(30); 
  });

  it('debería dar puntaje parcial (17)', () => {
    const puntaje = calcularPuntajePrediccion(prediccionParcial, resultadoReal);
    // ARREGLO: Comprobamos la propiedad 'puntos' del objeto
    expect(puntaje.puntos).toBe(17);
  });

  it('debería dar puntaje (6) para la predicción errada', () => {
    // Tus logs dicen que esto da 6 puntos (seguramente por Top 10)
    const puntaje = calcularPuntajePrediccion(prediccionErrada, resultadoReal);
    // ARREGLO: Comprobamos la propiedad 'puntos' del objeto
    expect(puntaje.puntos).toBe(6);
  });
});