## ADDED Requirements

### Requirement: Selección explícita de zona de ataque
El sistema SHALL ofrecer seis zonas rivales (izquierda, centro, derecha; corta o profunda) durante una oportunidad válida de remate humano. SHALL mostrar selección y etiqueta. Las flechas SHALL elegir zona durante apuntado, sin mover al atacante, y una nueva pulsación de Espacio SHALL confirmar.

#### Scenario: Remate dirigido
- **WHEN** el jugador abre apuntado, elige derecha profunda y confirma dentro de alcance
- **THEN** el remate usa un destino dentro de esa zona y contabiliza un único contacto.

#### Scenario: Pulsación sostenida
- **WHEN** el usuario mantiene Espacio tras abrir apuntado
- **THEN** la repetición del teclado no confirma el remate.

### Requirement: Tiempo asistido limitado y contacto válido
El sistema SHALL ralentizar uniformemente la simulación durante una ventana configurable y acotada. Al vencer SHALL intentar el golpe hacia la selección actual; SHALL validar el contacto al ejecutarlo. SHALL impedir reabrir la ventana en la misma oportunidad y suspender su temporizador durante pausa.

#### Scenario: Plazo vencido
- **WHEN** transcurre el plazo sin confirmación y el golpe sigue siendo válido
- **THEN** se ejecuta un solo remate al objetivo seleccionado y se restaura la velocidad normal.

#### Scenario: Pelota fuera de alcance
- **WHEN** la pelota deja de ser elegible antes de confirmar o vencer el plazo
- **THEN** se cancela el apuntado sin golpe remoto, sin contacto añadido ni consumo de poder preparado.

#### Scenario: Pausa durante apuntado
- **WHEN** se pierde el foco y luego se reanuda explícitamente
- **THEN** se conserva la zona y el tiempo restante, sin contabilizar el tiempo pausado.
