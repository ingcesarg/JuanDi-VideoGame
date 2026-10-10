## ADDED Requirements

### Requirement: Inventario y selección
El sistema SHALL iniciar cada partido con dos usos de súper salto y dos de remate potente, mostrar cantidades y selección, y permitir alternar selección con Q sin consumir usos.

#### Scenario: Seleccionar poder
- **WHEN** el usuario pulsa Q
- **THEN** cambia el poder seleccionado y ambas cantidades permanecen iguales

### Requirement: Activación sin límites temporales
El sistema SHALL activar el poder seleccionado con E solo si existe inventario, descontar exactamente una unidad y acumular una mejora pendiente para la próxima acción compatible. No SHALL imponer caducidad, espera entre usos ni sustituir mejoras pendientes con nuevas activaciones.

#### Scenario: Dos activaciones consecutivas
- **WHEN** hay dos unidades del mismo poder y el usuario pulsa E dos veces de forma consecutiva
- **THEN** quedan cero unidades y dos mejoras pendientes sin espera entre activaciones

#### Scenario: Inventario vacío
- **WHEN** el usuario intenta activar un poder con cero unidades
- **THEN** no aparece una mejora, el inventario no se vuelve negativo y se muestra un aviso

#### Scenario: Esperar con mejora pendiente
- **WHEN** se activa un poder y pasan varios puntos sin una acción compatible
- **THEN** la mejora sigue disponible hasta usarla o reiniciar el partido

### Requirement: Efectos compatibles
El sistema SHALL aplicar una mejora de súper salto a un salto o bloqueo aumentando altura y alcance vertical, y una mejora de remate potente a un remate aumentando velocidad. Cada acción compatible SHALL consumir exactamente una mejora pendiente de su tipo.

#### Scenario: Recepción con remate preparado
- **WHEN** hay una mejora de remate potente pendiente y el jugador recibe la pelota
- **THEN** la recepción mantiene sus parámetros habituales y la mejora permanece pendiente hasta un remate

#### Scenario: Salto mejorado
- **WHEN** el jugador salta con una mejora de súper salto pendiente
- **THEN** alcanza mayor altura que en un salto normal y se descuenta una mejora pendiente

### Requirement: Adquisición durante el partido
El sistema SHALL ofrecer un objeto alcanzable en el campo GOCA por jugada que conceda una unidad del poder indicado al recogerlo, y otorgar una unidad de remate potente por punto ganado con un remate a espacio libre. Cada objeto y premio SHALL adjudicarse una sola vez; el objeto restante desaparece al acabar la jugada.

#### Scenario: Recoger un objeto
- **WHEN** un integrante GOCA toca un objeto presente
- **THEN** el inventario aumenta una unidad del poder indicado y el objeto desaparece sin conceder premios adicionales por permanecer en esa posición

#### Scenario: Buena jugada premiada
- **WHEN** GOCA gana un punto con un remate registrado a espacio libre
- **THEN** recibe exactamente una unidad de remate potente por ese punto
