## ADDED Requirements

### Requirement: Inventario y preparación diferenciados
El sistema SHALL mostrar por poder nombre, disponibles y preparados. Q SHALL cambiar solo selección; E SHALL transferir exactamente un disponible a preparado si existe stock. SHALL admitir preparaciones consecutivas sin caducidad ni cooldown.

#### Scenario: Seleccionar sin gastar
- **WHEN** el jugador pulsa Q
- **THEN** cambia el poder destacado y no cambia ningún contador.

#### Scenario: Preparar dos usos
- **WHEN** existen dos disponibles y se pulsa E dos veces
- **THEN** quedan cero disponibles y dos preparados con confirmación visible de cada transferencia.

#### Scenario: Sin stock
- **WHEN** no hay disponibles y se pulsa E
- **THEN** se explica la falta de usos y ningún contador cambia.

### Requirement: Consumo compatible y señales diferenciadas
El sistema SHALL consumir una preparación por acción humana compatible ejecutada y SHALL distinguir visualmente salto normal, súper salto, bloqueo, remate y remate potente con forma o movimiento y texto, no solo color. El súper salto SHALL alcanzar mayor altura que el normal en condiciones equivalentes; el remate potente SHALL reducir el tiempo de vuelo al mismo destino respecto al normal.

#### Scenario: Comparación de saltos
- **WHEN** se realizan salto normal y súper salto desde condiciones idénticas
- **THEN** el segundo alcanza mayor altura, presenta señal propia y consume exactamente una preparación.

#### Scenario: Remate potente confirmado
- **WHEN** hay un remate preparado y se ejecuta un ataque válido
- **THEN** se consume uno, aparece la señal de remate potente y el destino seleccionado se conserva.

#### Scenario: Acción incompatible o fallida
- **WHEN** se recibe con un remate potente preparado o se falla un intento de remate
- **THEN** la preparación de remate permanece intacta.

#### Scenario: Compañero automático
- **WHEN** el compañero ejecuta una acción asistida
- **THEN** no consume preparaciones humanas.
