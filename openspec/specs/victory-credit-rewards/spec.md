# victory-credit-rewards

## Purpose
Definir los contratos vigentes de victory-credit-rewards para JuanDiVoley.

## Requirements

### Requirement: Premio único por victoria
El sistema SHALL conceder un premio configurable de créditos al finalizar una victoria GOCA, inicialmente 10, exactamente una vez por identificador de partido. SHALL mostrar premio y saldo en resultados. Derrotas SHALL otorgar cero y no descontar saldo.

#### Scenario: Victoria repetidamente procesada
- **WHEN** se procesa varias veces el mismo resultado ganador
- **THEN** el saldo aumenta solo una vez en el premio configurado.

#### Scenario: Derrota
- **WHEN** GOCA pierde el partido
- **THEN** se muestra premio cero y se conserva el saldo anterior.
