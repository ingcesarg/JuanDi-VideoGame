## Why

El prototipo validado solo ofrece Principiante. Un nivel Normal permite aumentar el desafío manteniendo el ciclo de progresión y la lectura de espacios definidos en el diseño del producto.

## What Changes

- Selector Principiante/Normal antes de iniciar y desde resultados antes de revancha.
- Normal: rivales con mayor velocidad y menor probabilidad de error; pistas visuales de espacios más pequeñas.
- Conservar Principiante como valor inicial y su comportamiento actual.
- Mantener dificultad fija durante cada partido, con etiqueta visible y explicación previa.
- Conservar apuntado, contactos humanos, poderes, tienda, reglas y premio de victoria actual.

No incluye Experto, dificultad de actividades educativas, cambios de economía, arte ni audio. Las mejoras visuales y sonido serán el siguiente change.

## Capabilities

### New Capabilities
- `volleyball-difficulty`: selección, perfiles y conservación de dificultad durante el partido.

### Modified Capabilities
- `prototype-match`: inicio permite Principiante o Normal.
- `volleyball-controls`: ayuda de espacios cambia de tamaño según dificultad.

## Impact

Configuración, creación de partidos, IA rival, render de espacios, pantallas de inicio/resultados y pruebas. JavaScript/Canvas/Vite, sin nuevas dependencias. El perfil de progreso local no cambia de versión ni persiste la selección de dificultad.
