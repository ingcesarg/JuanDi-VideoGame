# JuanDiVoley · Claridad y control

Ayuda al Club GOCA a recuperar su gloria, empezando en una cancha de barrio. Este primer prototipo para computador permite jugar **2 contra 2 contra la máquina**, en dificultad Principiante, un set a 15 y con dos puntos de ventaja.

## Ejecutar

Necesitas Node.js 22.12 o posterior y npm.

```bash
npm install
npm run dev
```

Abre la URL que imprime Vite, normalmente http://127.0.0.1:5173/. Pulsa **Entrar a la cancha**. El servidor solo escucha en la dirección local del computador.

```bash
npm test          # Pruebas de reglas, física, controles y poderes
npm run build    # Genera la aplicación estática en dist/
npm run preview  # Prueba esa construcción localmente
```

## Cómo jugar

| Tecla | Acción |
|---|---|
| Flechas | Mover; durante apuntado elegir una de seis zonas; dirigir el saque al golpear |
| Espacio | Acción contextual; en ataque abre apuntado y una nueva pulsación confirma |
| Tab | Cambiar entre Leo y Vale |
| Q | Elegir súper salto o remate potente |
| E | Preparar un uso del poder elegido |
| Escape | Pausar; el botón **Seguir jugando** reanuda |

La cancha necesita el foco del teclado: puedes hacer clic en ella para recuperarlo. Las teclas del juego solo se interceptan con la cancha enfocada. Abrir **Cómo jugar**, sacar el foco de la cancha, salir de la ventana o cambiar de pestaña pausa con motivo visible; volver no reanuda. Pulsa **Seguir jugando** con ratón o teclado: se limpia la entrada anterior y se conserva el apuntado, incluida zona y tiempo restante.

Observa el círculo claro de caída. Acércate y pulsa Espacio mientras baja la pelota; aparece una indicación si está a tu alcance. La recepción y el ataque siempre necesitan tu acción, aunque cambies varias veces con Tab. El compañero se mueve y solo puede golpear automáticamente el segundo contacto para armar; si lo seleccionas, debes pulsar Espacio también para ese contacto. La pantalla indica tu recepción, el armado y tu ataque. Durante apuntado Tab está bloqueado hasta concluir la acción.

En el saque conservas dirección con flechas al golpear. En el remate, pulsa Espacio cuando estés a alcance: el atacante queda quieto y la simulación se ralentiza durante un máximo provisional de dos segundos. Flechas izquierda/derecha eligen columna; arriba elige profunda y abajo corta. Hay seis zonas y por defecto centro profunda. Suelta Espacio y vuelve a pulsarlo para confirmar. Al vencer el plazo se intenta rematar al destino actual; si la pelota sale de alcance, se cancela y no se gasta el remate preparado. Solo se permite una ventana por oportunidad. Las zonas verdes muestran espacios alejados de los rivales. Cerca de la red, pulsar Espacio ante una pelota atacante alta inicia un salto de bloqueo; para rematar una pelota alta, acércate y pulsa al bajar. Hay una pequeña tolerancia de contacto, no un golpe automático por mantener Espacio.

Cada partido empieza con dos usos de cada poder. E descuenta uno y lo deja preparado hasta la próxima acción humana compatible: súper salto para saltar/bloquear y remate potente para rematar. Puedes preparar varios seguidos, sin espera ni caducidad; cada acción consume uno. El compañero no consume tus mejoras pendientes. Pasar con el jugador activo por el área de un objeto suma un disponible una sola vez (también saltando); el compañero no recoge. La recogida indica el poder y cómo seleccionarlo y prepararlo, sin activarlo. No se recoge durante pausa o apuntado. Recoger un objeto suma un uso y ganar un punto mediante remate a espacio libre suma un uso de remate potente. No se usan créditos ni compras en esta etapa.

## Adaptaciones del prototipo

- Dos jugadores por equipo, cancha y físicas ajustadas para controles sencillos.
- Máximo tres contactos; el bloqueo no cuenta. No se sanciona doble contacto individual ni se realiza rotación.
- El saque sale de la posición actual del jugador seleccionado, sin falta por posición de servicio.
- El ganador del punto sirve. Un balón fuera pierde el punto para el último equipo que lo tocó; tocar la red hace rebotar la pelota.
- Un 15–14 continúa; un 16–14 termina. No hay límite máximo de puntos ni cronómetro.
- Vista amplia fija, personajes inventados y arte provisional dibujado con Canvas.
- Resultados muestran remates a espacios libres, mejor racha y consejo. Revancha reinicia partido, inventario y estadísticas.

Son adaptaciones del juego, no las reglas completas del voleibol. Torneos, mapa, créditos, tienda, guardado, inglés, rompecabezas, otras configuraciones y dificultades, personajes familiares y multijugador local/en línea siguen en el [diseño del producto](design-videogame.md) para etapas posteriores.

## Código y balance

- `src/config.js`: velocidades, física, tolerancia, dificultad y balance provisional.
- `src/game.js`: estados, acciones y simulación; `src/rules.js`: puntos y contactos.
- `src/physics.js`: trayectorias, red y caída; `src/powers.js`: inventario.
- `src/render.js`: cancha y personajes; `src/input.js`: entrada; `src/main.js`: pantallas y bucle.
- `test/game.test.js`, `test/clarity.test.js`, `test/input.test.js`: reglas, casos de claridad y entrada/reloj sin navegador.
- `src/clock.js`: física con pasos fijos y tiempo real activo para el apuntado.

El usuario confirmó un resultado satisfactorio de las pruebas; las cantidades y teclas se mantienen para esta entrega. Consulta [la guía familiar](docs/playtest.md) y [el registro de verificación](docs/verification.md).

El change `match-clarity-and-control` refina el prototipo inicial. Consulta [los contratos y reproducciones](docs/match-clarity-contracts.md). La validación fue confirmada por el usuario y no requirió ajustes adicionales. Las 26 tareas están completas. Las especificaciones vigentes están reconciliadas en `openspec/specs` y ambos changes completados están en `openspec/changes/archive`.
