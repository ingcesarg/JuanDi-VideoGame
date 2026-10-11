# power-shop

## Purpose
Definir los contratos vigentes de power-shop para JuanDiVoley.

## Requirements

### Requirement: Compra previa de poderes
El sistema SHALL permitir comprar un uso de súper salto o remate potente en inicio o resultados, por precio configurable inicialmente 5. SHALL mostrar saldo, precio y reserva. Compra válida SHALL descontar precio y aumentar exactamente una unidad de reserva conjuntamente.

#### Scenario: Compra con saldo
- **WHEN** se compra un remate potente con saldo 10 y precio 5
- **THEN** quedan saldo 5 y una unidad adicional de reserva de remate, sin cambiar la reserva de salto.

#### Scenario: Saldo insuficiente
- **WHEN** el saldo es inferior al precio
- **THEN** se informa y no cambia saldo ni reserva.

#### Scenario: Partido en curso
- **WHEN** hay un partido en curso o pausado
- **THEN** no se permite comprar usos.

### Requirement: Transferencia al siguiente partido
El sistema SHALL añadir toda la reserva comprada al inventario gratuito del próximo partido y vaciarla una sola vez. SHALL explicar antes del inicio que los usos se destinan a ese partido, no guardado, y no devolver sobrantes ni convertir objetos en reserva.

#### Scenario: Inicio y revancha
- **WHEN** comienza un partido con reserva de tres saltos y un remate
- **THEN** inicia con cinco saltos y tres remates disponibles, preparados cero y reserva vacía.

#### Scenario: Nuevo partido posterior
- **WHEN** se inicia otro partido sin nuevas compras
- **THEN** solo recibe los dos usos gratuitos por tipo y no repite la transferencia anterior.
