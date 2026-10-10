# readable-item-pickups

## Purpose
Definir objetos identificables y recogida exclusiva del jugador activo.

## Requirements

### Requirement: Objeto identificable y recogida por contacto
El sistema SHALL mostrar el tipo y área de recogida del objeto y explicar que debe pasarse sobre él. Durante juego normal el contacto horizontal del jugador activo con esa área SHALL retirar el objeto y sumar una sola unidad disponible del poder indicado, con confirmación. SHALL impedir recogida automática por compañero o rivales y durante pausa o apuntado.

#### Scenario: Recogida humana
- **WHEN** el jugador activo cruza el área del objeto
- **THEN** este desaparece, aumenta un disponible del poder correcto y se muestra su nombre y la unidad obtenida.

#### Scenario: Varios pasos de simulación sobre el objeto
- **WHEN** el jugador permanece sobre la posición de un objeto ya recogido
- **THEN** no se entregan unidades adicionales.

#### Scenario: Compañero pasa sobre el objeto
- **WHEN** el compañero automático cruza el área
- **THEN** el objeto y el inventario permanecen sin cambios.

### Requirement: Recoger no activa el poder
La recogida SHALL aumentar disponibles sin modificar preparados. La ayuda SHALL indicar cómo seleccionar y preparar el poder obtenido, y SHALL distinguir la recogida del premio por remate a espacio libre.

#### Scenario: Poder distinto al seleccionado
- **WHEN** se recoge un poder que no está seleccionado
- **THEN** se indica seleccionar con Q y preparar con E, sin activar ni consumir el nuevo uso.
