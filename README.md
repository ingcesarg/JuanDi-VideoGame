# JuanDiVoley · Claridad y control

Ayuda al Club GOCA a recuperar su gloria, empezando en una cancha de barrio. Este primer prototipo para computador permite jugar **2 contra 2 contra la máquina**, en dificultad Principiante o Normal, un set a 15 y con dos puntos de ventaja.

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

## Créditos y tienda local

Cada victoria concede 10 créditos una sola vez. Perder no resta saldo. En inicio y resultados puedes comprar un uso de súper salto o remate potente por 5 créditos. La reserva comprada se guarda en este navegador y se añade, completa, a los dos usos gratuitos de cada poder al comenzar el próximo partido o revancha.

Los usos transferidos pertenecen a ese partido. No se guarda una partida en curso: recargar pierde la partida y sus usos sobrantes. Los objetos y premios por colocación siguen siendo recursos del partido; no se convierten en reserva. Saldo y reserva son locales al navegador y origen, con una pestaña activa. Si no se puede guardar, aparece un aviso y puedes seguir con progreso temporal de sesión.

`src/progress.js` gestiona el perfil versionado y las operaciones de premio/compra/transferencia; `test/progress.test.js` cubre persistencia y fallos. El premio y precios se configuran en `src/config.js`; se mantienen tras la confirmación de prueba exitosa del usuario.

## Dificultad de voleibol

Elige Principiante o Normal antes de entrar a la cancha y en resultados antes de revancha. La elección se conserva durante la sesión; recargar vuelve a Principiante. El nivel queda fijo durante el partido y se muestra en cancha y resultados; cambiar la elección del siguiente partido no cambia el resultado anterior.

Principiante conserva los rivales y pistas anteriores. Normal aumenta velocidad rival de 3 a 3,8, reduce la probabilidad de fallo de 0,16 a 0,08 y muestra pistas al 60 % de tamaño. Controles, seis zonas de apuntado, poderes, créditos y reglas se mantienen. Los perfiles están en `src/difficulty.js`, con pruebas en `test/difficulty.test.js`. El usuario confirmó que se percibe el cambio en dificultad y legibilidad; se mantienen estos parámetros.

## Sonido y movimiento

Abre **Sonido y movimiento** en la cabecera para activar o silenciar efectos, probar sonido, ajustar volumen y reducir movimiento decorativo. Durante un partido, abrir ajustes pausa; cerrar no reanuda: pulsa **Seguir jugando**. Las flechas del control de volumen no controlan jugadores.

Sin preferencias previas, comienza silenciado y con volumen 30 %. Audio requiere un gesto explícito y sigue siendo opcional. Las preferencias se guardan aparte de créditos/reserva; movimiento reducido usa inicialmente la preferencia del sistema. Si no se puede guardar o reproducir audio, aparece aviso y el juego continúa. Pausa y silencio detienen sonidos; reanudar no reproduce eventos acumulados.

El render incorpora uniformes sombreados, detalles de cancha, movimiento de piernas, transición de brazos y señales breves de contacto/poder. Movimiento reducido elimina oscilaciones y partículas; conserva posturas, texto, pistas y física. La vista sigue fija y el arte sigue siendo provisional. Música y cámaras dinámicas quedan para otras entregas.

Módulos: `src/presentation.js` (eventos), `src/preferences.js` (preferencias independientes), `src/audio.js` (síntesis original) y `test/presentation.test.js` (ciclo, degradación y render).

El plan de progresión local, dificultad Normal y presentación audiovisual está validado por el usuario. Sus tres changes completos están archivados en `openspec/changes/archive` y sus contratos vigentes consolidados en las 15 capacidades de `openspec/specs`.

Los poderes tienen sonidos propios al ejecutarse: súper salto con barrido ascendente y destello agudo; remate potente con estallido de ruido y golpe grave contundente. Preparar con E conserva su señal separada.
