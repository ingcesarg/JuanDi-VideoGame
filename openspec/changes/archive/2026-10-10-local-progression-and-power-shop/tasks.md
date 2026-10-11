## 1. Progreso local

- [x] 1.1 Añadir configuración de premio y precios y módulo de perfil versionado con almacenamiento inyectable.
- [x] 1.2 Validar perfil, recuperación y modo de sesión ante datos corruptos, versión desconocida y fallos de lectura/escritura.
- [x] 1.3 Probar recarga, valores inválidos y preservación del documento incompatible.

## 2. Premios y tienda

- [x] 2.1 Asignar identificador de partido y conceder premio único en victoria; mostrar cero en derrota sin descontar saldo.
- [x] 2.2 Implementar compra conjunta de saldo y reserva solo en inicio/resultados, con validación de saldo.
- [x] 2.3 Transferir reserva una vez al inicio y revancha, conservando inventario gratuito y preparados cero.
- [x] 2.4 Probar premios repetidos, derrota, compras consecutivas, saldo insuficiente, transferencia y fallos de persistencia.

## 3. Interfaz e integración

- [x] 3.1 Mostrar saldo, precio, reserva y controles accesibles de compra en inicio y resultados.
- [x] 3.2 Explicar consumo de reserva al iniciar y ausencia de guardado del partido; mostrar avisos de progreso temporal.
- [x] 3.3 Mantener pausa y foco del juego al interactuar con la tienda; conservar controles y premios por colocación/objetos.

## 4. Validación

- [x] 4.1 Ejecutar regresiones, pruebas del ciclo victoria-compra-partido, build y validación estricta OpenSpec.
- [x] 4.2 Verificar en navegador compras, recarga y revancha y registrar evidencia real.
- [x] 4.3 Actualizar README y guía de prueba; recoger feedback sobre claridad y balance antes de ajustar precios.

El usuario confirmó: «Resultado de la prueba exitosa. Continmua». Se acepta el resultado comunicado para claridad y balance; no se reportaron incidencias y se mantienen premio 10 y precio 5.
