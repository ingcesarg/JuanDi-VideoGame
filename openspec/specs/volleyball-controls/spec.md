# volleyball-controls

## Purpose
Definir movimiento, acciones, asistencia y resolución física del voleibol.

## Requirements

### Requirement: Movimiento y cambio de jugador
El sistema SHALL permitir mover al jugador activo con flechas dentro de su campo y alternar con pulsaciones discretas de Tab entre los dos integrantes GOCA, con indicador visual y orientación constante de pantalla. Durante apuntado SHALL conservar al atacante y usar las flechas para seleccionar zona sin moverlo, conforme a `assisted-attack-targeting` y `human-contact-control`.

#### Scenario: Cambio durante la jugada
- **WHEN** el usuario pulsa Tab fuera del apuntado
- **THEN** el otro integrante GOCA pasa a ser activo y se limpian los intentos del anterior; la asistencia conserva movimiento y segundo contacto, sin automatizar recepción ni ataque

### Requirement: Acción contextual y dirección
El sistema SHALL ejecutar saque, recepción, armado, remate o bloqueo mediante Espacio según estado, contactos, altura y cercanía a la red. Los contactos SHALL exigir alcance y momento válidos; las flechas al servir SHALL dirigir el objetivo y sin dirección se utilizará el centro rival. El remate humano SHALL reservar una selección entre seis zonas conforme a `assisted-attack-targeting`, con centro profundo por defecto, y ejecutar solo al confirmar con una nueva pulsación o vencer el plazo con contacto válido.

#### Scenario: Secuencia de ataque
- **WHEN** GOCA recibe una pelota alcanzable y realiza tres contactos válidos
- **THEN** las acciones corresponden a recepción, armado y remate y la pelota sigue trayectorias físicas hacia los objetivos respectivos

#### Scenario: Acción fuera de alcance
- **WHEN** el usuario pulsa Espacio lejos de la pelota durante una jugada
- **THEN** no se produce contacto ni se reposiciona la pelota para favorecerlo

#### Scenario: Dirección del remate
- **WHEN** el jugador elige una de seis zonas durante apuntado y confirma un remate válido
- **THEN** la trayectoria apunta a la zona seleccionada y se contabiliza un único contacto

#### Scenario: Bloqueo
- **WHEN** el jugador cerca de la red pulsa acción y alcanza en el salto una pelota atacante rival
- **THEN** la pelota se desvía físicamente y el bloqueo no suma un contacto al equipo defensor

### Requirement: Compañero y rivales automáticos
El sistema SHALL mover al compañero no activo y a los dos rivales conforme a trayectoria prevista. Los rivales SHALL golpear con alcance y reglas de contactos válidos. El compañero no activo SHALL asistir únicamente el segundo contacto de armado. La primera recepción y el tercer contacto de ataque SHALL requerir acción humana independientemente de cambios con Tab, conforme a `human-contact-control`. El jugador activo SHALL requerir acción humana.

#### Scenario: Rival responde al servicio
- **WHEN** un servicio válido llega al campo rival
- **THEN** los rivales intentan recepción, armado y devolución mediante desplazamientos y contactos alcanzables

#### Scenario: Control humano conservado
- **WHEN** una pelota llega al jugador activo y el usuario no pulsa acción
- **THEN** ese jugador no realiza una recepción automática

### Requirement: Resolución física y adaptaciones deportivas
El sistema SHALL simular altura, gravedad y red, otorgar punto al rival del campo donde la pelota cae dentro, al rival del último equipo en tocar si cae fuera y al rival ante un cuarto contacto. Los contactos SHALL reiniciarse con cambio de posesión. El prototipo SHALL explicar que no aplica rotación ni sanciona doble contacto individual.

#### Scenario: Pelota fuera
- **WHEN** GOCA toca por última vez la pelota y esta cae fuera
- **THEN** el rival recibe exactamente un punto

#### Scenario: Cuarto contacto
- **WHEN** un equipo realiza un cuarto contacto sin que el rival toque la pelota
- **THEN** se resuelve la jugada a favor del rival

#### Scenario: Pelota contra la red
- **WHEN** la pelota cruza el plano de la red por debajo de su borde superior
- **THEN** colisiona con la red en lugar de atravesarla libremente

### Requirement: Lectura de espacios en Principiante
El sistema SHALL resaltar sectores libres según posiciones actuales de los rivales y registrar remates dirigidos a dichos sectores sin garantizar un punto.

#### Scenario: Rivales se desplazan
- **WHEN** los rivales dejan libre otro sector del campo
- **THEN** la ayuda visual refleja la nueva distribución
