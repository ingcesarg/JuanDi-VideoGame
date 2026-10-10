## Context

El repositorio contiene `design-videogame.md` y la configuración OpenSpec, sin aplicación ni infraestructura previa. La propuesta introduce una primera partida completa de Club GOCA contra la máquina para Juan Diego y su papá. El alcance representa una etapa del producto: las decisiones del diseño completo siguen vigentes.

## Goals / Non-Goals

**Goals:**
- Permitir iniciar, disputar y terminar un partido 2 contra 2 a 15, con revancha.
- Probar acción contextual, movimiento, cambio de jugador, espacios libres y los dos poderes.
- Mostrar instrucciones y adaptaciones deportivas en español.
- Facilitar ajuste de física, tolerancia y comportamiento automático después de una prueba familiar.

**Non-Goals:**
- Otros tamaños, puntos, formatos y dificultades; multijugador, torneos y mapa.
- Créditos, tienda, guardado, aprendizaje, rompecabezas y desbloqueos.
- Apariencia realista final, fotografías, música y cambios automáticos de cámara.

## Decisions

### Aplicación y módulos

Usar JavaScript con módulos ES, HTML/CSS y Canvas 2D; Vite para servir y construir la aplicación, y el ejecutor de pruebas de Node para reglas puras. Alternativas: un motor 3D aproxima la presentación final pero añade complejidad antes de validar controles; un framework de interfaz aporta poco a estas tres pantallas. Canvas dibuja la cancha y DOM presenta botones, marcador, inventario e instrucciones accesibles. Recursos locales propios, sin servicios externos.

Separar entrada, simulación, reglas de partido, inventario, IA, renderizado e interfaz. Un archivo de configuración concentra constantes de balance. La simulación usa pasos fijos de 1/60 s y un límite de recuperación por frame; el renderizado usa requestAnimationFrame. Al perder foco se pausa, se borran teclas retenidas y se ofrece reanudar.

### Cancha y pelota

Usar coordenadas de suelo x/y, altura z para pelota y saltos y proyección oblicua fija. GOCA ocupa siempre el lado inferior; flechas mantienen orientación de pantalla. La pelota tiene gravedad, colisiones con suelo y red, límites de cancha y una indicación del aterrizaje estimado. Red, balón y cuatro jugadores permanecen visibles en ventanas de escritorio; el escalado conserva las coordenadas de juego.

Alternativa: vista lateral facilita física pero reduce lectura de espacios; cámara móvil agrega incertidumbre al apuntado. La vista provisional amplia permite observar el problema central.

### Entrada y acción contextual

Teclas provisionales: flechas mover/apuntar, Espacio acción, Tab cambiar jugador, Q alternar poder, E activar poder, Escape pausar. Interceptar desplazamiento y navegación de estas teclas únicamente mientras el partido tiene foco. La acción se registra al pulsar, sin repetición por mantener la tecla. Fuera del alcance o ventana de contacto, pulsar no teletransporta pelota ni jugador.

La secuencia ofensiva usa recepción, armado y remate según contactos; el saque es explícito desde estado de servicio. Cerca de la red, un salto defensivo puede bloquear una pelota rival. Las flechas en el instante de contacto determinan el objetivo dentro del campo rival; sin dirección se usa un objetivo central. Tab alterna entre los dos integrantes GOCA con indicación clara del activo.

### Reglas simplificadas y máquina

Estados: inicio → esperando saque → jugada → punto → esperando saque, o resultados si acaba el set. Pausa guarda el estado anterior. Una pelota que toca suelo dentro da el punto al rival de ese campo; fuera, al rival del último equipo que tocó; cuarto contacto da punto al rival. El bloqueo no aumenta contactos, reiniciados cuando cambia la posesión. Ganador del punto sirve, sin rotación ni doble contacto individual sancionado. No hay reloj, límite de puntos ni toques automáticos del jugador activo.

IA para compañero y dos rivales: elegir receptor por punto previsto de caída, mantener separación, acercarse a trayectoria alcanzable y generar recepción/armado/remate con la misma física y límites de alcance. El compañero puede resolver contactos; el activo requiere acción humana. Principiante usa velocidad y tolerancia generosas, con errores rivales ajustables; la IA no garantiza recuperar cualquier pelota.

Resaltar zonas del campo rival alejadas de sus dos jugadores usando distancias de suelo. El remate dirigido a una zona libre incrementa la estadística de buena colocación; no asegura punto. Mostrar simplificaciones en instrucciones y durante el partido.

### Poderes

Inventario inicial provisional: dos usos por tipo y selección visible. E consume uno y arma una mejora para la próxima acción compatible: salto/bloqueo o remate respectivamente. Cada activación aumenta la reserva de mejoras pendientes de ese tipo, sin sobrescribir usos; cada acción compatible consume una mejora. Súper salto aumenta altura y alcance vertical; remate potente aumenta velocidad de salida. La selección con Q no consume inventario. Sin stock, E solo muestra aviso; no existen temporizadores ni espera entre activaciones.

Un objeto por jugada aparece en una posición alcanzable del campo GOCA y concede un uso al recogerlo una sola vez; desaparece al acabar la jugada. Un punto ganado mediante remate a espacio libre concede un uso de remate potente una sola vez por punto. Son valores de balance provisionales, no decisiones creativas ya confirmadas. No se introducen créditos ni pérdida de inventario por tiempo.

### Resultados y reinicio

Mostrar ganador, marcador final, cantidad de remates bien colocados, mejor racha de puntos y un consejo basado en colocación. No mostrar progreso de inglés o rompecabezas aún inexistente. Revancha restablece marcador, contactos, posiciones, pelota, inventario, reservas de mejoras y estadísticas, sin duplicar bucle ni eventos.

## Risks / Trade-offs

- Proyección puede ocultar altura o contacto → sombra de pelota, indicación de recepción y ajuste de tolerancia con Juan Diego.
- Automatización puede restar control → no actuar por el jugador activo y mantener visible quién puede golpear.
- Poderes pueden dominar el partido → constantes ajustables y medir cómo cambia su facilidad, sin añadir espera temporal.
- Simplificación puede confundirse con voleibol real → texto visible sobre dos jugadores, ausencia de rotación y doble contacto individual no sancionado.
- Estética provisional se aleja del aspecto final → identificarla como prototipo y conservar personajes inventados.
- Pruebas de reglas no garantizan diversión → completar prueba jugable manual además de verificaciones automáticas.

## Migration Plan

Crear aplicación y herramientas en este repositorio, documentar ejecución local, ejecutar pruebas y construcción, y probar una partida completa en navegador. No hay datos que migrar ni despliegue externo solicitado; las revisiones de código permiten revertir la incorporación del prototipo.

## Open Questions

Durante la prueba con Juan Diego: confirmar teclas, tolerancia de contacto, claridad de apuntado, dificultad rival y balance de poderes. La frecuencia de objetos y las reservas pendientes se ajustarán según esa experiencia. Pausas educativas, conexión en línea y progresión se resolverán en cambios posteriores.
