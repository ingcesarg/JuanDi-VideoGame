# explicit-match-pause

## Purpose
Definir pausa explícita, conservación de estado y reanudación.

## Requirements

### Requirement: Pausa visible e idempotente
El sistema SHALL pausar por Escape, pérdida de foco, pestaña oculta o apertura de instrucciones. SHALL mostrar motivo y botón Seguir jugando, limpiar entradas y detener simulación y temporizadores de juego. Eventos repetidos SHALL conservar el estado original que debe reanudarse.

#### Scenario: Cambiar de ventana
- **WHEN** se pierde el foco en una jugada y después se vuelve a la ventana
- **THEN** el partido sigue pausado, muestra su motivo y no avanza hasta reanudar explícitamente.

#### Scenario: Múltiples eventos de pausa
- **WHEN** se reciben blur y cambio de visibilidad consecutivos
- **THEN** se conserva el estado previo a la primera pausa sin sobrescribirlo con paused.

### Requirement: Reanudación sin acciones residuales
El sistema SHALL reanudar solo mediante el botón Seguir jugando activable con ratón o teclado. SHALL restaurar foco a la cancha, limpiar entradas y reiniciar la referencia temporal del bucle. Las teclas de juego durante pausa SHALL carecer de efectos en partido e inventario.

#### Scenario: Flecha mantenida al salir
- **WHEN** se pierde foco con una flecha pulsada y después se reanuda
- **THEN** el jugador no se desplaza hasta recibir una entrada nueva ni se simula el tiempo transcurrido fuera.

#### Scenario: Activar poder durante pausa
- **WHEN** se pulsa E mientras el partido está pausado
- **THEN** el inventario no cambia.

#### Scenario: Reanudar apuntado
- **WHEN** la pausa interrumpió una selección de zona
- **THEN** al continuar se recuperan atacante, objetivo y tiempo restante sin disparar un remate por la tecla usada en el botón.
