/* ============================================================
   API.JS — puente entre la página y la planilla de Google
   ============================================================
   Todo pasa por el Web App de Apps Script (CONFIG.API).
   Se intenta primero con fetch; si el navegador bloquea la
   petición por CORS, se recurre a JSONP, que siempre funciona.
   ============================================================ */

var API = (function(){
  "use strict";

  function activa(){
    return typeof CONFIG.API === 'string' && CONFIG.API.indexOf('http') === 0;
  }

  /* ---------- JSONP: plan B a prueba de CORS ---------- */
  function jsonp(parametros){
    return new Promise(function(resolver, rechazar){
      var nombre = 'cb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
      var etiqueta = document.createElement('script');
      var reloj = setTimeout(function(){
        limpiar();
        rechazar(new Error('La planilla no respondió a tiempo.'));
      }, 15000);

      function limpiar(){
        clearTimeout(reloj);
        delete window[nombre];
        if(etiqueta.parentNode) etiqueta.parentNode.removeChild(etiqueta);
      }

      window[nombre] = function(datos){ limpiar(); resolver(datos); };

      parametros.callback = nombre;
      etiqueta.src = CONFIG.API + '?' + new URLSearchParams(parametros).toString();
      etiqueta.onerror = function(){ limpiar(); rechazar(new Error('No se pudo contactar la planilla.')); };
      document.body.appendChild(etiqueta);
    });
  }

  function pedir(parametros){
    var url = CONFIG.API + '?' + new URLSearchParams(parametros).toString();
    return fetch(url, {method:'GET', redirect:'follow'})
      .then(function(r){ return r.json(); })
      .catch(function(){ return jsonp(parametros); });
  }

  /* ---------- Lista de estudiantes ---------- */
  function listaEstudiantes(){
    if(!activa()) return Promise.reject(new Error('sin_api'));
    return pedir({accion:'lista'}).then(function(r){
      if(!r || !r.ok) throw new Error(r && r.mensaje ? r.mensaje : 'Respuesta inválida.');
      return r.estudiantes || [];
    });
  }

  /* ---------- Envío del resultado ---------- */
  function enviarResultado(datos){
    if(!activa()) return Promise.reject(new Error('sin_api'));
    var cuerpo = JSON.stringify(datos);

    /* text/plain evita la petición preflight de CORS */
    return fetch(CONFIG.API, {
      method: 'POST',
      redirect: 'follow',
      headers: {'Content-Type':'text/plain;charset=utf-8'},
      body: cuerpo
    })
      .then(function(r){ return r.json(); })
      .catch(function(){
        /* Plan B: enviar sin poder leer la respuesta.
           La planilla igual registra la nota. */
        return fetch(CONFIG.API, {
          method: 'POST',
          mode: 'no-cors',
          headers: {'Content-Type':'text/plain;charset=utf-8'},
          body: cuerpo
        }).then(function(){
          return {ok:true, ciego:true};
        });
      });
  }

  return {
    activa: activa,
    listaEstudiantes: listaEstudiantes,
    enviarResultado: enviarResultado
  };
})();
