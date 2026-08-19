/* ============================================================
   DATOS.JS — glosario de etiquetas y banco de preguntas
   ============================================================ */

var ETIQUETAS = [
  {e:'<h1> … <h6>', g:'texto', d:'Títulos y subtítulos, en seis niveles de jerarquía.'},
  {e:'<p>', g:'texto', d:'Párrafo de texto corrido.'},
  {e:'<br>', g:'texto', d:'Salto de línea. No se cierra.'},
  {e:'<hr>', g:'texto', d:'Línea divisoria entre temas. No se cierra.'},
  {e:'<strong>', g:'texto', d:'Contenido importante. Se ve en negrita y los lectores de pantalla lo enfatizan.'},
  {e:'<b>', g:'texto', d:'Negrita puramente visual, sin significado añadido.'},
  {e:'<em>', g:'texto', d:'Énfasis. Se ve en cursiva y cambia la entonación al ser leído.'},
  {e:'<i>', g:'texto', d:'Cursiva visual: nombres científicos, palabras en otro idioma.'},
  {e:'<span>', g:'texto', d:'Marca un trozo de texto dentro de una línea. Neutro por sí solo.'},
  {e:'<mark>', g:'texto', d:'Resalta texto, como con destacador.'},
  {e:'<blockquote>', g:'texto', d:'Cita textual larga, en bloque aparte.'},
  {e:'<code>', g:'texto', d:'Fragmento de código, en tipografía monoespaciada.'},
  {e:'<div>', g:'caja', d:'Caja genérica para agrupar elementos. Sin significado propio.'},
  {e:'<header>', g:'caja', d:'Encabezado de la página o de una sección.'},
  {e:'<nav>', g:'caja', d:'Bloque de navegación: menús e índices.'},
  {e:'<main>', g:'caja', d:'Contenido principal. Solo uno por página.'},
  {e:'<section>', g:'caja', d:'Bloque temático dentro del contenido.'},
  {e:'<article>', g:'caja', d:'Contenido que tiene sentido por sí solo: una noticia, un post.'},
  {e:'<aside>', g:'caja', d:'Contenido lateral o complementario.'},
  {e:'<footer>', g:'caja', d:'Pie de página: contacto, créditos, avisos legales.'},
  {e:'<ul>', g:'caja', d:'Lista sin orden, con viñetas.'},
  {e:'<ol>', g:'caja', d:'Lista ordenada, numerada.'},
  {e:'<li>', g:'caja', d:'Cada ítem dentro de una lista.'},
  {e:'<table>', g:'caja', d:'Tabla de datos con filas y columnas.'},
  {e:'<tr>', g:'caja', d:'Una fila de la tabla.'},
  {e:'<td>', g:'caja', d:'Una celda de datos.'},
  {e:'<th>', g:'caja', d:'Celda de encabezado de fila o columna.'},
  {e:'<a>', g:'medio', d:'Enlace. Necesita el atributo href con el destino.'},
  {e:'<img>', g:'medio', d:'Imagen. Necesita src y alt. No se cierra.'},
  {e:'<video>', g:'medio', d:'Reproductor de video incrustado.'},
  {e:'<audio>', g:'medio', d:'Reproductor de audio incrustado.'},
  {e:'<iframe>', g:'medio', d:'Incrusta otra página dentro de la tuya: un mapa, un video de YouTube.'},
  {e:'<head>', g:'caja', d:'Ficha técnica del documento. No se ve en la página.'},
  {e:'<body>', g:'caja', d:'Todo el contenido visible.'},
  {e:'<title>', g:'texto', d:'Título de la pestaña del navegador. Va dentro del head.'},
  {e:'<meta>', g:'caja', d:'Datos sobre el documento: codificación, descripción, autor.'},
  {e:'<link>', g:'caja', d:'Conecta un archivo externo, casi siempre una hoja CSS.'},
  {e:'<style>', g:'caja', d:'Estilos CSS escritos dentro del propio archivo HTML.'}
];

/* ------------------------------------------------------------
   Banco de preguntas de la evaluación final (12 preguntas).
   p = pregunta · o = opciones · c = índice de la correcta (0-3)
   e = explicación que se muestra tras responder
   s = sección de repaso
   ------------------------------------------------------------ */
var PREGUNTAS = [
  {p:'¿Qué significa la "M" de HTML?',
   o:['Multimedia','Markup (marcado)','Model','Mapping'], c:1,
   e:'HyperText Markup Language: un lenguaje de marcado, no de programación.', s:'1'},

  {p:'¿Cuál de estas etiquetas indica que un texto es importante, y no solo que va en negrita?',
   o:['&lt;b&gt;','&lt;strong&gt;','&lt;span&gt;','&lt;em&gt;'], c:1,
   e:'&lt;strong&gt; aporta significado; &lt;b&gt; solo cambia la apariencia.', s:'5'},

  {p:'¿Dónde va el contenido que el usuario ve en la página?',
   o:['Dentro de &lt;head&gt;','Dentro de &lt;title&gt;','Dentro de &lt;body&gt;','Dentro de &lt;meta&gt;'], c:2,
   e:'El &lt;head&gt; guarda información técnica; el &lt;body&gt; guarda lo visible.', s:'3'},

  {p:'¿Cuál de estos elementos es de bloque?',
   o:['&lt;span&gt;','&lt;a&gt;','&lt;strong&gt;','&lt;p&gt;'], c:3,
   e:'El &lt;p&gt; ocupa todo el ancho disponible y empuja lo siguiente hacia abajo.', s:'6'},

  {p:'¿Qué atributo describe una imagen en palabras?',
   o:['src','alt','href','title'], c:1,
   e:'El alt es lo que se lee si la imagen no carga o si el usuario usa lector de pantalla.', s:'8'},

  {p:'¿Cuál está bien anidado?',
   o:['&lt;p&gt;Hola &lt;b&gt;a todos&lt;/p&gt;&lt;/b&gt;','&lt;p&gt;Hola &lt;b&gt;a todos&lt;/b&gt;&lt;/p&gt;','&lt;b&gt;&lt;p&gt;Hola&lt;/b&gt;&lt;/p&gt;','&lt;p&gt;&lt;b&gt;Hola&lt;/p&gt;'], c:1,
   e:'Lo último que se abre es lo primero que se cierra.', s:'2'},

  {p:'Un &lt;div&gt; y un &lt;section&gt; se ven igual en pantalla. ¿Cuál es la diferencia?',
   o:['El &lt;section&gt; tiene más margen','El &lt;div&gt; no funciona en móviles','El &lt;section&gt; declara que ahí hay un bloque temático','Ninguna, son sinónimos'], c:2,
   e:'La diferencia es semántica: importa para buscadores, lectores de pantalla y para quien lea tu código.', s:'7'},

  {p:'¿Cuál de estas etiquetas NO necesita cierre?',
   o:['&lt;p&gt;','&lt;img&gt;','&lt;div&gt;','&lt;li&gt;'], c:1,
   e:'&lt;img&gt;, &lt;br&gt; y &lt;hr&gt; son elementos vacíos: no envuelven contenido.', s:'2'},

  {p:'¿Qué atributo del enlace indica hacia dónde lleva?',
   o:['src','link','href','target'], c:2,
   e:'href guarda el destino. target solo decide si se abre en otra pestaña.', s:'8'},

  {p:'En una tabla, ¿qué construye la etiqueta &lt;tr&gt;?',
   o:['Una fila','Una columna','Una celda','El encabezado'], c:0,
   e:'table row: una fila. Las celdas van dentro con &lt;td&gt; o &lt;th&gt;.', s:'9'},

  {p:'¿Cuál es la diferencia entre class e id?',
   o:['El id se puede repetir y la class no','La class se puede repetir y el id debe ser único','Son lo mismo con otro nombre','La class solo funciona con JavaScript'], c:1,
   e:'Muchos elementos pueden compartir una class; un id identifica a uno solo en toda la página.', s:'10'},

  {p:'Escribes una página sin &lt;meta charset="UTF-8"&gt;. ¿Qué es lo más probable que ocurra?',
   o:['La página no carga','Los acentos y las eñes se ven como símbolos raros','Se pierde el CSS','Las imágenes no aparecen'], c:1,
   e:'Sin declarar la codificación, el navegador adivina y en español suele equivocarse.', s:'3'}
];
