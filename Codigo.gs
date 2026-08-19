/**
 * ============================================================
 * GUÍA HTML — Web App de conexión con la planilla del curso
 * ============================================================
 * Hoja "Estudiantes":
 *   A: Apellido | B: Nombre | C: Respuestas | D: Calificación
 *   E: Fecha (se crea sola si REGISTRAR_FECHA está en true)
 *
 * Implementar como: Aplicación web
 *   Ejecutar como .............. Yo (tu cuenta)
 *   Quién tiene acceso ......... Cualquier usuario
 * Copia la URL /exec y pégala en js/config.js → CONFIG.API
 * ============================================================
 */

var ID_PLANILLA   = '1GmxngA7VLmfEI8Fvptyt5olDZf_uvcu-8g4I3E0JvHQ';
var HOJA          = 'Estudiantes';
var PRIMERA_FILA  = 2;     // la fila 1 son los encabezados
var REGISTRAR_FECHA = true;
var PERMITIR_SOBRESCRIBIR = false;  // true solo si quieres reabrir intentos

/* ------------------------------------------------------------
   LECTURA — GET ?accion=lista
   ------------------------------------------------------------ */
function doGet(e){
  var p = (e && e.parameter) ? e.parameter : {};
  var salida;

  try {
    if(p.accion === 'lista'){
      salida = {ok: true, estudiantes: leerEstudiantes()};
    } else if(p.accion === 'estado'){
      salida = {ok: true, estado: estadoDeFila(Number(p.fila))};
    } else {
      salida = {ok: true, mensaje: 'Web App activo. Usa ?accion=lista'};
    }
  } catch(err){
    salida = {ok: false, mensaje: String(err.message || err)};
  }

  return responder(salida, p.callback);
}

/* ------------------------------------------------------------
   ESCRITURA — POST con JSON en el cuerpo
   ------------------------------------------------------------ */
function doPost(e){
  var candado = LockService.getScriptLock();
  var salida;

  try {
    candado.waitLock(20000);
    var datos = JSON.parse(e.postData.contents);

    if(datos.accion !== 'guardar') throw new Error('Acción no reconocida.');

    var fila = Number(datos.fila);
    var hoja = abrirHoja();
    if(!(fila >= PRIMERA_FILA && fila <= hoja.getLastRow())){
      throw new Error('Fila de estudiante fuera de rango.');
    }

    var actual = hoja.getRange(fila, 3, 1, 2).getValues()[0];
    var tieneNota = actual[0] !== '' || actual[1] !== '';

    if(tieneNota && !PERMITIR_SOBRESCRIBIR){
      salida = {ok: false, motivo: 'ya_rendido',
                mensaje: 'Esta persona ya tenía nota registrada.'};
    } else {
      var correctas = Number(datos.correctas);
      var total     = Number(datos.total) || 12;
      var nota      = Number(datos.nota);

      if(isNaN(correctas) || isNaN(nota)) throw new Error('Datos numéricos inválidos.');

      hoja.getRange(fila, 3).setValue(correctas + '/' + total);
      hoja.getRange(fila, 4).setValue(nota);

      if(REGISTRAR_FECHA){
        if(hoja.getRange(1, 5).getValue() === '') hoja.getRange(1, 5).setValue('Fecha');
        hoja.getRange(fila, 5).setValue(new Date());
      }

      salida = {ok: true, mensaje: 'Registro guardado.', fila: fila, nota: nota};
    }

  } catch(err){
    salida = {ok: false, mensaje: String(err.message || err)};
  } finally {
    try { candado.releaseLock(); } catch(x){}
  }

  return responder(salida, null);
}

/* ------------------------------------------------------------
   Auxiliares
   ------------------------------------------------------------ */
function abrirHoja(){
  var hoja = SpreadsheetApp.openById(ID_PLANILLA).getSheetByName(HOJA);
  if(!hoja) throw new Error('No existe la hoja "' + HOJA + '".');
  return hoja;
}

function leerEstudiantes(){
  var hoja = abrirHoja();
  var ultima = hoja.getLastRow();
  if(ultima < PRIMERA_FILA) return [];

  var valores = hoja.getRange(PRIMERA_FILA, 1, ultima - PRIMERA_FILA + 1, 4).getValues();
  var lista = [];

  valores.forEach(function(f, i){
    var apellido = String(f[0] || '').trim();
    var nombre   = String(f[1] || '').trim();
    if(!apellido && !nombre) return;   // salta filas vacías

    lista.push({
      fila: PRIMERA_FILA + i,
      apellido: apellido,
      nombre: nombre,
      rendido: (f[2] !== '' || f[3] !== ''),
      nota: f[3] === '' ? null : Number(f[3])
    });
  });

  lista.sort(function(a, b){
    return a.apellido.localeCompare(b.apellido, 'es');
  });
  return lista;
}

function estadoDeFila(fila){
  var hoja = abrirHoja();
  var v = hoja.getRange(fila, 1, 1, 4).getValues()[0];
  return {apellido: v[0], nombre: v[1], respuestas: v[2], nota: v[3],
          rendido: (v[2] !== '' || v[3] !== '')};
}

/**
 * Devuelve JSON normal, o JSONP si la página pidió un callback
 * (el plan B que evita cualquier problema de CORS).
 */
function responder(objeto, callback){
  var texto = JSON.stringify(objeto);
  if(callback){
    return ContentService
      .createTextOutput(callback + '(' + texto + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(texto)
    .setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------
   Utilidades para el docente (ejecutar desde el editor)
   ------------------------------------------------------------ */

/** Prueba rápida: muestra en el registro cuántos estudiantes lee. */
function probarLectura(){
  var lista = leerEstudiantes();
  Logger.log('Estudiantes leídos: ' + lista.length);
  Logger.log(lista.slice(0, 5));
}

/** Borra las notas para reabrir la evaluación a todo el curso. */
function reiniciarTodasLasNotas(){
  var hoja = abrirHoja();
  var ultima = hoja.getLastRow();
  if(ultima < PRIMERA_FILA) return;
  hoja.getRange(PRIMERA_FILA, 3, ultima - PRIMERA_FILA + 1, 3).clearContent();
  Logger.log('Notas borradas.');
}

/** Reabre el intento de una sola persona: reiniciarFila(5) */
function reiniciarFila(fila){
  abrirHoja().getRange(fila, 3, 1, 3).clearContent();
  Logger.log('Fila ' + fila + ' reiniciada.');
}
