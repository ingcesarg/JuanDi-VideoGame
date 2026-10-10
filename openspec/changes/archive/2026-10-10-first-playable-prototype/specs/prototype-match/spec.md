## ADDED Requirements

### Requirement: Inicio de partido en navegador
El sistema SHALL ofrecer una interfaz en español con controles y simplificaciones, y permitir iniciar un partido de Club GOCA contra la máquina, dos jugadores por equipo, dificultad Principiante y un set a 15 puntos.

#### Scenario: Comenzar a jugar
- **WHEN** el usuario elige jugar desde el inicio
- **THEN** aparece la cancha con cuatro jugadores, pelota, red, marcador 0–0 y GOCA preparado para servir mediante acción humana

### Requirement: Marcador y victoria con ventaja
El sistema SHALL otorgar exactamente un punto por jugada resuelta, dar el saque al ganador del punto y terminar el set únicamente cuando un equipo tenga al menos 15 puntos y ventaja de dos, sin límite máximo.

#### Scenario: Ventaja insuficiente
- **WHEN** el marcador alcanza 15–14
- **THEN** el partido continúa con el siguiente saque

#### Scenario: Victoria
- **WHEN** el marcador alcanza 16–14 o 15–13
- **THEN** termina el partido y aparece el ganador con ese resultado

#### Scenario: Set extendido
- **WHEN** el marcador pasa de 29–29 a 30–29 y después a 31–29
- **THEN** continúa en 30–29 y termina en 31–29

### Requirement: Pausa y vista amplia
El sistema SHALL mantener visibles la pelota, red y jugadores con vista amplia fija y pausar simulación al perder foco o pulsar Escape. Reanudar SHALL conservar el partido y eliminar entradas retenidas.

#### Scenario: Cambio de ventana
- **WHEN** el navegador pierde foco durante una jugada
- **THEN** pelota, jugadores y marcador se congelan hasta reanudar explícitamente y ninguna tecla previa queda retenida

### Requirement: Resultados y revancha
El sistema SHALL mostrar resultado, remates a espacios libres, mejor racha y un consejo, y permitir comenzar una revancha con estado completamente reiniciado.

#### Scenario: Nueva partida después del resultado
- **WHEN** el usuario elige revancha
- **THEN** el marcador vuelve a 0–0 y posiciones, pelota, contactos, estadísticas, inventario y mejoras pendientes vuelven a su estado inicial sin duplicar controles ni simulación
