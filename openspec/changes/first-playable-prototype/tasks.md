## 1. Base de la aplicación

- [x] 1.1 Crear aplicación HTML/CSS/JavaScript modular con Vite y comandos de desarrollo, construcción y pruebas de Node.
- [x] 1.2 Definir configuración ajustable de cancha, física, alcance, tolerancia, IA y poderes, y modelos de partido, jugadores, pelota e inventario.
- [x] 1.3 Implementar inicio e instrucciones en español con controles provisionales, alcance del prototipo y simplificaciones deportivas.

## 2. Simulación y partido

- [x] 2.1 Implementar bucle de paso fijo, estados de saque/jugada/punto/resultados y pausa con reanudación explícita y limpieza de teclas.
- [x] 2.2 Implementar pelota con altura, gravedad, suelo, red y límites, y marcador con atribución por último contacto, cuarto toque y victoria a 15 con ventaja de dos.
- [x] 2.3 Implementar servicio humano inicial, servicio automático rival y preparación del siguiente saque para el ganador del punto.
- [x] 2.4 Dibujar cancha de barrio, cuatro personajes inventados, red, pelota, sombras e indicadores con proyección fija y escalado para escritorio.

## 3. Control e inteligencia automática

- [x] 3.1 Implementar flechas y Tab con límites del campo, indicador activo y prevención de desplazamiento o navegación solo durante control del partido.
- [x] 3.2 Implementar acción con Espacio por pulsación para recepción, armado, remate, saque y bloqueo, exigiendo alcance y tolerancia y apuntando según flechas.
- [x] 3.3 Implementar compañero y rivales que se posicionen y ejecuten contactos válidos sin actuar por el jugador humano activo.
- [x] 3.4 Implementar resaltado dinámico de espacios libres e identificación de remates bien colocados y rachas de puntos.

## 4. Poderes

- [x] 4.1 Implementar inventario inicial, selección con Q, activación con E, avisos sin stock y acumulación de mejoras pendientes sin caducidad ni espera.
- [x] 4.2 Aplicar y consumir una mejora compatible por salto/bloqueo o remate con efectos diferenciados y parámetros ajustables.
- [x] 4.3 Implementar objetos alcanzables por jugada y premio por punto con remate a espacio libre, evitando adjudicación duplicada y retirando objetos al resolver el punto.
- [x] 4.4 Mostrar en la interfaz cantidades disponibles, poder seleccionado y mejoras pendientes.

## 5. Resultados y documentación

- [x] 5.1 Implementar resumen con ganador, marcador, remates bien colocados, mejor racha y consejo, y revancha que reinicie todo el estado sin duplicar bucle ni eventos.
- [x] 5.2 Documentar en README cómo ejecutar, construir, probar y jugar, controles, alcance y diferencias respecto al diseño completo.

## 6. Verificación del prototipo

- [x] 6.1 Probar automáticamente marcador en 15–14, 16–14, 15–13 y extensión 30–29/31–29, adjudicación única por punto, fuera por último contacto y cuarto toque.
- [x] 6.2 Probar inventario vacío, dos activaciones consecutivas, persistencia entre puntos, consumo por acción compatible y recompensas únicas.
- [x] 6.3 Ejecutar pruebas y construcción; corregir fallos antes de dar por terminado el prototipo.
- [x] 6.4 Probar en navegador inicio, saque, intercambio, cambio de jugador, apuntado, bloqueo, poderes, pausa al perder foco, resultados y revancha; registrar lo verificado y limitaciones pendientes.
- [x] 6.5 Preparar una guía breve de prueba con Juan Diego y su papá para evaluar controles, lectura de espacios y balance; documentar ajustes pendientes sin atribuirles decisiones que no hayan confirmado.
