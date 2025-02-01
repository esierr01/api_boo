export const obtenerFecha = () => {
  const fechaActual = new Date();
  return fechaActual.toLocaleDateString("es-VE");
};

export const obtenerHora = () => {
  const fechaActual = new Date();
  return fechaActual.toLocaleTimeString("es-VE");
};
