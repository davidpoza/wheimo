## ADDED Requirements

### Requirement: Crear etiqueta
El sistema SHALL permitir a un usuario autenticado crear etiquetas con un nombre único por usuario.

#### Scenario: Creación exitosa
- **WHEN** se realiza POST /api/tags con `{ name: "Supermercado" }` y token JWT válido
- **THEN** el sistema crea la etiqueta asociada al usuario y devuelve 201 con `{ id, name, createdAt }`

#### Scenario: Nombre vacío
- **WHEN** se realiza POST /api/tags con `name` vacío o ausente
- **THEN** el sistema devuelve 400 Bad Request

### Requirement: Listar etiquetas del usuario
El sistema SHALL devolver todas las etiquetas del usuario autenticado.

#### Scenario: Listado exitoso
- **WHEN** se realiza GET /api/tags con token JWT válido
- **THEN** el sistema devuelve 200 con array de `{ id, name, createdAt, updatedAt }`

### Requirement: Actualizar etiqueta
El sistema SHALL permitir actualizar el nombre de una etiqueta propia.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/tags/{id} con `{ name: "Nuevo nombre" }` siendo etiqueta del usuario
- **THEN** el sistema actualiza el nombre y devuelve 200 con la etiqueta actualizada

#### Scenario: Etiqueta no encontrada o de otro usuario
- **WHEN** se realiza PATCH /api/tags/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Eliminar etiqueta
El sistema SHALL eliminar una etiqueta propia. Las asociaciones con transacciones y reglas SHALL eliminarse en cascada.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/tags/{id} siendo etiqueta del usuario
- **THEN** el sistema elimina la etiqueta y sus asociaciones y devuelve 204 No Content

### Requirement: Crear regla de etiquetado
El sistema SHALL permitir crear reglas que asocien condiciones a una o más etiquetas. El tipo SHALL ser uno de: `emitterName`, `receiverName`, `description`, `isExpense`, `amount`, `card`, `isReceipt`, `account`, `currency`, `bankId`. El valor de la regla SHALL ser una expresión compatible con el tipo correspondiente.

#### Scenario: Creación de regla exitosa
- **WHEN** se realiza POST /api/rules con `{ name, type, value }` y token JWT
- **THEN** el sistema crea la regla asociada al usuario y devuelve 201

#### Scenario: Tipo de regla inválido
- **WHEN** se realiza POST /api/rules con un `type` no soportado
- **THEN** el sistema devuelve 400 Bad Request

#### Scenario: Nombre duplicado
- **WHEN** se realiza POST /api/rules con un `name` ya existente para ese usuario
- **THEN** el sistema devuelve 409 Conflict

### Requirement: Listar reglas del usuario
El sistema SHALL devolver todas las reglas del usuario incluyendo las etiquetas asociadas a cada regla.

#### Scenario: Listado con etiquetas
- **WHEN** se realiza GET /api/rules con token JWT válido
- **THEN** el sistema devuelve 200 con array de reglas, cada una incluyendo `tags: [{ id, name }]`

### Requirement: Actualizar regla
El sistema SHALL permitir actualizar los campos de una regla propia.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/rules/{id} con campos a modificar
- **THEN** el sistema actualiza los campos y devuelve 200 con la regla actualizada

### Requirement: Eliminar regla
El sistema SHALL eliminar una regla propia.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/rules/{id} siendo regla del usuario
- **THEN** el sistema elimina la regla y devuelve 204 No Content

### Requirement: Asociar etiquetas a una regla
El sistema SHALL permitir asociar o desasociar etiquetas a una regla mediante un endpoint específico. Cuando una regla se cumple para una transacción, TODAS las etiquetas asociadas SHALL aplicarse.

#### Scenario: Asociar etiqueta a regla
- **WHEN** se realiza POST /api/rules/{ruleId}/tags con `{ tagId }` siendo ambos del mismo usuario
- **THEN** el sistema añade la etiqueta a la regla y devuelve 200 con la regla actualizada

#### Scenario: Desasociar etiqueta de regla
- **WHEN** se realiza DELETE /api/rules/{ruleId}/tags/{tagId}
- **THEN** el sistema elimina la asociación y devuelve 204

### Requirement: Motor de evaluación de reglas
El sistema SHALL implementar la lógica de evaluación de reglas por tipo según estas especificaciones:
- `emitterName`, `receiverName`, `description`: match regex case-insensitive contra el campo correspondiente
- `currency`, `account`, `bankId`: igualdad exacta
- `amount`: expresión compuesta con operadores `gt`, `gte`, `lt`, `lte`, `eq` separados por `;` (ej: `gt10;lt50`)
- `isExpense`: `"true"` si `amount < 0`, `"false"` si `amount > 0`
- `isReceipt`: `"true"` si `receipt == true`, `"false"` si `receipt == false`
- Una transacción satisface una regla si cumple el criterio del tipo/valor. Cuando múltiples reglas apuntan al mismo tag, la transacción DEBE cumplir TODAS ellas (AND lógico).

#### Scenario: Regla por descripción
- **WHEN** se evalúa una transacción con `description = "MERCADONA SA"` contra regla `{ type: "description", value: "mercadona" }`
- **THEN** la evaluación devuelve `true` (match case-insensitive)

#### Scenario: Regla por importe compuesta
- **WHEN** se evalúa una transacción con `amount = -25` contra regla `{ type: "amount", value: "gt10;lt50" }`
- **THEN** la evaluación devuelve `true` (|amount| = 25, que es > 10 y < 50)

#### Scenario: Múltiples reglas para el mismo tag (AND)
- **WHEN** hay dos reglas asociadas al mismo tag y la transacción cumple solo una de ellas
- **THEN** la evaluación del tag devuelve `false` (se requiere cumplir TODAS)

### Requirement: Aplicación automática de etiquetas en importación
El sistema SHALL aplicar todas las reglas del usuario propietario de la cuenta sobre cada transacción recién importada.

#### Scenario: Etiquetado automático post-importación
- **WHEN** se importan nuevas transacciones para una cuenta de usuario
- **THEN** el sistema evalúa todas las reglas del usuario y aplica los tags correspondientes a cada transacción nueva

### Requirement: Etiqueta ignorada en analítica
El sistema SHALL permitir al usuario configurar una etiqueta especial (`ignoredTagId`) cuyas transacciones se excluirán de los cálculos de gastos en el heatmap y estadísticas.

#### Scenario: Configurar etiqueta ignorada
- **WHEN** se realiza PATCH /api/users/me con `{ ignoredTagId: 5 }` siendo 5 una etiqueta del usuario
- **THEN** el sistema actualiza `ignoredTagId` del usuario y las queries de analytics excluyen transacciones con ese tag
