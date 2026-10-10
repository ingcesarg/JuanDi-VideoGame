# Contratos refinados por match-clarity-and-control

El 10 de octubre de 2026, antes de modificar lógica, los fixtures reprodujeron:

- Cambiar con Tab al otro personaje permitió a la IA efectuar la primera recepción sin Espacio (último equipo pasó a GOCA y contactos a 1).
- El compañero automático recogió un objeto y elevó disponibles de 2 a 3.
- Dos pausas conservaron el estado previo correctamente, pero no existía motivo de pausa. El blur de la cancha solo limpiaba entradas.
- Las alturas teóricas ya diferían: salto normal 2,025 y súper salto 4,133 unidades. La física no demuestra por sí sola legibilidad visual.
- `input.js` ya filtraba `event.repeat`; se requieren también casos de Tab discreto repetido, no solo mantenerlo pulsado.

| Contrato del prototipo | Refinamiento de esta entrega |
|---|---|
| Flechas dirigen remate al golpear | Remate reserva apuntado a seis zonas, nueva pulsación confirma; saque conserva dirección actual |
| Compañero no seleccionado puede golpear | Recepción y ataque requieren acción humana independientemente de Tab; armado conserva asistencia |
| Cualquier integrante GOCA recoge | Solo contacto horizontal del activo recoge durante juego normal |
| Pausa por Escape o pérdida de foco | Añadir motivo, foco de cancha, conservación del apuntado y reloj limpio al reanudar |
| Disponibles, preparados y efectos | Mantener consumo por unidades; añadir señales por forma, postura, trazo y texto |

Se conservan puntuación, ventaja de dos, máximo de contactos, bloqueo, inventario sin espera ni caducidad y revancha. Los artefactos de `first-playable-prototype` no se modifican retrospectivamente. El 10 de octubre de 2026 se crearon ocho SPECs canónicas en `openspec/specs`, reconciliando los solapamientos de controles, poderes y pausa con los contratos nuevos. Ambos changes completos se archivaron en `openspec/changes/archive/2026-10-10-first-playable-prototype` y `openspec/changes/archive/2026-10-10-match-clarity-and-control`, conservando sus artefactos originales.
