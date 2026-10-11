## ADDED Requirements

### Requirement: Silencio y volumen accesibles
El sistema SHALL proporcionar activación explícita, silencio y volumen ajustable con teclado o ratón. SHALL comenzar en silencio con volumen inicial 30 % cuando no existe preferencia. SHALL conservar preferencias localmente sin modificar créditos/reserva y mantener información visual completa al silenciar.

#### Scenario: Cambiar volumen con teclado
- **WHEN** se ajusta volumen mediante flechas en el control
- **THEN** cambia volumen sin mover jugadores ni cambiar zona de ataque.

#### Scenario: Preferencias inválidas
- **WHEN** el almacenamiento no está disponible o contiene preferencias inválidas
- **THEN** se usan valores seguros y no se altera el perfil de progreso.

### Requirement: Movimiento reducido
El sistema SHALL respetar inicialmente la preferencia del sistema de movimiento reducido y ofrecer opción explícita para reducir movimiento decorativo. SHALL conservar señales deportivas esenciales y resultado de simulación.

#### Scenario: Movimiento reducido activo
- **WHEN** se activa reducción de movimiento
- **THEN** desaparecen oscilaciones y partículas decorativas manteniendo etiquetas, posturas y marcador.
