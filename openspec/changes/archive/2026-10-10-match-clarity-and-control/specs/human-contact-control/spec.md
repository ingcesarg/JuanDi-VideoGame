## ADDED Requirements

### Requirement: Contactos humanos independientes del cambio de jugador
El sistema SHALL exigir acción humana para primera recepción y tercer contacto de ataque de cada secuencia humana. Tab SHALL cambiar selección sin convertir esos contactos en automáticos. El segundo contacto SHALL conservar asistencia del compañero no seleccionado. Cambiar jugador SHALL limpiar intentos pendientes del saliente.

#### Scenario: Tab repetido durante recepción
- **WHEN** llega la pelota rival y se pulsa Tab repetidamente sin Espacio
- **THEN** ninguno de los dos jugadores realiza la recepción automáticamente; si la pelota cae se resuelve el punto normalmente.

#### Scenario: Recepción tras cambiar jugador
- **WHEN** se selecciona al compañero y se pulsa Espacio con alcance válido
- **THEN** el personaje seleccionado recibe una sola vez y el segundo contacto puede ser asistido.

#### Scenario: Ataque no delegado
- **WHEN** tras el armado se cambia de jugador repetidamente sin ejecutar un ataque
- **THEN** la IA no realiza el tercer contacto por el usuario.

### Requirement: Contexto de control visible
El sistema SHALL identificar al jugador activo y mostrar cuándo corresponde recepción, armado o ataque humano. Durante apuntado SHALL impedir Tab e indicar que debe concluirse esa acción. Fuera de ese estado cada pulsación discreta SHALL cambiar una sola vez.

#### Scenario: Mantener Tab
- **WHEN** se mantiene Tab pulsado durante juego normal
- **THEN** solo cambia una vez hasta soltar y volver a pulsar.

#### Scenario: Tab durante apuntado
- **WHEN** se pulsa Tab con un ataque reservado
- **THEN** no cambia el atacante y se muestra la indicación de concluir el apuntado.
