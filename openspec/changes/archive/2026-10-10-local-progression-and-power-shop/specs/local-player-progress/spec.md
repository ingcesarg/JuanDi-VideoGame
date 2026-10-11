## ADDED Requirements

### Requirement: Progreso persistente versionado
El sistema SHALL conservar saldo no negativo y reserva entera no negativa de ambos poderes en el navegador, con versión de formato. Un perfil nuevo SHALL tener saldo y reserva cero.

#### Scenario: Recarga fuera del partido
- **WHEN** se recarga tras ganar créditos o comprar usos con almacenamiento disponible
- **THEN** se recuperan saldo y reserva guardados.

### Requirement: Recuperación y almacenamiento no disponible
El sistema SHALL validar datos y permitir jugar con progreso de sesión ante datos corruptos, incompatibles o fallos de almacenamiento. SHALL mostrar aviso de no persistencia y no sobrescribir datos incompatibles.

#### Scenario: Escritura rechazada
- **WHEN** el navegador rechaza una escritura de progreso
- **THEN** la operación permanece en memoria, el usuario recibe aviso y puede continuar jugando.

#### Scenario: Documento inválido
- **WHEN** el documento contiene cantidades negativas, fraccionarias o versión desconocida
- **THEN** se usa un perfil temporal seguro y se informa sin aceptar los valores ni sobrescribir el documento.
