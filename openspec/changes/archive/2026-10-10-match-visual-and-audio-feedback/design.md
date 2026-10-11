## Context

Canvas 2D dibuja jugadores y cancha; acciones ya tienen posturas y texto. El bucle usa paso fijo y tiempo activo; pausa conserva apuntado. No hay audio. Se debe conservar legibilidad de Normal y Principiante y el progreso local validado.

## Goals / Non-Goals

**Goals:** presentación coherente, transiciones suaves, sonidos cortos reconocibles y controles accesibles. Todo sigue funcionando sin audio.

**Non-Goals:** música por géneros, cámara dinámica, assets externos, cambios de física, estilo realista definitivo, economía o dificultad.

## Decisions

- Refinar render procedural Canvas con proporciones, sombreado, uniformes diferenciados, balón con paneles y detalles discretos del barrio. Conservar números/nombres y círculo activo. Una sustitución por sprites/3D añade producción y dependencias fuera de esta entrega; no cambiar identidad a caricatura como decisión permanente.
- Animación derivada de estado de acción y tiempo de simulación, nunca modifica posición física. Posturas interpoladas, movimiento de piernas y señales breves de contacto/poder. Con movimiento reducido, eliminar oscilación y partículas decorativas pero conservar postura, texto y señales esenciales.
- Eventos de presentación estructurados con identificador monotónico por match, emitidos al ejecutar acción válida. Audio y partículas consumen cada evento una vez; render no dispara sonidos por frame ni analiza textos. Cola acotada y limpieza en revancha. No emitir sonido de golpe si no hubo contacto.
- Web Audio sintetiza tonos/ruido cortos originales y limitados en ganancia. Inicializar/resumir AudioContext solo tras gesto de usuario. Volumen por defecto 30 %, silencio por defecto activado hasta habilitación explícita. Botón de activar sonido y prueba corta permiten comprobar funcionamiento. Alternativa de grabaciones queda para diseño sonoro futuro.
- En pausa, pestaña oculta, pérdida de foco o silencio, detener fuentes y suspender audio; al reanudar no reproducir cola vieja. Fallos o ausencia de Web Audio muestran estado no disponible y nunca bloquean juego ni crean rechazos de promesas sin gestionar.
- Preferencias con clave versionada independiente de créditos; validar volumen 0–1 y booleanos, fallback seguro en fallo de almacenamiento. Movimiento reducido sigue inicialmente prefers-reduced-motion, con selector explícito. Controles accesibles en inicio/pausa/resultados o dialog de presentación que pausa; no permitir que flechas de volumen muevan al jugador.

## Risks / Trade-offs

- Efectos tapando balón/zonas → mantener efectos pequeños y debajo de información crítica.
- Sonidos repetitivos o altos → duración corta, volumen moderado, silencio inmediato y prueba humana.
- Restricción de autoplay → habilitación explícita y estado visible.
- Eventos duplicados al reanudar → consumo por id, vaciar backlog en pausa y tests de ciclo.

## Migration Plan

Sin migración del perfil de progreso. Nueva preferencia local independiente; revertir presentación conserva créditos y reserva. Sin descargas externas ni librerías nuevas.

## Open Questions

La comodidad del volumen y la distinción perceptiva de efectos requieren prueba humana. Música por géneros y acabado realista se diseñarán aparte.
