## Why

La prueba familiar del prototipo mostró dificultad para dirigir ataques, distinguir movimientos y poderes, recoger objetos, pausar y conservar el control al cambiar de jugador. Antes de ampliar el juego necesitamos que una decisión produzca un efecto comprensible y verificable.

## What Changes

- Apuntado asistido a seis zonas rivales durante el ataque humano, con previsualización, confirmación y tiempo ralentizado acotado.
- Diferenciación visual y mecánica de salto normal, súper salto, bloqueo y remate; estados separados de selección, preparación y consumo de poderes.
- Recogida de objetos por contacto del jugador activo, con identificación y confirmación claras.
- Responsabilidad humana del siguiente contacto que no se delega a la máquina mediante cambios repetidos con Tab.
- Pausa explícita por Escape o pérdida de foco; reanudación mediante botón y limpieza de entradas.
- **BREAKING**: durante el apuntado las flechas seleccionan zona y Espacio confirma; fuera de él conservan su función. Se actualizan instrucciones y pruebas.

## Capabilities

### New Capabilities

- `assisted-attack-targeting`: selección y confirmación de destino del remate.
- `readable-actions-and-powers`: lectura de acciones, inventario y mejoras preparadas.
- `readable-item-pickups`: objetos identificables y recogida humana explícita.
- `human-contact-control`: cambio de personaje sin delegación involuntaria de contactos.
- `explicit-match-pause`: interrupción y reanudación inequívocas.

### Modified Capabilities

No existen todavía SPECs canónicas en `openspec/specs/`. Las capacidades nuevas refinan el comportamiento implementado por `first-playable-prototype`, aún no archivado. Antes de sincronizar/archivar ambos changes se deberá reconciliar sus contratos: en particular apuntado, IA del compañero, recogida y pausa. No declarar archivado ni modificar retrospectivamente el change inicial desde esta propuesta.

## Impact

Afecta a `src/input.js`, `src/game.js`, `src/render.js`, `src/main.js`, `src/powers.js`, `src/config.js`, estilos, pruebas y documentación familiar. Se conserva JavaScript modular, Canvas y Vite; no se proponen dependencias nuevas.

Se mantienen 2 contra 2, un set a 15 con ventaja de dos, Principiante, cámara fija, poderes por usos y juego local. Arte final, cámara dinámica, torneos, aprendizaje y multijugador quedan fuera. Este change documenta trabajo pendiente; no implica código ni validación familiar ya realizados.
