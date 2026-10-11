## Why

El prototipo permite completar partidos, pero repetirlos no conserva progreso. Créditos por victoria y poderes comprados ofrecen un objetivo entre partidas, siguiendo el diseño del producto.

## What Changes

- Guardar créditos y reserva de poderes comprados en este navegador.
- Premiar cada victoria una sola vez; perder no resta créditos.
- Comprar usos de súper salto y remate potente antes del partido.
- Añadir los usos comprados al inventario inicial del siguiente partido, conservando los dos gratuitos por poder.
- Mostrar saldo, reserva, premio y avisos de guardado no disponible.
- Proponer balance inicial configurable: 10 créditos por victoria y 5 por uso.

Esta entrega no incluye torneos, retos educativos, cuentas, guardado de partidos en curso ni dinero real. Luego vendrán dificultad Normal y mejoras visuales y sonido, en changes separados.

## Capabilities

### New Capabilities
- `local-player-progress`: saldo y reserva persistentes, recuperación y fallo de almacenamiento.
- `victory-credit-rewards`: premio único por victoria, sin penalización por derrota.
- `power-shop`: compra previa y transferencia de reserva al próximo partido.

### Modified Capabilities
- `match-powers`: inventario inicial incorpora reserva comprada sin alterar preparación ni consumo.

## Impact

Frontend JavaScript/Canvas existente; resultados, inicio, configuración, inventario y nuevas funciones de progreso local. Usar localStorage sin dependencias ni servidor. Conservar controles, apuntado, puntuación, pausa y recompensas de objetos actuales.
