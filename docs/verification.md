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
