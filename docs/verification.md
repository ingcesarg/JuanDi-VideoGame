# Verificación del prototipo

Fecha: 9 de octubre de 2026. Cambio: `first-playable-prototype`.

## Comprobaciones automáticas

`npm test`: 15 pruebas aprobadas. Se verifican ventaja de dos a 15 y en sets extendidos, atribución de puntos, cuarto contacto, bloqueo, inventario, premios únicos, mejoras persistentes, golpes fuera de alcance, dirección de saque/remate, colisión con red, trayectoria balística, pausa, cambio de jugador, reinicio y devolución rival.

Una prueba de integración ejecuta movimiento y acción contextual durante una partida completa con aleatoriedad reproducible, llega a resultados y comprueba que el marcador final ya no cambia. En la simulación usada para ajustar balance, GOCA terminó 15–0 con 24 remates dirigidos a espacios y 4 puntos de colocación premiados; esto no es una medida de dificultad para un jugador humano.

`npm run build`: construcción de producción correcta. `git diff --check` y `openspec validate first-playable-prototype --strict`: sin errores.

## Comprobaciones en Chrome

- Inicio, instrucciones en español y presentación de cancha, cuatro jugadores, red, marcador e inventario.
- Saque humano con Espacio, desplazamiento mediante flechas, cambio entre Leo y Vale con Tab y respuesta de los rivales.
- Preparación de dos poderes consecutivos, selección con Q y aviso al intentar un tercer uso con inventario vacío, conservando las dos mejoras pendientes.
- Recogida de objetos reflejada en inventario, consumo de súper salto y persistencia de remate preparado durante varios puntos.
- Pausa con Escape y al sacar foco hacia la barra del navegador; reanudación explícita y guía que conserva el partido pausado.
- Set terminado en 0–15: pantalla de resultado, estadísticas, consejo y botón de revancha.
- Revancha: marcador 0–0, saque GOCA, posiciones e inventario inicial restablecidos; selección de jugador y poderes vuelven a funcionar.

## Límites y próxima prueba

La automatización nativa del navegador no admite mantener flecha y Espacio simultáneamente; el apuntado y el bloqueo se comprobaron en pruebas de simulación. Su precisión y comodidad con teclado real deben probarse con Juan Diego y su papá siguiendo `docs/playtest.md`. Tampoco se ha probado en otros navegadores ni se afirma validación con la familia.

Las teclas, tolerancia, velocidad y errores rivales, frecuencia de objetos y balance son provisionales. Los intercambios demasiado largos observados en una simulación inicial se mitigaron con velocidad rival diferenciada y errores por trayectoria, ajustables en `src/config.js`. El arte es provisional y el alcance sigue siendo un jugador, 2 contra 2, un set y Principiante.

## Nueva entrega: match-clarity-and-control

Fecha: 10 de octubre de 2026. La evidencia anterior corresponde al prototipo inicial, no valida esta entrega.

`npm test`: 36 pruebas aprobadas (15 regresiones originales y 21 nuevas). Cubren responsabilidad humana de primera recepción y tercer contacto frente a Tab, armado asistido, entradas discretas, pausa idempotente y restauración del reloj, seis destinos normales/potentes, ralentización uniforme, confirmación y expiración, cancelación sin consumo ni reapertura, recogida exclusiva del activo, inventario y diferencias físicas entre poderes. Son pruebas de simulación e input con entorno controlado, no una prueba familiar.

`npm run build`: construcción correcta. `git diff --check`: sin errores. `openspec validate match-clarity-and-control --strict`: change válido. El cruce de contratos con el prototipo está documentado en `docs/match-clarity-contracts.md`; no se han sincronizado SPECs ni archivado cambios.

Chrome permitió inspeccionar la presentación de la interfaz nueva: disponibles/preparados separados, contexto de acción y avisos. La comprobación completa con teclado real sigue pendiente: la herramienta interrumpió dos intentos de navegación al detectar cambios externos en Chrome. No se atribuyen a esta versión los resultados de teclado del 9 de octubre. `dev/browser.html` ofrece casos reproducibles de ataque normal/potente, recepción y recogida, con registro visible de trayectoria; esa página no forma parte de la compilación de producción.

Pendientes: tarea 6.2 (seis zonas, poderes, objetos, Tab y pausa en Chrome), tarea 6.5 (prueba con Juan Diego y su papá según `docs/playtest.md`) y tarea 6.6 (ajustes y repetición a partir de sus comentarios). El balance permanece provisional y el change sigue abierto.

### Confirmación posterior del usuario

El usuario informó: «Las pruebas realizadas son exitosas. Podemos continuar con el plan». Se registra como validación reportada por el usuario para las comprobaciones pendientes de navegador y juego familiar; no como ejecución de la automatización ni como testimonio individual de Juan Diego o su papá. No se proporcionaron métricas, ayudas necesarias ni comentarios por escenario.

Se cierran las tareas 6.2 y 6.5 con esa confirmación. Para 6.6 no se requieren ajustes según el resultado comunicado; se conservan los parámetros y no hay escenarios afectados que repetir. El registro anterior de pendientes queda como evidencia histórica. Las 26 tareas quedan completas; la sincronización de SPECs y el archivo siguen siendo un paso posterior.

### Reconciliación y archivo

El 10 de octubre de 2026, por autorización del usuario, se sincronizaron las ocho capacidades de ambos changes a `openspec/specs`. Los contratos de `volleyball-controls`, `match-powers` y `prototype-match` incorporan los refinamientos posteriores de responsabilidad humana, apuntado, recogida y pausa; los artefactos históricos se conservan sin reescribir.

Ambos changes se archivaron con prefijo `2026-10-10-` en `openspec/changes/archive`. Validación estricta de las ocho SPECs: 8 aprobadas, 0 fallidas. No se modificó código del juego en este paso.

## Progresión local y tienda

Change: `local-progression-and-power-shop`. 43 pruebas automáticas aprobadas, incluidas siete nuevas de progreso, ciclo victoria-compra-recarga-transferencia, premio idempotente, derrota, compra bloqueada durante partido/pausa, saldo insuficiente y almacenamiento corrupto o rechazado. Build y validación estricta del change correctos.

En Edge se comprobó la interfaz real de inicio: saldo cero, reserva cero, precios 5, rechazo por saldo insuficiente, recarga y comienzo con dos disponibles por tipo. La tienda no se muestra en juego.

En `dev/progression.html`, fixture que usa motor y módulo de progreso reales con clave de almacenamiento aislada, se verificó: victoria → saldo 10; comprar salto → saldo 5/reserva 1; recarga → saldo 5/reserva 1; iniciar → tres saltos disponibles/reserva cero/preparados cero; siguiente inicio → dos saltos, sin transferencia repetida. No equivale a ganar un partido manual ni a comprobar visualmente la pantalla completa de resultados tras una victoria jugada.

Pendiente: feedback humano sobre claridad y economía de esta versión (tarea 4.3). No se cambian precios a partir de feedback no recibido. El change permanece abierto.

### Confirmación de progresión

El usuario confirmó la prueba exitosa y pidió continuar. La tarea 4.3 queda completada con ese feedback general; no se atribuyen observaciones por escenario ni participantes. Se mantienen 10 créditos por victoria y 5 por uso. Progresión: 13/13 tareas completas.

## Dificultad Normal

Change: `normal-volleyball-difficulty`. 49 pruebas aprobadas; seis nuevas verifican perfiles/fallback/inmutabilidad, movimiento rival comparado, fallo reproducible con aleatoriedad 0,12 (Principiante falla y Normal recibe), ausencia de contactos fuera de alcance o recepción humana delegada, pausa, progresión y apuntado. Las regresiones de Principiante continúan pasando. Build, validación estricta OpenSpec y diff sin errores.

Chrome nativo: inicio por defecto Principiante, selector con opciones Principiante/Normal, explicación de Normal, comienzo 0–0 con etiqueta Normal, dos usos gratuitos de cada poder y pistas pequeñas visibles en cancha. La pantalla completa de resultados y el cambio de nivel previo a revancha no se verificaron manualmente en navegador; la separación de nivel del partido y creación siguiente se comprobó en pruebas del motor.

Pendiente tarea 3.3: prueba humana comparando dificultad y legibilidad. Los valores de Normal son provisionales; el change sigue abierto.

### Confirmación de dificultad

El usuario confirmó que se nota el cambio en dificultad y legibilidad. Normal completa 11/11 tareas. No comunicó incidencias ni solicitudes de ajuste; se conservan velocidad 3,8, fallo 0,08 y escala de pistas 0,6.

## Presentación y sonido

Change: `match-visual-and-audio-feedback`. 56 pruebas aprobadas, incluidas siete nuevas que verifican eventos acotados/únicos, golpes fallidos sin sonido, pausa/revancha, premios, preferencias independientes con datos corruptos, activación por gesto, ganancia limitada, silencio, descarte de backlog, rechazo de audio y pausa durante activación. Render normal/reducido no modifica el estado deportivo; comandos de dibujo reducidos se mantienen durante pausa. Build y validación estricta OpenSpec correctos.

Chrome nativo: interfaz de ajustes, silencio inicial, prueba explícita con indicador de reproducción de audio del navegador, volumen 30 → 31 %, casilla de movimiento reducido seleccionada y silencio con desaparición del indicador de audio. Se inspeccionó presentación del inicio en Principiante. No se evaluó perceptivamente el sonido.

La comprobación en partido no pudo completarse: la herramienta dejó de activar el botón de inicio y después reportó ausencia de ventana disponible. Permanecen pendientes 4.2 (ambos niveles y pausa/controles durante juego) y 4.3 (prueba humana de legibilidad, efectos y comodidad). No se atribuye a esta versión la aprobación previa de Normal.

### Confirmación de presentación y cierre del plan

El usuario confirmó «Vemos todo ok» y pidió continuar. Presentación completa 13/13 tareas con esa validación reportada; el límite de automatización anterior permanece como evidencia histórica. No se comunicaron incidencias ni ajustes perceptivos específicos.

Se consolidaron las especificaciones de progresión, dificultad y presentación en `openspec/specs`, conservando los requisitos anteriores ajenos al cambio. Los tres changes completos se archivaron con prefijo `2026-10-10-`; sus artefactos se conservan íntegros.

## Sonidos propios de poderes

A petición del usuario, súper salto usa barrido ascendente con capas square/sine y remate potente usa impacto descendente grave con capas sawtooth/triangle. Las acciones normales conservan sus sonidos. La ganancia se reparte entre capas y todas las fuentes se detienen al silenciar. Preparar con E conserva su sonido separado.

58 pruebas aprobadas, build correcto y 15 SPECs válidas. Las dos pruebas adicionales verifican evento al ejecutar poder frente a preparación, timbre/capas diferenciados, ganancia total y silencio. La distinción perceptiva final queda para escuchar en el juego; no se afirma una evaluación auditiva del agente.

### Revisión del remate potente

El usuario rechazó el impacto grave anterior. Se sustituyó por un golpe corto square (760 → 240 Hz, 90 ms) y un toque sine (1100 → 620 Hz, 70 ms, retraso 18 ms). Mantiene ganancia limitada, evento de ejecución y silencio. Súper salto conserva su efecto. La aceptación auditiva del sonido nuevo queda pendiente.

### Remate potente más agresivo

Tras rechazar el efecto agudo, el usuario solicitó un carácter agresivo. Se implementó un impacto con tres capas: pulso square descendente, estallido de ruido suavizado y cuerpo grave sine. Se mantiene la ganancia total limitada y la parada de todas las fuentes al silenciar. La prueba de audio comprueba que el remate potente incluye fuente de ruido. No se afirma aprobación auditiva del nuevo efecto.
