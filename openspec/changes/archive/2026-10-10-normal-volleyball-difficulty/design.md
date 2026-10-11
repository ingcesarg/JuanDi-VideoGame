## Context

JavaScript/Canvas/Vite; Principiante usa velocidad rival 3 y probabilidad de fallo 0,16. El motor y el render leen constantes globales. Progresión acaba de validarse y conserva saldo/reserva por navegador.

## Goals / Non-Goals

**Goals:** elegir Principiante/Normal, elevar capacidad rival, reducir tamaño de pistas y mantener comportamiento base y contratos de progresión.

**Non-Goals:** Experto, cambiar tolerancia humana o ventana de apuntado, guardado de dificultad, premios distintos por nivel, arte y sonido.

## Decisions

- Perfiles de dificultad centralizados e inmutables; guardar el identificador en cada match y resolver perfil por partido. La alternativa de mutar CONFIG global mezclaría partidas y contaminaría pruebas.
- Principiante conserva velocidad 3, fallo 0,16 y tamaño actual de pistas. Normal comienza con velocidad 3,8, fallo 0,08 y escala 0,6 de pistas; valores de balance provisionales. No cambiar tamaño de zonas seleccionables de apuntado ni lógica de premios por colocación.
- Selector accesible antes de jugar y en resultados. Principiante inicial; selección vive en sesión, conserva la elección para revancha y admite cambiarla antes de comenzar. No modifica un partido existente ni el documento de progreso.
- createMatch admite configuración opcional sin romper su argumento de aleatoriedad usado en pruebas. Perfil desconocido vuelve a Principiante. IA usa velocidad/fallo del perfil; render usa escala de pista. Mantener dimensiones, físicas, poder, compañero y contacto humano.
- UI explica diferencia y muestra dificultad activa en lateral/resultados, evitando que cambiar selección de próxima partida reetiquete el resultado anterior.

## Risks / Trade-offs

- Normal demasiado exigente → comparación humana y ajuste solo con feedback.
- Cambios globales alteran Principiante → regresiones con aleatoriedad fija y comparación de perfiles.
- Pistas menores poco legibles → conservar color/texto y selección de zonas; comprobar navegador.

## Migration Plan

No migración de almacenamiento. Principiante sigue siendo valor por defecto; quitar el selector permite rollback sin afectar saldo o reserva.

## Open Questions

Velocidad, fallo y tamaño de pista se mantienen provisionales hasta prueba humana. Después se prepararán identidad visual y sonido.
