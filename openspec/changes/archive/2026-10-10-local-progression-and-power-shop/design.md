## Context

El juego usa JavaScript, Canvas y Vite. El inventario actual vive dentro del partido y se reinicia con la revancha. Las ocho SPECs canónicas describen sus contratos actuales. El diseño de producto concede créditos por victorias y permite comprar poderes.

## Goals / Non-Goals

**Goals:** ciclo victoria → créditos → compra → siguiente partido; progreso local robusto y explicable; conservar poderes gratuitos y regresiones.

**Non-Goals:** persistir un partido en curso, retos, torneos, cuentas, sincronización entre dispositivos, dificultad Normal, arte y audio.

## Decisions

- Módulo de progreso separado del motor, con almacenamiento inyectable para pruebas. Un documento localStorage versionado contiene saldo, reserva por tipo y último identificador premiado. La alternativa de servidor añade cuentas y operación fuera del alcance.
- Perfil nuevo: saldo 0 y reserva 0; parámetros iniciales configurables de 10 créditos por victoria y 5 por uso. No premiar derrota ni cobrar entrada. Estos valores son propuestas de balance, no compromisos del diseño original.
- Generar identificador por partido. Resolver premio al entrar a resultados, antes de mostrar saldo. Persistir saldo y marcador de premio juntos; invocaciones repetidas del mismo resultado no suman. No restaurar resultados ni partido tras recargar.
- Compra solo en inicio/resultados, usando operación conjunta de saldo y reserva. Sin saldo suficiente no cambiar nada. Mostrar precio, reserva y explicación del próximo partido.
- Al iniciar o hacer revancha, transferir toda la reserva al inventario del partido y vaciarla en una sola escritura, antes de crear la partida. Los dos usos gratuitos de cada tipo se mantienen. Objetos, premios por colocación y usos sobrantes del partido no se guardan en reserva. Recargar durante partido pierde esos usos; explicar esta regla antes de iniciar.
- Fallo de escritura: mantener operación y progreso en memoria durante la sesión, mostrando aviso visible de que no persiste. Datos corruptos o de versión desconocida: perfil temporal seguro, avisar y no sobrescribir el documento incompatible. No impedir jugar.
- Perfil único por navegador y una pestaña activa. No prometer coherencia multiusuario o entre pestañas; indicarlo en documentación.

## Risks / Trade-offs

- Pérdida de almacenamiento o limpieza del navegador → aviso y juego disponible en memoria.
- Economía demasiado generosa o lenta → constantes configurables y prueba humana del ciclo.
- Poderes comprados perdidos al recargar en partido → texto explícito sobre transferencia y ausencia de guardado de partida.
- localStorage editable → progreso recreativo local, sin autoridad competitiva.

## Migration Plan

Sin perfil previo, crear estado inicial. Usar clave propia versionada sin modificar otras claves. Revertir código conserva documento para futura compatibilidad; no borrar progreso en rollback.

## Open Questions

Precio y premio se ajustarán con observaciones de juego. Dificultad Normal y mejoras visuales/sonido se planificarán después de validar este ciclo.
