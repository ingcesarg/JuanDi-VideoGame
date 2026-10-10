## Context

Feedback familiar recibido el 10 de octubre de 2026: escasa diferencia perceptible entre salto y súper salto; activación de poderes y recogida poco claras; pausa confusa; Tab permite dejar demasiado control a la máquina; apuntado difícil. Es feedback cualitativo real, sin métricas ni aprobación del nuevo balance.

El prototipo usa JavaScript modular, Canvas, Vite y pruebas de Node. `input.js` ya ignora `event.repeat` para acciones: por tanto no basta con añadir ese filtro; hay que probar también pulsaciones discretas repetidas. `game.js` omite al jugador activo al ejecutar IA, de modo que cambiar el activo puede cambiar quién golpea automáticamente. Se investigará y reproducirá el comportamiento antes de corregirlo.

## Goals / Non-Goals

**Goals:** acciones legibles, seis destinos de ataque, preparación de poderes comprensible, recogida explícita, control humano conservado y pausa inequívoca.

**Non-Goals:** cámara móvil, gráficos realistas finales, audio obligatorio, nuevas dificultades, economía, torneos, guardado, multijugador y cambios de puntuación.

## Decisions

### 1. Apuntado asistido acotado

Se conserva el movimiento normal con flechas. Al pulsar Espacio durante una oportunidad válida de remate humano se entra en un subestado de apuntado y se reserva esa acción, sin contabilizar todavía un contacto ni consumir poderes. El atacante queda en su posición y la simulación completa (pelota, jugadores y física) avanza con el mismo factor ralentizado, evitando desincronización.

La cancha rival se divide en tres columnas y dos profundidades. Flechas cambian una selección discreta; por defecto centro profundo. Un objetivo y su etiqueta aparecen en cancha. Una nueva pulsación de Espacio confirma; mantener la tecla no confirma automáticamente. Se propone factor 0,15 y ventana máxima de 2 segundos reales como valores iniciales configurables, no como balance aprobado por la familia.

Al confirmar o vencer el plazo se intenta el golpe hacia la zona seleccionada. Se revalida alcance y contacto: no hay teletransporte ni golpe remoto. Si la pelota deja de ser elegible se cancela y se conserva el poder preparado. El destino central de zona usa margen respecto de líneas y red. No se garantiza ganar el punto. Solo se admite una ventana por oportunidad de ataque; no se puede acumular ralentización reabriéndola. La nueva oportunidad requiere otro armado o una nueva jugada.

Se descarta mantener movimiento y dirección sobre las mismas flechas simultáneamente por ser el problema reportado. El saque conserva su apuntado actual en esta entrega.

### 2. Acciones y poderes legibles

Cada poder muestra nombre, tecla, disponibles y preparados por separado. Q cambia exclusivamente la selección. E transfiere un uso de disponibles a preparados; conserva acumulación, sin caducidad ni cooldown. Solo una acción humana compatible ejecutada consume una preparación. Fallar el golpe no la consume.

La presentación distingue: salto normal con arco y sombra; súper salto con mayor altura visible y señal propia; bloqueo con brazos arriba cerca de la red; remate con gesto de golpe y destino. No depender solo de color. El remate potente añade trazo de pelota y rótulo y mantiene una diferencia medible de tiempo de vuelo a igual destino. El efecto no modifica silenciosamente la zona elegida.

Se reutilizan parámetros actuales de física cuando produzcan diferencias reales. Se mide altura máxima con la misma posición y condiciones; el súper salto debe superar el normal y alcanzar una pelota que el salto normal no alcanza en un fixture controlado. La legibilidad requiere además evaluación familiar, no solo números.

### 3. Recogida por contacto humano

Un objeto identifica el poder, muestra un área de recogida y una ayuda breve: «Pasa sobre él para recogerlo». Contacto horizontal del jugador activo con esa área durante juego normal recoge exactamente una vez. Compañero automático y rivales no recogen; saltar no impide recoger. Desaparece y aparece «+1 [poder] · pulsa E para preparar» si está seleccionado; si no, indicar seleccionar con Q primero. Incrementa disponibles, nunca preparados. Se conserva el premio por remate a espacio libre como origen distinto, con mensaje propio. No se generan recogidas durante apuntado ni pausa.

### 4. Responsabilidad humana por contacto

Separar jugador seleccionado de permiso de la IA para realizar el contacto. En cada secuencia humana el primer contacto (recepción) y tercero (ataque) requieren acción humana; el segundo puede realizarlo el compañero. El bloqueo humano sigue siendo opcional y no cuenta como contacto. Esta distribución explicita la secuencia del prototipo y evita que Tab convierta contactos humanos en automáticos.

Al cruzar una pelota rival al campo humano se inicia un turno de recepción humana y se conserva la selección actual. Tab permite elegir al otro personaje durante ese turno, pero ambos están impedidos de ejecutar automáticamente la recepción. En el armado automático el compañero puede golpear solo si no está seleccionado; si el usuario lo selecciona debe actuar con Espacio. Si cambia nuevamente, ese segundo contacto sí puede seguir siendo asistido, pero nunca se habilita un primer o tercer contacto automático. Tras el armado, el juego marca claramente «Tu ataque» y el jugador puede escoger atacante con Tab antes de abrir apuntado.

Durante apuntado se bloquea Tab con señal «Confirma el destino antes de cambiar» para no transferir una acción reservada. Cambiar fuera de apuntado limpia intentos pendientes del personaje saliente. No introducir cambios automáticos de personaje inesperados. Los rivales conservan su IA.

### 5. Pausa como estado explícito

Escape, pérdida de foco de ventana/cancha, pestaña oculta o apertura de instrucciones activan la misma pausa idempotente. La pantalla muestra motivo y botón «Seguir jugando». Volver a la ventana nunca reanuda por sí solo. El botón restaura foco, limpia teclas y reinicia la referencia temporal del bucle antes de continuar; no se simula el tiempo pasado fuera.

Si se pausa durante apuntado se conserva selección y tiempo restante. El reloj de apuntado es tiempo real activo, excluyendo pausa. Q/E/Tab/Espacio no alteran inventario ni partido mientras esté pausado. La pausa no sustituye resultados ni reinicia un punto.

### Módulos y pruebas

`input.js` normaliza acciones discretas y limpieza. `game.js` controla elegibilidad, turno humano y estados. `physics.js` conserva reglas de contacto. `powers.js` registra transferencias y consumo. `render.js` muestra señales; `main.js` gestiona foco e interfaz. `config.js` concentra balance.

Extraer helpers puros solo donde reduzcan complejidad. Evitar listeners duplicados al reiniciar. Temporizadores del apuntado se inyectan o avanzan explícitamente en pruebas, sin sleeps. Semilla o aleatoriedad controlada para fixtures de física. No introducir dependencias.

## Risks / Trade-offs

- Ralentización puede facilitar demasiado → una ventana por oportunidad, duración acotada y siguiente playtest.
- Impedir recepciones automáticas puede elevar dificultad → conservar IA de posicionamiento y armado, indicación «Tu recepción» y tolerancia configurable; no compensar con golpes humanos automáticos.
- Efectos pueden tapar la pelota → rótulos fuera de su trayectoria y trazos breves.
- Recogida distrae → indicación breve, sin obligación de recoger para continuar.
- Cambios de reloj pueden alterar física → escalar toda la simulación de forma uniforme y probar pausa durante apuntado.

## Migration Plan

Implementar localmente por tareas con regresiones sobre el prototipo. Actualizar instrucciones y guía familiar junto con controles. No editar la evidencia de verificación anterior como si cubriera esta versión: añadir un registro nuevo.

El change inicial sigue abierto y sus SPECs aún no son canónicas. Antes de sincronizar este change, verificar el estado del anterior y reconciliar explícitamente requisitos solapados. La nueva fase de apuntado sustituye la interpretación de flechas durante remates; las reglas de control humano refinan la asistencia original. No archivar ninguno automáticamente.

## Open Questions

Ajustar con la próxima prueba familiar duración/factor de apuntado, tolerancia de golpe, tamaño de efectos y radio de recogida. Los valores iniciales permiten implementar y probar; no representan preferencias familiares ya confirmadas.
