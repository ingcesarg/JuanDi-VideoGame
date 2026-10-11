## MODIFIED Requirements

### Requirement: Lectura de espacios en Principiante
El sistema SHALL resaltar sectores libres según posiciones actuales de los rivales y registrar remates dirigidos a dichos sectores sin garantizar un punto. Principiante SHALL conservar pistas actuales y Normal SHALL mostrar pistas más pequeñas conforme a `volleyball-difficulty`, sin alterar las seis zonas de apuntado ni el criterio de premios por colocación.

#### Scenario: Rivales se desplazan
- **WHEN** los rivales dejan libre otro sector del campo
- **THEN** la ayuda visual refleja la nueva distribución
