/* ============================================================
   EVALUACION.JS — 12 preguntas, una sola oportunidad, nota final
   ============================================================ */

(function(){
  "use strict";

  var inicio    = document.getElementById('quizInicio');
  var panel     = document.getElementById('quizPanel');
  var cierre    = document.getElementById('quizCierre');
  var elAvance  = document.getElementById('quizAvance');
  var elPregunta= document.getElementById('quizPregunta');
  var elOpciones= document.getElementById('quizOpciones');
  var elEco     = document.getElementById('quizEco');
  var elEstado  = document.getElementById('quizEstado');
  var elRevision= document.getElementById('quizRevision');
  var elInfo    = document.getElementById('quizInfoEscala');
  var botonIr   = document.getElementById('quizComenzar');
  var cifraOK   = document.getElementById('cifraCorrectas');
  var cifraNota = document.getElementById('cifraNota');

  var preguntas = PREGUNTAS.slice();
  var indice = 0, aciertos = 0, respuestas = [], bloqueado = false;

  /* ---------- utilidades ---------- */
  function llave(){ return 'guia-html:rendido:' + (SESION.fila || 'invitado'); }

  function yaRindio(){
    if(SESION.invitado) return false;
    if(SESION.rendido) return true;
    try { return localStorage.getItem(llave()) !== null; } catch(e){ return false; }
  }

  function sellar(nota, correctas){
    try {
      localStorage.setItem(llave(), JSON.stringify({nota:nota, correctas:correctas, fecha:new Date().toISOString()}));
    } catch(e){ /* navegación privada: el bloqueo real lo hace la planilla */ }
  }

  function mostrarBloque(cual){
    inicio.hidden = cual !== 'inicio';
    panel.hidden  = cual !== 'panel';
    cierre.hidden = cual !== 'cierre';
  }

  function barajar(a){
    for(var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ---------- estado inicial según quién entró ---------- */
  document.addEventListener('sesion-lista', function(){
    var minimo = Math.ceil(preguntas.length * CONFIG.EXIGENCIA);
    elInfo.innerHTML = 'Escala de 1,0 a 7,0 con ' + Math.round(CONFIG.EXIGENCIA * 100) +
      '% de exigencia: necesitas ' + minimo + ' respuestas correctas para un 4,0.';

    if(yaRindio()){
      mostrarBloque('cierre');
      var guardado = {};
      try { guardado = JSON.parse(localStorage.getItem(llave())) || {}; } catch(e){}
      var nota = SESION.notaPrevia || guardado.nota;
      var buenas = guardado.correctas;
      cifraOK.textContent = (buenas !== undefined && buenas !== null) ? buenas : '—';
      cifraNota.textContent = nota ? formatoNota(nota) : '—';
      pintarSemaforo(nota);
      elEstado.textContent = 'Ya rendiste esta evaluación. El registro está en la planilla del curso; el contenido del módulo sigue disponible para consulta.';
      elRevision.innerHTML = '';
      return;
    }

    if(SESION.invitado){
      elInfo.innerHTML += '<br>Estás en modo invitado: puedes responder para practicar, pero la nota no se registra.';
    }
    mostrarBloque('inicio');
  });

  /* ---------- comenzar ---------- */
  botonIr.addEventListener('click', function(){
    if(CONFIG.BARAJAR_PREGUNTAS) preguntas = barajar(preguntas);
    indice = 0; aciertos = 0; respuestas = [];
    mostrarBloque('panel');
    pintar();
    panel.scrollIntoView({behavior:'smooth', block:'center'});
  });

  /* ---------- una pregunta ---------- */
  function pintar(){
    var q = preguntas[indice];
    elAvance.textContent = 'Pregunta ' + (indice + 1) + ' de ' + preguntas.length;
    elPregunta.innerHTML = q.p;
    elEco.textContent = '';
    elOpciones.innerHTML = '';
    bloqueado = false;

    q.o.forEach(function(texto, i){
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = texto;
      b.addEventListener('click', function(){ responder(i, b, q); });
      elOpciones.appendChild(b);
    });
  }

  function responder(i, boton, q){
    if(bloqueado) return;
    bloqueado = true;

    var acerto = i === q.c;
    if(acerto) aciertos++;
    respuestas.push({pregunta:q.p, elegida:i, correcta:q.c, acerto:acerto, seccion:q.s});

    Array.prototype.forEach.call(elOpciones.children, function(b){ b.disabled = true; });
    boton.classList.add(acerto ? 'bien' : 'mal');
    if(!acerto) elOpciones.children[q.c].classList.add('bien');
    elEco.innerHTML = (acerto ? 'Correcto. ' : 'No era esa. ') + q.e;

    setTimeout(function(){
      indice++;
      if(indice < preguntas.length){ pintar(); }
      else { terminar(); }
    }, CONFIG.SEGUNDOS_RETROALIMENTACION * 1000);
  }

  /* ---------- resultado ---------- */
  function pintarSemaforo(nota){
    var caja = cifraNota.parentElement;
    caja.classList.remove('aprobado','reprobado');
    if(!nota) return;
    caja.classList.add(nota >= CONFIG.NOTA_APROBACION ? 'aprobado' : 'reprobado');
  }

  function terminar(){
    var nota = calcularNota(aciertos, preguntas.length);
    mostrarBloque('cierre');
    cifraOK.textContent = aciertos + ' / ' + preguntas.length;
    cifraNota.textContent = formatoNota(nota);
    pintarSemaforo(nota);
    revisar();
    sellar(nota, aciertos);
    cierre.scrollIntoView({behavior:'smooth', block:'center'});

    if(SESION.invitado){
      elEstado.textContent = 'Modo invitado: este resultado no se registró en la planilla.';
      return;
    }
    enviar(nota);
  }

  function revisar(){
    if(!CONFIG.MOSTRAR_REVISION){ elRevision.innerHTML = ''; return; }
    elRevision.innerHTML = '<h4>Revisión</h4>';
    respuestas.forEach(function(r, i){
      var fila = document.createElement('div');
      fila.className = 'rev-item ' + (r.acerto ? 'ok' : 'no');
      fila.innerHTML = '<span class="rev-marca">' + (i + 1) + (r.acerto ? ' ✓' : ' ✗') + '</span>' + r.pregunta +
        (r.acerto ? '' : '<span class="rev-detalle">Repasa la sección ' + r.seccion + '.</span>');
      elRevision.appendChild(fila);
    });
  }

  /* ---------- envío a la planilla ---------- */
  function enviar(nota){
    elEstado.innerHTML = '<span class="enviando">Registrando tu nota...</span>';

    API.enviarResultado({
      accion: 'guardar',
      fila: SESION.fila,
      nombre: SESION.nombre,
      apellido: SESION.apellido,
      correctas: aciertos,
      total: preguntas.length,
      nota: nota
    })
    .then(function(r){
      if(r && r.ok){
        elEstado.textContent = r.ciego
          ? 'Resultado enviado a la planilla del curso.'
          : 'Nota registrada en la planilla del curso. ' + (r.mensaje || '');
      } else if(r && r.motivo === 'ya_rendido'){
        elEstado.textContent = 'La planilla ya tenía una nota registrada para ti, así que este intento no se guardó.';
      } else {
        fallo(nota, (r && r.mensaje) || 'La planilla rechazó el registro.');
      }
    })
    .catch(function(err){
      fallo(nota, err.message === 'sin_api' ? 'No hay conexión configurada con la planilla.' : err.message);
    });
  }

  function fallo(nota, mensaje){
    elEstado.innerHTML = 'No se pudo registrar la nota: ' + mensaje + ' ';
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'lab-reiniciar';
    b.style.cssText = 'border-color:var(--tinta);color:var(--tinta)';
    b.textContent = 'Reintentar envío';
    b.addEventListener('click', function(){ enviar(nota); });
    elEstado.appendChild(b);
  }

})();
