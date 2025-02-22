const zonaHorariaVenezuela = "America/Caracas";

export const obtenerFecha = () => {
  const fechaActual = new Date();
  return new Intl.DateTimeFormat("es-VE", {
    timeZone: zonaHorariaVenezuela,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(fechaActual);
};

export const obtenerHora = () => {
  const fechaActual = new Date();
  return new Intl.DateTimeFormat("es-VE", {
    timeZone: zonaHorariaVenezuela,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).format(fechaActual);
};