## 1. Base y regresiones

- [x] 1.1 Reproducir Tab repetido, poderes poco claros y pausa usando fixtures controlados; registrar resultados sin asumir causas no verificadas.
- [x] 1.2 Revisar contratos del prototipo inicial y documentar los requisitos que esta entrega refina; no archivar cambios automáticamente.
- [x] 1.3 Añadir pruebas antes de modificar lógica; mantener puntuación, tres contactos, bloqueo, inventario y revancha.

## 2. Control humano y pausa

- [x] 2.1 Separar responsabilidad humana de selección; probar primeras recepciones y terceros contactos sin Espacio ante Tab repetido.
- [x] 2.2 Conservar armado asistido, limpiar intentos al cambiar y mostrar jugador activo y turno de acción.
- [x] 2.3 Unificar Escape, blur, visibilidad e instrucciones en pausa idempotente con motivo y botón accesible.
- [x] 2.4 Probar entradas durante pausa, foco restaurado, doble evento de pausa y ausencia de tiempo acumulado al reanudar.

## 3. Apuntado asistido

- [x] 3.1 Implementar seis zonas con coordenadas interiores, selección discreta y marcador legible.
- [x] 3.2 Implementar elegibilidad y reserva del ataque, una ventana por oportunidad y ralentización uniforme configurable.
- [x] 3.3 Probar confirmación con pulsación nueva, expiración, alcance perdido y restauración de velocidad.
- [x] 3.4 Bloquear Tab durante apuntado y preservar selección y tiempo restante durante pausa.
- [x] 3.5 Verificar las seis trayectorias, apuntado con poder y no consumo ante golpe cancelado.

## 4. Acciones y poderes

- [x] 4.1 Separar visualmente selección, disponibles y preparados; explicar Q y E en contexto.
- [x] 4.2 Probar selección sin gasto, dos preparaciones, stock vacío, consumo único compatible y no consumo por IA.
- [x] 4.3 Diferenciar salto, súper salto, bloqueo y remate mediante postura, altura, trazo y texto sin depender solo del color.
- [x] 4.4 Añadir fixtures comparables de altura y alcance de salto, y tiempo de vuelo normal/potente al mismo objetivo.

## 5. Objetos

- [x] 5.1 Mostrar tipo, área y ayuda de recogida; implementar contacto del jugador activo durante juego normal.
- [x] 5.2 Probar unidad única, desaparición, no recogida por IA ni durante pausa/apuntado y no activación automática.
- [x] 5.3 Mostrar instrucciones posteriores a recogida según selección y diferenciar premio por colocación.

## 6. Validación y documentación

- [x] 6.1 Ejecutar npm test y npm run build; corregir regresiones.
- [x] 6.2 Verificar en navegador con teclado real las seis zonas, poderes, objetos, Tab repetido y pausa durante apuntado; registrar pendientes reales.
- [x] 6.3 Actualizar README, instrucciones en pantalla y docs/playtest.md con las interacciones nuevas.
- [x] 6.4 Añadir nueva evidencia a docs/verification.md sin atribuir las verificaciones anteriores a esta versión.
- [x] 6.5 Realizar prueba familiar: distinguir ambos saltos; preparar y consumir un poder; recoger un objeto; dirigir ataque; cambiar jugador sin delegar el partido. Registrar ayudas necesarias y comentarios, sin inventar aprobación.
- [x] 6.6 Ajustar parámetros a partir del feedback y repetir escenarios afectados.
- [x] 6.7 Validar el change con OpenSpec; revisar coherencia con las SPECs del prototipo antes de sincronizar/archivar en un paso posterior autorizado.

Cierre de validación: el usuario confirmó «Las pruebas realizadas son exitosas. Podemos continuar con el plan». Las tareas 6.2 y 6.5 se cierran con esa confirmación del usuario, no con ejecución automatizada ni observaciones detalladas atribuidas a participantes. Para 6.6, no se comunicaron incidencias ni ajustes necesarios; se conservan los parámetros y no hay escenarios modificados que repetir.
