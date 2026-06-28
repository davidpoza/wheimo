## ADDED Requirements

### Requirement: Fecha de inicio de la serie
La entidad `Recurrent` SHALL tener un campo opcional `startDate` (fecha, nullable) que representa el ancla de la serie de gastos. El sistema SHALL aceptar `startDate` al crear (`POST /recurrents`) y al actualizar (`PATCH /recurrents/{id}`) un recurrente, y SHALL incluirlo en las respuestas DTO.

#### Scenario: Crear recurrente con fecha de inicio
- **WHEN** se hace POST `/recurrents` con `periodicityType` `DAYS`, `periodicity` y `startDate`
- **THEN** el sistema devuelve 201 con el recurrente creado incluyendo `startDate`

#### Scenario: Crear recurrente sin fecha de inicio
- **WHEN** se hace POST `/recurrents` sin `startDate`
- **THEN** el sistema devuelve 201 con `startDate` null

#### Scenario: Actualizar la fecha de inicio
- **WHEN** se hace PATCH `/recurrents/{id}` con un nuevo `startDate`
- **THEN** el sistema persiste el nuevo valor y recalcula `nextPredictedDate`

### Requirement: Cálculo del siguiente gasto a partir de la fecha de inicio
Para recurrentes de tipo `DAYS` con `periodicity` definida, el sistema SHALL calcular `nextPredictedDate` tomando como base, por orden de prioridad: (1) la fecha de la última transacción vinculada, (2) `startDate` si está definida, (3) `createdAt`. A partir de la base, el sistema SHALL avanzar repetidamente por `periodicity` días hasta obtener la primera ocurrencia que cae hoy o en el futuro, y devolver esa fecha como `nextPredictedDate`.

#### Scenario: Siguiente gasto desde una fecha de inicio en el pasado
- **WHEN** un recurrente `DAYS` tiene `periodicity` 30, `startDate` hace 95 días y ninguna transacción vinculada
- **THEN** `nextPredictedDate` es la primera ocurrencia de la serie (`startDate` + N·30 días) que cae hoy o en el futuro

#### Scenario: Fecha de inicio en el futuro
- **WHEN** un recurrente `DAYS` tiene `startDate` dentro de 10 días y ninguna transacción vinculada
- **THEN** `nextPredictedDate` es exactamente esa `startDate` (no se avanza por la periodicidad)

#### Scenario: La transacción vinculada tiene prioridad sobre la fecha de inicio
- **WHEN** un recurrente `DAYS` con `startDate` definida tiene una transacción vinculada posterior
- **THEN** la base del cálculo es la fecha de la última transacción vinculada, no `startDate`

#### Scenario: Recurrente sin fecha de inicio mantiene el comportamiento previo
- **WHEN** un recurrente `DAYS` no tiene `startDate` ni transacciones vinculadas
- **THEN** la base del cálculo es `createdAt`
