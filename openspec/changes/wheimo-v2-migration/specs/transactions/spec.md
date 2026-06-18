## ADDED Requirements

### Requirement: Crear transacción manual
El sistema SHALL permitir crear transacciones manualmente para cuentas propias. Si no se proporciona `balance`, SHALL calcularse sumando `amount` al balance actual de la cuenta. Si `draft` es true, el balance de la cuenta NO SHALL actualizarse.

#### Scenario: Creación exitosa con actualización de saldo
- **WHEN** se realiza POST /api/transactions con campos obligatorios (`accountId`, `amount`, `currency`, `date`, `valueDate`) para una cuenta propia
- **THEN** el sistema crea la transacción, actualiza el balance de la cuenta y devuelve 201 con la transacción incluyendo sus tags

#### Scenario: Creación como borrador
- **WHEN** se realiza POST /api/transactions con `draft: true`
- **THEN** el sistema crea la transacción pero NO actualiza el balance de la cuenta

#### Scenario: Creación con balance explícito
- **WHEN** se realiza POST /api/transactions con `balance` explícito
- **THEN** el sistema usa el balance proporcionado y NO actualiza el balance de la cuenta (se entiende como transacción histórica)

#### Scenario: Cuenta de otro usuario
- **WHEN** se realiza POST /api/transactions con `accountId` perteneciente a otro usuario
- **THEN** el sistema devuelve 403 Forbidden

### Requirement: Listar transacciones con filtros
El sistema SHALL devolver transacciones del usuario autenticado con soporte para los siguientes filtros (todos opcionales): `accountId`, `from` (fecha inicio), `to` (fecha fin), `tags` (array de IDs), `search` (texto en descripción/comentarios/emisor/receptor), `min`/`max` (importe absoluto), `operationType` (expense/income/all), `isFav`, `isDraft`, `hasAttachments`, `ids` (lista de IDs). Además deberá soportar paginación (`limit`, `offset`) y ordenación (`sort`: asc/desc por fecha).

#### Scenario: Listado sin filtros
- **WHEN** se realiza GET /api/transactions con token JWT válido
- **THEN** el sistema devuelve 200 con array de transacciones del usuario ordenadas por fecha desc

#### Scenario: Filtro por cuenta
- **WHEN** se realiza GET /api/transactions?accountId={id}
- **THEN** el sistema devuelve solo transacciones de esa cuenta (si pertenece al usuario)

#### Scenario: Filtro por rango de fechas
- **WHEN** se realiza GET /api/transactions?from=2024-01-01&to=2024-12-31
- **THEN** el sistema devuelve transacciones cuya `date` esté entre ambas fechas inclusive

#### Scenario: Filtro por etiquetas
- **WHEN** se realiza GET /api/transactions?tags=1,2,3
- **THEN** el sistema devuelve transacciones que tengan al menos una de esas etiquetas

#### Scenario: Filtro por texto
- **WHEN** se realiza GET /api/transactions?search=supermercado
- **THEN** el sistema devuelve transacciones con "supermercado" en description, comments, emitterName o receiverName (case-insensitive)

#### Scenario: Filtro por tipo de operación
- **WHEN** se realiza GET /api/transactions?operationType=expense
- **THEN** el sistema devuelve solo transacciones con `amount < 0`

#### Scenario: Filtro por importe
- **WHEN** se realiza GET /api/transactions?min=10&max=50
- **THEN** el sistema devuelve transacciones cuyo importe absoluto esté entre 10 y 50

#### Scenario: Paginación
- **WHEN** se realiza GET /api/transactions?limit=20&offset=40
- **THEN** el sistema devuelve un máximo de 20 transacciones a partir del registro 40

### Requirement: Obtener transacción por ID
El sistema SHALL devolver una transacción por su ID incluyendo sus etiquetas y adjuntos.

#### Scenario: Transacción encontrada
- **WHEN** se realiza GET /api/transactions/{id} siendo transacción del usuario
- **THEN** el sistema devuelve 200 con la transacción incluyendo `tags` y `attachments`

#### Scenario: Transacción no encontrada o de otro usuario
- **WHEN** se realiza GET /api/transactions/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Actualizar transacción
El sistema SHALL permitir actualizar cualquier campo de una transacción propia, incluyendo sus etiquetas (reemplaza el conjunto completo) y sus adjuntos.

#### Scenario: Actualización de campos básicos
- **WHEN** se realiza PATCH /api/transactions/{id} con campos a modificar
- **THEN** el sistema actualiza solo los campos proporcionados y devuelve 200 con la transacción actualizada

#### Scenario: Actualización de etiquetas
- **WHEN** se realiza PATCH /api/transactions/{id} con `tags: [1, 2]`
- **THEN** el sistema reemplaza el conjunto de etiquetas de la transacción por los IDs proporcionados

#### Scenario: Marcar como favorita
- **WHEN** se realiza PATCH /api/transactions/{id} con `favourite: true`
- **THEN** el sistema marca la transacción como favorita y la devuelve actualizada

### Requirement: Eliminar transacción individual
El sistema SHALL eliminar una transacción propia.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/transactions/{id} siendo transacción del usuario
- **THEN** el sistema elimina la transacción y devuelve 204 No Content

#### Scenario: Transacción no encontrada
- **WHEN** se realiza DELETE /api/transactions/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Eliminar múltiples transacciones
El sistema SHALL permitir eliminar un conjunto de transacciones propias en una sola operación.

#### Scenario: Eliminación masiva exitosa
- **WHEN** se realiza DELETE /api/transactions?ids=1,2,3 siendo transacciones del usuario
- **THEN** el sistema elimina todas las transacciones listadas y devuelve 204 No Content

### Requirement: Aplicar etiquetado automático a una transacción
El sistema SHALL re-aplicar todas las reglas de etiquetado del usuario sobre una transacción específica, añadiendo las etiquetas que correspondan.

#### Scenario: Aplicar etiquetas por reglas
- **WHEN** se realiza POST /api/transactions/{id}/apply-tags
- **THEN** el sistema evalúa todas las reglas del usuario contra la transacción y añade los tags correspondientes; devuelve 200

### Requirement: Aplicar etiquetas específicas a múltiples transacciones
El sistema SHALL permitir asignar una o más etiquetas específicas a un conjunto de transacciones en una sola operación.

#### Scenario: Etiquetado masivo exitoso
- **WHEN** se realiza POST /api/transactions/apply-specific-tags con `{ ids: [1,2,3], tagIds: [5,6] }`
- **THEN** el sistema añade los tags especificados a todas las transacciones indicadas y devuelve 200 con mapa `{ transactionId: [tags] }`

### Requirement: Calcular gastos por etiqueta
El sistema SHALL devolver el total de gastos (amount < 0) agrupado por etiqueta para un periodo dado.

#### Scenario: Cálculo de gastos por etiqueta
- **WHEN** se realiza GET /api/transactions/tags?from=2024-01-01&to=2024-12-31
- **THEN** el sistema devuelve un objeto con claves = tagId y valores = `{ name, amount }`. Las transacciones sin etiqueta aparecen bajo la clave `-1` con name `non-tagged`.

### Requirement: Calendario de gastos (heatmap data)
El sistema SHALL devolver totales de gasto agrupados por día o mes para un rango de fechas, excluyendo la etiqueta ignorada del usuario.

#### Scenario: Datos de heatmap por día
- **WHEN** se realiza GET /api/transactions/calendar?from=2024-01-01&to=2024-12-31&groupBy=day
- **THEN** el sistema devuelve array de `{ day: "YYYY-MM-DD", totalAmount }` excluyendo gastos de la etiqueta ignorada del usuario

#### Scenario: Datos de heatmap por mes
- **WHEN** se realiza GET /api/transactions/calendar?groupBy=month
- **THEN** el sistema devuelve array de `{ month: "YYYY-MM", totalAmount }`

### Requirement: Estadísticas de gastos
El sistema SHALL calcular estadísticas de gasto para un periodo: día más caro, día menos caro, total de gastos, mes más caro, mes menos caro, racha más larga sin gastos.

#### Scenario: Cálculo de estadísticas
- **WHEN** se realiza GET /api/transactions/statistics?from=2024-01-01&to=2024-12-31
- **THEN** el sistema devuelve `{ mostExpensiveAmount, mostExpensiveDay, leastExpensiveAmount, leastExpensiveDay, totalExpenses, mostExpensiveMonth, leastExpensiveMonth, longestRow, longestRowStart, longestRowEnd }`
