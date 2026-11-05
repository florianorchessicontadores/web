/* ==========================================================
   CATÁLOGO DE RECURSOS DESCARGABLES — único archivo a editar
   ----------------------------------------------------------
   1) Copie el archivo (xlsx, xlsm, pdf, etc.) en la carpeta  recursos-archivos/
   2) Copie uno de los bloques { ... } de abajo, péguelo al final de la lista
      y cambie los datos. No olvide la coma entre bloques.
   3) Suba los cambios a GitHub. La tarjeta aparece sola.

   Campos:
     titulo       Nombre del recurso (obligatorio)
     descripcion  Texto breve (obligatorio)
     categoria    Una de las categorías de abajo (o una nueva: se crea sola)
     archivo      Nombre EXACTO del archivo, con espacios y mayúsculas (obligatorio)
     tipo         "XLSX", "XLSM", "PDF"... Se usa en el botón si no escribe "boton"
     boton        Texto del botón (opcional). Ej.: "Descargar XLSX"
     activo       false para ocultarlo temporalmente (opcional)
   Si el archivo no existe en la carpeta, la tarjeta no se muestra (no hay enlaces rotos).
   ========================================================== */
window.RECURSOS_CARPETA = "recursos-archivos/";

window.RECURSOS_CATEGORIAS = [
  "Gestión tributaria",
  "Gestión contable",
  "Gestión laboral",
  "Herramientas empresariales"
];

window.RECURSOS = [
  {
    titulo: "Plantilla de remuneraciones con asiento contable",
    descripcion: "Excel editable (con macros) para el cálculo mensual de la planilla y su asiento contable.",
    categoria: "Gestión laboral",
    archivo: "Planilla de remuneraciones con asiento contable.xlsm",
    tipo: "XLSM",
    boton: "Descargar XLSM"
  },
  {
    titulo: "Control de vencimientos SUNAT 2026",
    descripcion: "Excel para controlar los vencimientos según el cronograma de SUNAT.",
    categoria: "Gestión tributaria",
    archivo: "ControlvencimientosSunat2026.xlsx",
    tipo: "XLSX",
    boton: "Descargar XLSX"
  }
];
