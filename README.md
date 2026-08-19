[README.md](https://github.com/user-attachments/files/31226490/README.md)
# HTML desde cero — módulo interactivo evaluado

Guía interactiva de HTML para estudiantes universitarios, pensada para incrustarse en un LMS.
Incluye editores de código en vivo, glosario buscable, modo "rayos X" y una evaluación final
de 12 preguntas que se registra automáticamente en una planilla de Google.

---

## Estructura

```
index.html              Contenido del módulo
css/estilos.css         Todos los estilos, incluida la hoja de impresión
js/config.js            ← LO ÚNICO QUE DEBES EDITAR
js/datos.js             Glosario (38 etiquetas) y banco de 12 preguntas
js/api.js               Conexión con el Web App de Apps Script
js/acceso.js            Pantalla de identificación del estudiante
js/contenido.js         Editores en vivo, rayos X, glosario, índice, PDF
js/evaluacion.js        Evaluación, cálculo de nota y envío
apps-script/Codigo.gs   Web App que lee la lista y escribe las notas
```

---

## Puesta en marcha

### 1. Publicar el Web App

1. Abre la planilla → **Extensiones › Apps Script**.
2. Pega el contenido de `apps-script/Codigo.gs`.
3. **Implementar › Nueva implementación › Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza y copia la URL que termina en `/exec`.
5. Comprueba que funciona abriendo `TU_URL/exec?accion=lista` en el navegador:
   debe devolver el listado en JSON.

### 2. Configurar el sitio

En `js/config.js`, pega la URL:

```js
API: 'https://script.google.com/macros/s/AKfy.../exec',
```

### 3. Publicar en GitHub Pages

1. Crea el repositorio y sube todos los archivos.
2. **Settings › Pages › Branch: main / (root)**.
3. La URL queda como `https://usuario.github.io/repositorio/`.

### 4. Incrustar en el LMS

```html
<iframe src="https://usuario.github.io/repositorio/"
        width="100%" height="900" style="border:0"
        title="Guía interactiva de HTML"></iframe>
```

> Si el LMS bloquea el `localStorage` dentro de iframes de terceros, el bloqueo de reintentos
> del lado del navegador deja de funcionar, pero el de la planilla sigue activo. Ver más abajo.

---

## Cómo funciona la evaluación

| Elemento | Comportamiento |
|---|---|
| Preguntas | 12, de alternativas, con retroalimentación inmediata |
| Escala | 1,0 a 7,0 con 60% de exigencia (`CONFIG.EXIGENCIA`) |
| Aprobación | 8 de 12 correctas → 4,5 · 7 correctas → 3,9 |
| Intentos | Uno solo. Se bloquea en el navegador **y** en la planilla |
| Registro | Columna C `8/12`, columna D `4.5`, columna E fecha y hora |

Si necesitas reabrir un intento, en el editor de Apps Script ejecuta `reiniciarFila(5)`
para una persona o `reiniciarTodasLasNotas()` para el curso completo.

### Ajustes rápidos en `js/config.js`

- `EXIGENCIA: 0.6` → cambia el porcentaje necesario para el 4,0.
- `BARAJAR_PREGUNTAS: true` → cada estudiante recibe otro orden.
- `MOSTRAR_REVISION: false` → oculta el detalle de aciertos y errores al terminar.

---

## Descarga en PDF

El botón **Descargar PDF** abre el diálogo de impresión del navegador con una hoja de estilos
específica: se ocultan la barra, el índice y la evaluación, y el código de cada editor se
imprime como texto legible. Se recomienda elegir "Guardar como PDF" y activar
*Gráficos de fondo* para conservar los colores.

---

## Dos advertencias honestas

**1. No hay autenticación.** Cualquiera que abra el enlace puede elegir cualquier nombre de la
lista. Es suficiente para un curso donde la confianza no está en discusión, pero no es un
sistema de examen seguro. Si necesitas más control, las opciones son:

- Agregar una columna con un código personal en la planilla y pedirlo en la pantalla de acceso.
- Publicar el módulo detrás del inicio de sesión del LMS y usar su identificación.

**2. El bloqueo de un solo intento tiene dos capas.** El `localStorage` del navegador es la
primera y se puede saltar borrando datos o usando modo incógnito. La segunda —la que manda—
es la planilla: si las columnas C y D ya tienen contenido, el Web App rechaza el nuevo envío
y no sobrescribe la nota original.

---

## Créditos

Contenido y desarrollo del módulo para uso docente. Las tipografías provienen de Google Fonts;
si el módulo debe funcionar sin conexión, descarga las fuentes y ajusta el `<link>` de
`index.html`.
