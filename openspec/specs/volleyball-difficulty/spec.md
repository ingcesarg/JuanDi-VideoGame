# volleyball-difficulty

## Purpose
Definir los contratos vigentes de volleyball-difficulty para JuanDiVoley.

## Requirements

### Requirement: Selección previa y nivel fijo
El sistema SHALL ofrecer Principiante y Normal antes de iniciar y antes de revancha, con control accesible y explicación. SHALL iniciar por defecto en Principiante, conservar selección en sesión y mantener fijo el nivel del partido en curso. SHALL mostrar el nivel realmente jugado en cancha y resultados.

#### Scenario: Iniciar Normal
- **WHEN** el usuario selecciona Normal y comienza
- **THEN** se crea un partido Normal con etiqueta correspondiente.

#### Scenario: Cambiar para revancha
- **WHEN** en resultados el usuario cambia selección de Normal a Principiante
- **THEN** el resultado conserva etiqueta Normal y la siguiente revancha usa Principiante.

#### Scenario: Selección inválida
- **WHEN** se solicita un perfil desconocido
- **THEN** se usa Principiante sin impedir jugar.

### Requirement: Perfiles de desafío
Normal SHALL tener mayor velocidad rival y menor probabilidad de fallo que Principiante bajo condiciones equivalentes. Principiante SHALL conservar comportamiento actual. Ambos SHALL mantener controles humanos, apuntado, reglas, inventario y créditos existentes.

#### Scenario: Comparación controlada
- **WHEN** se comparan rivales de ambos niveles con posiciones y aleatoriedad equivalentes
- **THEN** Normal usa velocidad mayor y umbral de fallo menor sin crear contactos fuera de alcance.

#### Scenario: Premio en ambos niveles
- **WHEN** GOCA gana en cualquiera de los dos niveles
- **THEN** recibe el mismo premio único configurado y las compras y reserva siguen funcionando.
