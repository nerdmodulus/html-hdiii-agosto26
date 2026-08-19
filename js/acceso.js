/* ============================================================
   ACCESO.JS — identificación del estudiante antes de entrar
   ============================================================ */

var SESION = {
  fila: null,
  nombre: '',
  apellido: '',
  invitado: true,
  rendido: false,
  notaPrevia: null
};

(function(){
  "use strict";

  var pantalla   = document.getElementById('acceso');
  var lista      = document.getElementById('listaEstudiantes');
  var filtro     = document.getElementById('filtroEstudiante');
  var botonEntra = document.getElementById('entrar');
  var botonVisita= document.getElementById('entrarInvitado');
  var eco        = document.getElementById('accesoEco');
  var credencial = document.getElementById('credencial');

  var ESTUDIANTES = [];

  function decir(texto, esError){
    eco.textContent = texto;
    eco.classList.toggle('error', !!esError);
  }

  function nombreCompleto(e){
    return (e.apellido + ', ' + e.nombre).trim().replace(/^, |, $/,'');
  }

  /* ---------- Pintar el desplegable ---------- */
  function pintarLista(texto){
    var busca = (texto || '').trim().toLowerCase();
    lista.innerHTML = '';

    var inicial = document.createElement('option');
    inicial.value = '';
    inicial.textContent = 'Selecciona tu nombre...';
    lista.appendChild(inicial);

    var mostrados = 0;
    ESTUDIANTES.forEach(function(e){
      if(busca && nombreCompleto(e).toLowerCase().indexOf(busca) === -1) return;
      var op = document.createElement('option');
      op.value = e.fila;
      op.textContent = nombreCompleto(e) + (e.rendido ? '  ·  ya rindió' : '');
      lista.appendChild(op);
      mostrados++;
    });

    if(mostrados === 0){
      inicial.textContent = 'Sin coincidencias';
      decir('Ningún nombre coincide con "' + texto + '".', true);
    } else if(busca){
      decir(mostrados + (mostrados === 1 ? ' coincidencia.' : ' coincidencias.'));
    } else {
      decir(ESTUDIANTES.length + ' estudiantes en la lista del curso.');
    }
    botonEntra.disabled = true;
  }

  /* ---------- Cargar desde la planilla ---------- */
  function cargar(){
    if(!API.activa()){
      decir('Sin conexión a la planilla: solo disponible el modo invitado.', true);
      lista.innerHTML = '<option value="">No disponible</option>';
      return;
    }
    API.listaEstudiantes()
      .then(function(datos){
        ESTUDIANTES = datos;
        if(!ESTUDIANTES.length){
          decir('La planilla está vacía o no se pudo leer la hoja.', true);
          return;
        }
        filtro.disabled = false;
        lista.disabled = false;
        pintarLista('');
      })
      .catch(function(err){
        decir('No se pudo cargar la lista: ' + err.message + ' Puedes entrar como invitado.', true);
        lista.innerHTML = '<option value="">No disponible</option>';
      });
  }

  /* ---------- Interacción ---------- */
  filtro.addEventListener('input', function(){ pintarLista(filtro.value); });

  lista.addEventListener('change', function(){
    var fila = lista.value;
    botonEntra.disabled = !fila;
    if(!fila) return;
    var e = ESTUDIANTES.filter(function(x){ return String(x.fila) === String(fila); })[0];
    if(e && e.rendido){
      decir('Ya rendiste la evaluación (nota ' + formatoNota(e.nota || 0) + '). Puedes entrar a consultar el contenido.');
    } else {
      decir('Listo, ' + e.nombre + '. Tu evaluación aún está pendiente.');
    }
  });

  botonEntra.addEventListener('click', function(){
    var e = ESTUDIANTES.filter(function(x){ return String(x.fila) === String(lista.value); })[0];
    if(!e) return;
    SESION = {
      fila: e.fila,
      nombre: e.nombre,
      apellido: e.apellido,
      invitado: false,
      rendido: !!e.rendido,
      notaPrevia: e.nota || null
    };
    entrar();
  });

  botonVisita.addEventListener('click', function(){
    SESION.invitado = true;
    entrar();
  });

  /* ---------- Abrir el módulo ---------- */
  function entrar(){
    pantalla.hidden = true;
    document.body.classList.remove('sin-acceso');
    credencial.hidden = false;
    if(SESION.invitado){
      credencial.textContent = 'Modo invitado';
      credencial.classList.add('invitado');
    } else {
      credencial.textContent = SESION.nombre + ' ' + SESION.apellido;
    }
    document.dispatchEvent(new CustomEvent('sesion-lista'));
    window.scrollTo(0, 0);
  }

  cargar();
})();
