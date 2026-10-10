# JuanDiVoley — Especificación de diseño

Diseño creado con Juan Diego (11 años) y su papá. Fecha: 9 de octubre de 2026.

Este documento sintetiza las decisiones de la conversación. Los valores todavía no elegidos se identifican como pendientes de ajuste; no son decisiones de Juan Diego.

## 1. Concepto y propósito

Videojuego de voleibol para computador, jugable desde un navegador web. Combina partidos fáciles de controlar, técnicas reales, poderes, torneos, rompecabezas e inglés. Sus referencias de experiencia son FIFA para controlar un equipo y los juegos de construcción para el interés inicial por armar; la construcción se concretó en rompecabezas, no en un mundo de bloques.

El jugador ayuda al **Club GOCA**, un antiguo club campeón, a recuperar su gloria. Empieza en una cancha de barrio con vecinos que animan y viaja por un mapa de ligas, enfrentando equipos con personalidades divertidas en lugares sorprendentes.

### Objetivos

- Divertirse jugando solo, con familiares o con amigos.
- Practicar observación y atención al reconocer espacios libres del rival.
- Aprender técnicas y estrategias de voleibol durante la experiencia.
- Practicar comprensión de inglés mediante misiones y conversaciones sobre voleibol y vida cotidiana.
- Mostrar progreso mediante resultados, medallas, desbloqueos y avances en los retos.

El progreso registrado corresponde a tareas del juego; no es una evaluación clínica de concentración ni una certificación de inglés.

## 2. Modos y configuración

| Aspecto | Decisión |
|---|---|
| Plataforma | Computador, navegador web |
| Participantes humanos | Uno o dos |
| Modalidades | Contra la máquina, contra otra persona, dos personas en el mismo equipo contra la máquina |
| Multijugador | En el mismo computador y por internet |
| Tamaño del equipo | Elegible: 2, 3, 4 o 6 jugadores por equipo |
| Puntos por set | 15 por defecto; configurable a 25 |
| Victoria de set | Alcanzar el objetivo con al menos dos puntos de ventaja |
| Formato de partido | Un set o ganar dos sets de un máximo de tres |
| Dificultad | Principiante, Normal y Experto disponibles desde el comienzo |
| Ajustes independientes | Voleibol, inglés y rompecabezas |

No hay duración de partido fijada por tiempo. Por ejemplo, con objetivo de 15, un 15–14 no termina el set; un 16–14 sí. No se ha elegido un límite máximo de puntos.

## 3. Controles y cooperación

- Flechas para mover al jugador controlado y dirigir el balón al golpear.
- Un botón de acción ejecuta el golpe adecuado al contexto: servicio, recepción, armado, remate o bloqueo. El jugador debe pulsarlo en el momento adecuado.
- Cambio de jugador como en FIFA; los compañeros no controlados se mueven mediante la máquina.
- Una tecla especial activa poderes disponibles.
- En cooperativo, cada persona tiene un grupo fijo de jugadores. Cambia entre miembros de su grupo; la máquina controla los restantes.
- Teclado compartido o dos teclados físicos con conjuntos de teclas diferentes. El diseño no depende de identificar cada teclado como un dispositivo separado.

**Por ajustar en el prototipo:** teclas exactas para cada participante, reparto de grupos, selección del poder cuando hay dos tipos disponibles, tolerancia del momento de golpe y comportamiento de las flechas durante cambios de cámara. La orientación de los controles debe ser consistente y probarse con Juan Diego.

## 4. Voleibol, atención y dificultad

Las técnicas reales conviven con poderes fantásticos. Observar la distribución rival y dirigir el remate a un espacio libre es una acción central.

| Dificultad de voleibol | Ayuda para leer espacios |
|---|---|
| Principiante | Espacios libres resaltados |
| Normal | Pistas visuales más pequeñas |
| Experto | Descubrir espacios sin esas ayudas |

La habilidad de los rivales y la exigencia del golpe se equilibrarán durante pruebas. Las reglas de rotación, cantidad de contactos, faltas y adaptación a equipos de 2, 3, 4 y 6 siguen pendientes de definición técnica y de jugabilidad. Se debe explicar cualquier simplificación para que el jugador distinga la regla deportiva de la adaptación del juego.

## 5. Poderes y créditos

Primera versión: **súper salto** y **remate potente**. Otros poderes se explorarán en una versión posterior.

- Los poderes se obtienen recogiendo objetos que aparecen en la cancha y completando buenas jugadas.
- Los créditos permiten adquirir poderes para llevar al partido.
- Los usos se acumulan en un inventario y solo pueden activarse si hay unidades disponibles.
- Cada activación consume un uso. Los límites dependen de la disponibilidad, **no del tiempo**: no se incluyen caducidad temporal ni espera entre usos como regla acordada.
- El efecto exacto por activación, precios, frecuencia de aparición y posibles máximos de inventario quedan para el balance del prototipo.

Se reciben créditos por partidos ganados y por retos completados. La idea inicial de apostar fue sustituida por este sistema de premios. No se ha acordado descontar créditos por perder. Cofres, compras de jugadores con créditos y otros beneficios mencionados inicialmente no forman parte del sistema final definido; el beneficio elegido fue comprar poderes.

## 6. Torneos, mapa y desafíos

### Torneos

- Oro al campeón, plata al segundo y bronce al tercero.
- Existe un partido para decidir el tercer puesto.
- Los torneos siguientes requieren una cantidad mínima de medallas según la dificultad.
- **Todas las medallas cuentan igual** para ese requisito; no se ponderan ni se exige una combinación de colores.
- El mapa combina lugares y ligas. Los nombres de los torneos, equipos rivales y cantidades mínimas de medallas se ajustarán posteriormente.

### Desafíos fuera de torneo

Se puede progresar sin disputar un torneo mediante objetivos combinados. Ejemplo aportado por Juan Diego: **ganar tres partidos seguidos y completar dos retos de inglés para desbloquear un estadio**. Es un ejemplo de misión; las cantidades del catálogo final deben equilibrarse.

Los retos de inglés y rompecabezas otorgan créditos y cuentan para los desafíos de desbloqueo.

**Por definir:** si repetir un torneo permite sumar nuevas medallas al requisito, quién conserva los premios en cooperativo y cómo se registra el progreso en enfrentamientos entre personas.

## 7. Personajes

Se eligen los jugadores antes de cada partido. La plantilla inicial contiene personajes inventados suficientes para formar equipos de hasta seis jugadores. Los nombres y atributos de esa plantilla quedan por diseñar.

| Personaje | Fortalezas elegidas | Desbloqueo |
|---|---|---|
| JuanDi | Saque, remate, defensa y lectura de espacios | Ganar el torneo más importante del mapa |
| CesarG (Dad) | Servicio, potencia y armado | Ganar el primer torneo |
| Xime (Mom) | Recepción y armado | Ganar el segundo torneo |

JuanDi es el personaje más difícil de obtener por sus capacidades y talento. Otros jugadores tienen fortalezas propias que lo complementan y mantienen interesante la selección.

### Apariencia y celebración

- Apariencia más realista, con celebraciones graciosas.
- Fotografías aportadas de CesarG, JuanDi y Xime como referencias visuales iniciales para sus personajes; no están incorporadas como archivos permanentes en este documento.
- Xime debe tener la apariencia bonita solicitada, tomando su fotografía como referencia.
- Celebración elegida para JuanDi: formar una L sobre la frente y bailar, descrita como el baile de «loser». Hacerlo hacia la cámara fue una propuesta del asistente, todavía no una decisión confirmada.
- Uniformes, estaturas relativas y celebraciones de los padres quedan por ajustar en la creación visual.

## 8. Inglés

- Nivel inicial declarado por Juan Diego: puede conversar un poco y quiere practicar más.
- Misiones con instrucciones en inglés y conversaciones con personajes.
- Respuestas mediante selección entre varias frases escritas en inglés.
- Posibilidad de escuchar las frases y pedir pistas en español.
- Si hay un error, ofrecer pistas y volver a intentar.
- Temas: voleibol, conversaciones y vida cotidiana.
- Aparece antes y después de los partidos como parte de la historia y en las pausas que correspondan al inglés.
- La dificultad se configura independientemente del voleibol.

Ejemplo de conversación aceptado: un rival pregunta **“What is your team’s strength?”** y el jugador elige una respuesta antes del partido. Las opciones, pistas y objetivos lingüísticos concretos deben redactarse para cada nivel.

Para evitar respuestas confusas, distinguir conversaciones narrativas con varias respuestas válidas de preguntas con un objetivo de comprensión y respuesta correcta. Es una recomendación de implementación.

## 9. Rompecabezas y alternancia

- Arrastrar piezas para completar una imagen de una técnica de voleibol: recepción, armado, remate o bloqueo.
- Principiante: 4 piezas; Normal: 9; Experto: 16.
- Preferencia por jugadores reales como **Yuji Nishida y Tomohiro Yamamoto**. Su inclusión depende de contar con material autorizado; entretanto pueden emplearse imágenes propias de técnicas como recurso provisional.
- Sin cronómetro fue una propuesta del asistente; no se recibió una elección explícita sobre este detalle.

### Regla de pausas

1. Alternar una pausa de rompecabezas y la siguiente de conversación en inglés.
2. Completar el reto presentado antes de continuar; ofrecer pistas e intentos adicionales.
3. Si el partido termina antes de incluir ambos tipos, continuar la alternancia en el siguiente partido. No añadir un reto extra al final para compensarlo.
4. En multijugador, cada pausa corresponde a una persona por turnos.

Las conversaciones narrativas antes o después del partido son distintas del reto alternado de pausa. En partidos de un set no hay pausas entre sets: no se agrega automáticamente un rompecabezas al terminar. Queda por precisar cómo ofrecer pausas de retos en una secuencia de partidos de un set y cómo coordinar los turnos en línea.

## 10. Cámara, sonido y pantallas

### Cámara

Referencias visuales aportadas: vista desde detrás del jugador para servicio y defensa, ángulos laterales para armado y vistas próximas a la red para ataque y bloqueo.

- Cambios automáticos según la acción con movimientos suaves.
- En multijugador local, vista amplia que permita ver a los dos participantes.
- Mantener visibles balón, red y jugador activo; comprobar que las transiciones no dificulten apuntar ni observar los espacios.
- Las capturas son referencias de cámara; no reemplazan la elección de apariencia realista.

### Música

Solo ambienta el juego. Se puede escoger el género. No hay retos musicales. El catálogo de géneros y pistas queda por elegir.

### Pantallas previstas

Inicio; elección de modo; configuración del partido y dificultades; selección de jugadores; mapa y ligas; partido con marcador e inventario de poderes; retos; compra de poderes; resultados y progreso.

La pantalla de resultados muestra en forma breve: resultado, mejores jugadas, un consejo y avance en inglés, rompecabezas y lectura de espacios.

## 11. Partida de ejemplo

1. Elegir jugadores inventados del Club GOCA y configurar un partido a 15 puntos, al mejor de tres.
2. Entrar al torneo del barrio y participar en una conversación de inglés relacionada con la historia.
3. Jugar usando flechas, acción contextual y cambio de jugador. Observar espacios rivales y conseguir poderes mediante objetos y buenas jugadas.
4. Tras el primer set, completar el rompecabezas. En dos personas, le corresponde al primer participante.
5. Si hay otra pausa, el segundo participante completa el reto de inglés. Si no la hay, ese tipo de reto queda para la próxima pausa de un partido posterior.
6. Terminar el partido cuando un equipo haya ganado dos sets; cada set exige dos puntos de ventaja.
7. Ver resultados y progreso; recibir créditos si se ganó y los obtenidos por retos completados.
8. Al ganar el primer torneo, recibir oro y desbloquear a CesarG. Al ganar el segundo, desbloquear a Xime; al ganar el principal, desbloquear a JuanDi.
9. Usar las medallas para abrir otros torneos y los créditos para comprar usos de poderes.

## 12. Historias de usuario y criterios de aceptación

- Como Juan Diego, quiero controlar un equipo con pocos botones para jugar sin memorizar una acción distinta por golpe.
- Como jugador, quiero observar espacios y recibir ayudas según la dificultad para practicar decisiones tácticas.
- Como estudiante de inglés, quiero escuchar opciones y pedir pistas para comprender y volver a intentar.
- Como familiar o amigo, quiero jugar por turnos los retos y controlar mi grupo de jugadores en cooperativo.
- Como jugador, quiero ver los requisitos de medallas y desafíos para decidir mi próximo objetivo.

### Comprobaciones del diseño implementado

- [ ] Se pueden seleccionar equipos de 2, 3, 4 y 6, partidos a 15 o 25 y ambos formatos de sets.
- [ ] Un marcador 15–14 no cierra un set a 15; 16–14 sí. Aplicar el mismo criterio a 25.
- [ ] Las tres dificultades están disponibles y se ajustan por separado para cada actividad.
- [ ] El botón contextual permite ejecutar las técnicas y las flechas dirigir el balón.
- [ ] Cada participante cooperativo cambia únicamente entre su grupo asignado.
- [ ] Sin usos disponibles no se activa el poder; al activarlo se descuenta exactamente uno, sin un bloqueo por tiempo añadido.
- [ ] Los colores de las medallas no alteran su valor para abrir torneos.
- [ ] CesarG, Xime y JuanDi se desbloquean en sus torneos correspondientes y pueden seleccionarse después.
- [ ] La alternancia de retos continúa entre partidos sin imponer uno extra al terminar.
- [ ] Los retos no dejan avanzar sin completarlos; hay pistas y reintentos y no se duplican créditos por repetir una respuesta del mismo reto.
- [ ] En inglés hay opciones escritas, audio y ayuda en español.
- [ ] La cámara local permite ver a ambos participantes.
- [ ] El resumen muestra resultados, consejo y progreso de forma comprensible para Juan Diego.

## 13. Validación y desarrollo posterior

Probar con Juan Diego y su papá el control contextual, el apuntado durante transiciones de cámara, la distribución cooperativa y la duración percibida de las pausas. Registrar partidas ganadas, retos completados, intentos y pistas utilizadas; comparar actividades de igual dificultad para mostrar avances. Preguntar si desean volver a jugar y qué les resultó confuso. No se han acordado metas numéricas de aprendizaje.

El alcance solicitado incluye multijugador local y por internet. Se pueden construir por etapas —primero controles y partido, luego progresión y aprendizaje, y después conexión en línea— sin eliminar esos requisitos del diseño final. No se ha fijado calendario ni tecnología de desarrollo.

Antes de implementar los módulos correspondientes, resolver con el prototipo: reglas deportivas simplificadas, organización de torneos, umbrales de medallas, balance de poderes y créditos, contenido por nivel de inglés, pausas en partidos de un set, guardado de progreso, conexión en línea y atribución de premios en multijugador. Estos detalles no cambian las decisiones creativas aquí recogidas.

## 14. Alcance reservado para futuras versiones

- Más poderes después de probar súper salto y remate potente.
- Construcción libre, retos musicales, respuestas de inglés por voz o escritura y compras con dinero real no fueron elegidos para el diseño actual.
- Fotografías de deportistas y semejanzas familiares se incorporarán a los recursos finales cuando se prepare su uso y apariencia; las referencias actuales no son modelos de personajes ya creados.

**Resultado de la fase de diseño:** concepto y decisiones principales completos. Juan Diego confirmó que no hay cambios pendientes en la partida de ejemplo ni ideas importantes que falte incluir. Este documento sirve como insumo para desarrollar y probar JuanDiVoley.
