## ADDED Requirements

### Requirement: Efectos únicos de acciones ejecutadas
El sistema SHALL ofrecer sonidos diferenciados para saque/contacto, salto/poder, recogida/preparación y punto/resultado mediante eventos ejecutados. SHALL reproducir cada evento como máximo una vez, sin reproducir golpe para un intento fallido.

#### Scenario: Render repetido
- **WHEN** se presentan varios frames tras el mismo contacto
- **THEN** se reproduce un único efecto de contacto.

#### Scenario: Golpe fallido
- **WHEN** se pulsa acción sin alcance y no se ejecuta contacto
- **THEN** no se reproduce un efecto de golpe.

### Requirement: Ciclo de audio y degradación segura
El sistema SHALL iniciar audio solo tras gesto explícito de usuario. SHALL detener fuentes durante pausa, silencio o pérdida de foco, descartar eventos anteriores al reanudar y permitir jugar si audio no está disponible.

#### Scenario: Reanudar sin backlog
- **WHEN** se pausa con sonido activo y luego se reanuda
- **THEN** no suenan eventos de antes ni de durante la pausa.

#### Scenario: Audio rechazado
- **WHEN** el navegador rechaza crear o reanudar audio
- **THEN** se muestra estado no disponible y el partido continúa con señales visuales.
