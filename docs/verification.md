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
