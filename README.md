# JuanDiVoley · Prototipo 01

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
| Flechas | Mover al jugador activo; dirigir el saque o remate al golpear |
| Espacio | Saque, recepción, armado, remate o salto para bloqueo según contexto |
| Tab | Cambiar entre Leo y Vale |
| Q | Elegir súper salto o remate potente |
| E | Preparar un uso del poder elegido |
| Escape | Pausar; el botón **Seguir jugando** reanuda |

La cancha necesita el foco del teclado: puedes hacer clic en ella para recuperarlo. Las teclas del juego solo se interceptan con la cancha enfocada. Abrir **Cómo jugar**, salir de la ventana o cambiar de pestaña pausa el partido; reanudar es explícito.

Observa el círculo claro de caída. Acércate y pulsa Espacio mientras baja la pelota; aparece una indicación si está a tu alcance. La primera recepción va al compañero, el segundo contacto arma cerca de la red y el tercero remata. El compañero se mueve y golpea automáticamente, pero el jugador activo necesita tu acción. Tab permite tomar control del compañero que va a recibir.

En el saque o remate, izquierda y derecha eligen el lado del campo rival; arriba apunta profundo y abajo hacia la red. Sin dirección se apunta al centro. Las zonas verdes muestran espacios alejados de los rivales. Cerca de la red, pulsar Espacio ante una pelota atacante alta inicia un salto de bloqueo; para rematar una pelota alta, acércate y pulsa al bajar. Hay una pequeña tolerancia de contacto, no un golpe automático por mantener Espacio.

Cada partido empieza con dos usos de cada poder. E descuenta uno y lo deja preparado hasta la próxima acción humana compatible: súper salto para saltar/bloquear y remate potente para rematar. Puedes preparar varios seguidos, sin espera ni caducidad; cada acción consume uno. El compañero no consume tus mejoras pendientes. Recoger un objeto suma un uso y ganar un punto mediante remate a espacio libre suma un uso de remate potente. No se usan créditos ni compras en esta etapa.

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
- `test/game.test.js`: verificaciones sin navegador.

Las cantidades y teclas son propuestas de prueba, aún pendientes de confirmar con Juan Diego. Consulta [la guía familiar](docs/playtest.md) y [el registro de verificación](docs/verification.md).
