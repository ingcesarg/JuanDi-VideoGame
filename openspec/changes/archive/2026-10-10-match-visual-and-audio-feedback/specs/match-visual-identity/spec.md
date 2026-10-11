## ADDED Requirements

### Requirement: Identidad legible de cancha y jugadores
El sistema SHALL mejorar uniformes, proporciones, sombreado, balón y cancha conservando identificación por nombre/número, equipo y jugador activo. SHALL mantener visibles balón, red, pistas y seis zonas de apuntado en ambos niveles.

#### Scenario: Ataque Normal
- **WHEN** se apunta en Normal con efectos de poder
- **THEN** destino, balón y atacante siguen visibles sin que decoración o efectos oculten la selección.

### Requirement: Animación independiente de física
El sistema SHALL suavizar posturas de acciones y mostrar señales breves de contacto, poder y punto sin modificar física, alcance, inventario ni temporizador de apuntado. En pausa SHALL congelar animación de juego.

#### Scenario: Comparación de presentación
- **WHEN** se ejecuta la misma secuencia con movimiento normal o reducido
- **THEN** resultado físico y consumo son iguales y las acciones siguen reconocibles mediante postura/texto.
