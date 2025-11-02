/**

 * @param {Object} a - Punto A {latitude, longitude}
 * @param {Object} b - Punto B {latitude, longitude}
 */
export const calcularDistancia = (a, b) =>
  Math.hypot((a.latitude - b.latitude) * 111000, (a.longitude - b.longitude) * 111000);

/**
 * Formatea una fecha en formato local legible.
 */
export const formatearFecha = (fecha) => {
  try {
    return new Date(fecha).toLocaleString();
  } catch {
    return fecha;
  }
};
