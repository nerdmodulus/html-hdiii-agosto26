/* ============================================================
   CONFIG.JS — lo único que necesitas editar para poner en marcha
   ============================================================ */

var CONFIG = {

  /* URL del Web App de Google Apps Script (termina en /exec).
     La obtienes al implementar el archivo apps-script/Codigo.gs.
     Mientras esté vacía, el módulo funciona en modo invitado. */
  API: 'https://script.google.com/macros/s/AKfycbwGkYj6h6Ch2CMx6ACSEvK1PU9GPFp8c70eBy780mvaLE55Xxd6aMFNvIohLieK6HqLWQ/exec',

  /* Planilla de curso */
  HOJA: 'Estudiantes',
  ID_PLANILLA: '1GmxngA7VLmfEI8Fvptyt5olDZf_uvcu-8g4I3E0JvHQ',

  /* Escala de notas chilena */
  NOTA_MINIMA: 1.0,
  NOTA_APROBACION: 4.0,
  NOTA_MAXIMA: 7.0,
  EXIGENCIA: 0.6,      // 60% de respuestas correctas = nota 4,0
  DECIMALES: 1,

  /* Evaluación */
  MOSTRAR_REVISION: true,   // muestra el detalle de aciertos y errores al final
  BARAJAR_PREGUNTAS: false, // true = cada estudiante recibe otro orden
  SEGUNDOS_RETROALIMENTACION: 2.2
};

/* ------------------------------------------------------------
   Convierte respuestas correctas en nota según la escala chilena
   con nivel de exigencia. Con 12 preguntas y 60% de exigencia:
   0 buenas = 1,0 · 7,2 buenas = 4,0 · 12 buenas = 7,0
   ------------------------------------------------------------ */
function calcularNota(correctas, total){
  var corte = total * CONFIG.EXIGENCIA;
  var nota;
  if(correctas < corte){
    nota = CONFIG.NOTA_MINIMA +
      (CONFIG.NOTA_APROBACION - CONFIG.NOTA_MINIMA) * (correctas / corte);
  } else {
    nota = CONFIG.NOTA_APROBACION +
      (CONFIG.NOTA_MAXIMA - CONFIG.NOTA_APROBACION) * ((correctas - corte) / (total - corte));
  }
  return Number(nota.toFixed(CONFIG.DECIMALES));
}

/* Formato chileno: coma decimal */
function formatoNota(n){
  return Number(n).toFixed(CONFIG.DECIMALES).replace('.', ',');
}
