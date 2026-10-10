## Why

JuanDiVoley tiene un diseño acordado con Juan Diego y su papá, pero todavía no permite jugar. Un primer partido completo permitirá probar el control contextual, la lectura de espacios y los poderes antes de desarrollar progresión y multijugador.

## What Changes

- Aplicación web con inicio, instrucciones en español, partido y resultados con revancha.
- Partido Club GOCA contra la máquina, dos jugadores por equipo, un set a 15 y victoria con dos puntos de ventaja.
- Flechas para movimiento y dirección del golpe, botón contextual para saque, recepción, armado, remate y bloqueo, y cambio entre los dos jugadores humanos del equipo.
- Compañeros y rivales controlados por la máquina; dificultad Principiante con espacios libres resaltados.
- Cancha de barrio con cámara amplia fija y personajes inventados provisionales.
- Inventario de súper salto y remate potente, adquisición durante el partido y consumo de una unidad por activación, sin caducidad ni espera entre usos.
- Explicación visible de las simplificaciones deportivas y resumen con resultado, mejores jugadas y consejo.
- Las siguientes etapas conservan los requisitos del diseño original: otros tamaños de equipo, configuraciones y dificultades, torneos, créditos y tienda, inglés, rompecabezas, progreso, personajes familiares y multijugador local y en línea.

## Capabilities

### New Capabilities
- `prototype-match`: ciclo jugable en navegador, presentación, marcador, resultados y revancha.
- `volleyball-controls`: control contextual, física, compañeros y rivales automáticos, lectura de espacios y reglas simplificadas.
- `match-powers`: adquisición, selección, consumo y efectos de los dos poderes iniciales.

### Modified Capabilities

Ninguna; no existen especificaciones previas.

## Impact

Se creará la aplicación desde cero dentro de este repositorio, con renderizado Canvas y módulos JavaScript, además de herramientas locales de desarrollo y pruebas de las reglas. No requiere servidor de juego, cuentas ni servicios externos. La especificación fuente `design-videogame.md` se mantiene como referencia del producto completo.
