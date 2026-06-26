## ADDED Requirements

### Requirement: Endpoint de próximos gastos recurrentes
El sistema SHALL exponer `GET /recurrents/upcoming` que devuelve los recurrentes que cumplen la condición de proximidad temporal según su tipo de periodicidad.

#### Scenario: Recurrente anual visible en los 7 días previos a su mes
- **WHEN** existe un recurrente con `periodicityType = ANNUAL`, `periodicityMonth = M`, y la fecha actual está entre el día 1 del mes M menos 7 días y el día 1 del mes M (exclusive)
- **THEN** `GET /recurrents/upcoming` incluye ese recurrente en la respuesta

#### Scenario: Recurrente anual no visible fuera de la ventana de 7 días
- **WHEN** existe un recurrente con `periodicityType = ANNUAL` y la fecha actual está a más de 7 días del inicio de su mes configurado
- **THEN** `GET /recurrents/upcoming` NO incluye ese recurrente en la respuesta

#### Scenario: Recurrente anual no visible una vez iniciado su mes
- **WHEN** existe un recurrente con `periodicityType = ANNUAL` y la fecha actual es posterior o igual al día 1 del mes configurado
- **THEN** `GET /recurrents/upcoming` NO incluye ese recurrente en la respuesta

#### Scenario: Ventana de 7 días cruza año nuevo
- **WHEN** existe un recurrente con `periodicityType = ANNUAL` y `periodicityMonth = 1` (enero) y la fecha actual es el 27 de diciembre o posterior
- **THEN** `GET /recurrents/upcoming` incluye ese recurrente en la respuesta

#### Scenario: Recurrente por días dentro de ventana aparece
- **WHEN** existe un recurrente con `periodicityType = DAYS`, `periodicity` definido, y su `nextPredictedDate` está a menos de 48h en el pasado o futuro respecto a ahora
- **THEN** `GET /recurrents/upcoming` incluye ese recurrente en la respuesta

#### Scenario: Recurrente por días fuera de ventana no aparece
- **WHEN** existe un recurrente con `periodicityType = DAYS` y su `nextPredictedDate` está a más de 48h de distancia (pasado o futuro)
- **THEN** `GET /recurrents/upcoming` NO incluye ese recurrente en la respuesta

#### Scenario: Recurrente por días sin periodicity no aparece
- **WHEN** existe un recurrente con `periodicityType = DAYS` y `periodicity` es null
- **THEN** `GET /recurrents/upcoming` NO incluye ese recurrente en la respuesta

### Requirement: Pantalla "Próximos gastos" en el frontend
El sistema SHALL mostrar una pantalla en la ruta `/upcoming` que liste los gastos recurrentes devueltos por `GET /recurrents/upcoming`.

#### Scenario: Navegación a pantalla de próximos gastos
- **WHEN** el usuario hace clic en el ítem "Próximos gastos" del menú de navegación
- **THEN** el sistema navega a `/upcoming` y muestra la lista de recurrentes próximos

#### Scenario: Pantalla vacía sin gastos próximos
- **WHEN** no hay recurrentes que cumplan las condiciones de proximidad
- **THEN** la pantalla muestra un mensaje indicando que no hay gastos próximos

#### Scenario: Lista de próximos muestra datos relevantes
- **WHEN** hay recurrentes próximos
- **THEN** cada ítem muestra nombre, establecimiento, importe y tipo de periodicidad
