/* ============================================================
   CONTENIDO.JS — editores en vivo, rayos X, glosario, índice, PDF
   ============================================================ */

(function(){
  "use strict";

  /* ---------- 1. Editores en vivo ---------- */
  var BASE = '<!DOCTYPE html><meta charset="utf-8"><style>'
    + 'body{font-family:Georgia,"Times New Roman",serif;margin:14px;color:#16181D;font-size:15px;line-height:1.5}'
    + 'h1{font-size:1.7em}h2{font-size:1.35em}table{border-collapse:collapse}td,th{padding:5px 9px}'
    + 'img{max-width:100%}</style>';

  function pintar(area, marco){
    marco.srcdoc = BASE + area.value;
  }

  document.querySelectorAll('[data-lab]').forEach(function(lab){
    var area = lab.querySelector('textarea');
    var marco = lab.querySelector('iframe');
    var reinicio = lab.querySelector('.lab-reiniciar');
    var original = area.value;
    var espera;

    pintar(area, marco);
    area.addEventListener('input', function(){
      clearTimeout(espera);
      espera = setTimeout(function(){ pintar(area, marco); }, 180);
    });
    reinicio.addEventListener('click', function(){
      area.value = original;
      pintar(area, marco);
      area.focus();
    });
    /* Tab dentro del editor inserta dos espacios en vez de saltar de campo */
    area.addEventListener('keydown', function(e){
      if(e.key === 'Tab'){
        e.preventDefault();
        var i = area.selectionStart, f = area.selectionEnd;
        area.value = area.value.slice(0,i) + '  ' + area.value.slice(f);
        area.selectionStart = area.selectionEnd = i + 2;
        pintar(area, marco);
      }
    });
  });

  /* ---------- 2. Modo rayos X ---------- */
  var CATEGORIA = {
    h1:'texto', h2:'texto', h3:'texto', h4:'texto', p:'texto', strong:'texto',
    em:'texto', b:'texto', i:'texto', span:'texto', code:'texto', pre:'texto',
    a:'medio', img:'medio', iframe:'medio',
    section:'caja', div:'caja', ul:'caja', ol:'caja', li:'caja', table:'caja',
    tr:'caja', td:'caja', th:'caja', main:'caja', nav:'caja', textarea:'caja',
    input:'caja', button:'caja'
  };
  var BLOQUES = ['section','div','p','h1','h2','h3','h4','ul','ol','li','table','pre','main'];

  var marcado = false;
  function marcar(){
    if(marcado) return;
    marcado = true;
    var raiz = document.querySelector('.contenido');
    raiz.querySelectorAll('*').forEach(function(el){
      var t = el.tagName.toLowerCase();
      if(!CATEGORIA[t]) return;
      if(el.closest('.lab-cabeza, .anatomia, .quiz-avance')) return;
      el.setAttribute('data-etq', t);
      el.setAttribute('data-cat', CATEGORIA[t]);
      if(BLOQUES.indexOf(t) > -1 && !el.closest('.tarjeta[style]')){
        el.setAttribute('data-bloque','si');
      }
    });
  }

  var botonRayos = document.getElementById('rayos');
  botonRayos.addEventListener('click', function(){
    var activo = document.body.classList.toggle('rayos');
    if(activo) marcar();
    botonRayos.setAttribute('aria-pressed', activo ? 'true' : 'false');
    botonRayos.textContent = activo ? 'Ocultar rayos X' : 'Ver rayos X';
  });

  /* ---------- 3. Demo bloque / en línea ---------- */
  var demo = document.getElementById('demoFlujo');
  var nota = document.getElementById('notaFlujo');
  var TEXTOS = {
    bloque:'Tres elementos de bloque: cada uno reclama su propia fila.',
    inline:'Los mismos tres, en línea: caben juntos en la misma fila.'
  };
  document.querySelectorAll('[data-flujo]').forEach(function(b){
    b.addEventListener('click', function(){
      var modo = b.dataset.flujo;
      document.querySelectorAll('[data-flujo]').forEach(function(o){
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      demo.querySelectorAll('.caja-demo').forEach(function(c){
        c.classList.toggle('inline', modo === 'inline');
      });
      nota.textContent = TEXTOS[modo];
    });
  });

  /* ---------- 4. Glosario ---------- */
  var contenedor = document.getElementById('glosario');
  var vacio = document.getElementById('sinResultados');
  var buscador = document.getElementById('buscador');
  var filtroActivo = 'todo';

  ETIQUETAS.forEach(function(x){
    var caja = document.createElement('div');
    caja.className = 'etq';
    caja.setAttribute('data-grupo', x.g);
    var c = document.createElement('code');
    c.textContent = x.e;
    var p = document.createElement('p');
    p.textContent = x.d;
    caja.appendChild(c);
    caja.appendChild(p);
    caja.dataset.busca = (x.e + ' ' + x.d).toLowerCase();
    contenedor.appendChild(caja);
  });

  function filtrar(){
    var texto = buscador.value.trim().toLowerCase();
    var visibles = 0;
    contenedor.querySelectorAll('.etq').forEach(function(caja){
      var okGrupo = filtroActivo === 'todo' || caja.dataset.grupo === filtroActivo;
      var okTexto = !texto || caja.dataset.busca.indexOf(texto) > -1;
      var ver = okGrupo && okTexto;
      caja.hidden = !ver;
      if(ver) visibles++;
    });
    vacio.hidden = visibles > 0;
  }

  buscador.addEventListener('input', filtrar);
  document.querySelectorAll('[data-filtro]').forEach(function(b){
    b.addEventListener('click', function(){
      filtroActivo = b.dataset.filtro;
      document.querySelectorAll('[data-filtro]').forEach(function(o){
        o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
      });
      filtrar();
    });
  });

  /* ---------- 5. Índice activo y barra de avance ---------- */
  var enlaces = Array.prototype.slice.call(document.querySelectorAll('.indice a'));
  var secciones = enlaces.map(function(a){ return document.querySelector(a.getAttribute('href')); });

  if('IntersectionObserver' in window){
    var obs = new IntersectionObserver(function(entradas){
      entradas.forEach(function(en){
        if(!en.isIntersecting) return;
        var i = secciones.indexOf(en.target);
        enlaces.forEach(function(a, j){ a.classList.toggle('activo', i === j); });
      });
    }, {rootMargin:'-100px 0px -65% 0px'});
    secciones.forEach(function(s){ if(s) obs.observe(s); });
  }

  var barra = document.getElementById('progreso');
  window.addEventListener('scroll', function(){
    var alto = document.documentElement.scrollHeight - window.innerHeight;
    barra.style.width = (alto > 0 ? (window.scrollY / alto) * 100 : 0) + '%';
  }, {passive:true});

  /* ---------- 6. Preparar la versión imprimible / PDF ---------- */
  function prepararImpresion(){
    document.querySelectorAll('[data-lab]').forEach(function(lab){
      var area = lab.querySelector('textarea');
      var copia = lab.querySelector('.impresion-codigo');
      if(!copia){
        copia = document.createElement('pre');
        copia.className = 'impresion-codigo';
        lab.querySelector('.lab-cuerpo').appendChild(copia);
      }
      copia.textContent = area.value;
    });
    /* En papel conviene ver el glosario completo, sin filtros */
    document.querySelectorAll('#glosario .etq').forEach(function(c){ c.hidden = false; });
  }

  window.addEventListener('beforeprint', prepararImpresion);

  var botonPDF = document.getElementById('descargar');
  if(botonPDF){
    botonPDF.addEventListener('click', function(){
      prepararImpresion();
      if(document.body.classList.contains('rayos')) document.getElementById('rayos').click();
      setTimeout(function(){ window.print(); }, 120);
    });
  }

})();
