## ADDED Requirements

### Requirement: Periodicidad mensual por día del mes
El sistema SHALL soportar el tipo de periodicidad `MONTHLY`, que indica que el gasto ocurre una vez al mes en el día del mes especificado por el campo `periodicityDay` (entero 1-31). Cuando el mes no tiene suficientes días (ej. febrero con día 30), el sistema SHALL usar el último día válido del mes.

#### Scenario: Crear artículo con periodicidad mensual
- **WHEN** se hace POST `/recurrents` con `periodicityType: "MONTHLY"` y `periodicityDay: 15`
- **THEN** el sistema devuelve 201 con el artículo creado incluyendo `periodicityType: "MONTHLY"` y `periodicityDay: 15`

#### Scenario: Actualizar artículo a periodicidad mensual
- **WHEN** se hace PATCH `/recurrents/{id}` con `periodicityType: "MONTHLY"` y `periodicityDay: 5`
- **THEN** el sistema devuelve 200 con el artículo actualizado con `periodicityType: "MONTHLY"` y `periodicityDay: 5`

#### Scenario: El listado incluye periodicityDay para artículos mensuales
- **WHEN** se hace GET `/recurrents`
- **THEN** los artículos con `periodicityType: "MONTHLY"` incluyen el campo `periodicityDay` con el día del mes configurado

### Requirement: Cálculo de próxima fecha para MONTHLY
El sistema SHALL calcular `nextPredictedDate` para artículos con `periodicityType: "MONTHLY"` como el próximo día-N del mes más cercano a la fecha actual. Si hoy es anterior al día N del mes actual, la próxima fecha es el día N del mes actual; en caso contrario, es el día N del mes siguiente.

#### Scenario: Próxima fecha en el mes actual
- **WHEN** hoy es 10 de junio y el artículo tiene `periodicityDay: 20`
- **THEN** `nextPredictedDate` es el 20 de junio del año actual

#### Scenario: Próxima fecha en el mes siguiente
- **WHEN** hoy es 25 de junio y el artículo tiene `periodicityDay: 15`
- **THEN** `nextPredictedDate` es el 15 de julio del año actual

#### Scenario: Clamping en meses cortos
- **WHEN** el artículo tiene `periodicityDay: 31` y el mes siguiente es febrero
- **THEN** `nextPredictedDate` usa el último día válido de febrero (28 o 29)

### Requirement: Artículos MONTHLY en la pantalla Upcoming
El sistema SHALL incluir los artículos con `periodicityType: "MONTHLY"` en el endpoint de upcoming cuando su próxima ocurrencia está dentro de los próximos 7 días (hoy incluido, día de la ocurrencia excluido).

#### Scenario: MONTHLY aparece en upcoming dentro de ventana
- **WHEN** hoy es 8 de junio y el artículo tiene `periodicityDay: 10`
- **THEN** el artículo aparece en GET `/recurrents/upcoming`

#### Scenario: MONTHLY no aparece en upcoming fuera de ventana
- **WHEN** hoy es 1 de junio y el artículo tiene `periodicityDay: 20`
- **THEN** el artículo NO aparece en GET `/recurrents/upcoming`

#### Scenario: MONTHLY sin periodicityDay no aparece en upcoming
- **WHEN** un artículo tiene `periodicityType: "MONTHLY"` pero `periodicityDay` es null
- **THEN** el artículo NO aparece en GET `/recurrents/upcoming`

### Requirement: Etiqueta de periodicidad mensual en el frontend
El frontend SHALL mostrar la etiqueta "Mensual (día X)" para artículos con `periodicityType: "MONTHLY"`, tanto en la lista de recurrentes como en la pantalla Upcoming.

#### Scenario: Etiqueta en lista de recurrentes
- **WHEN** un artículo tiene `periodicityType: "MONTHLY"` y `periodicityDay: 15`
- **THEN** la columna de periodicidad muestra "Mensual (día 15)"

#### Scenario: Etiqueta en pantalla Upcoming
- **WHEN** un artículo MONTHLY aparece en la sección Upcoming
- **THEN** el tag de periodicidad muestra "Mensual (día X)" con severidad distinta a ANNUAL y DAYS

### Requirement: Formulario de creación/edición con tipo MONTHLY
El frontend SHALL mostrar el selector de día del mes (1-31) cuando el usuario selecciona `periodicityType: "MONTHLY"` en el formulario de artículo recurrente. El campo SHALL ser obligatorio si el tipo es MONTHLY.

#### Scenario: Selector de día aparece al elegir MONTHLY
- **WHEN** el usuario selecciona "Mensual" en el selector de tipo de periodicidad
- **THEN** aparece un campo para seleccionar el día del mes (1-31)

#### Scenario: Formulario MONTHLY inválido sin día
- **WHEN** el usuario selecciona tipo MONTHLY y no indica el día del mes
- **THEN** el botón de guardar permanece deshabilitado

#### Scenario: Guardar artículo MONTHLY envía periodicityDay
- **WHEN** el usuario selecciona tipo MONTHLY con día 10 y guarda
- **THEN** se envía `periodicityType: "MONTHLY"` y `periodicityDay: 10` al backend
