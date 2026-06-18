## ADDED Requirements

### Requirement: Crear presupuesto
El sistema SHALL permitir al usuario crear un presupuesto para una etiqueta propia, definiendo un importe máximo de gasto y un rango de fechas.

#### Scenario: Creación exitosa
- **WHEN** se realiza POST /api/budgets con `{ tagId, value, start, end }` siendo `tagId` una etiqueta del usuario
- **THEN** el sistema crea el presupuesto y devuelve 201 con `{ id, tagId, value, start, end, createdAt }`

#### Scenario: tagId de otro usuario
- **WHEN** se realiza POST /api/budgets con un `tagId` que no pertenece al usuario autenticado
- **THEN** el sistema devuelve 403 Forbidden

#### Scenario: Fechas inválidas
- **WHEN** `start` es posterior a `end`
- **THEN** el sistema devuelve 400 Bad Request

### Requirement: Listar presupuestos del usuario
El sistema SHALL devolver todos los presupuestos del usuario, accesibles a través de las etiquetas propias.

#### Scenario: Listado exitoso
- **WHEN** se realiza GET /api/budgets con token JWT válido
- **THEN** el sistema devuelve 200 con array de presupuestos del usuario incluyendo la etiqueta asociada `{ id, value, start, end, tag: { id, name } }`

### Requirement: Obtener presupuesto por ID
El sistema SHALL devolver un presupuesto por ID si pertenece al usuario.

#### Scenario: Presupuesto encontrado
- **WHEN** se realiza GET /api/budgets/{id} siendo presupuesto del usuario
- **THEN** el sistema devuelve 200 con el presupuesto

#### Scenario: No encontrado
- **WHEN** se realiza GET /api/budgets/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Actualizar presupuesto
El sistema SHALL permitir actualizar el importe o el rango de fechas de un presupuesto propio.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/budgets/{id} con campos a modificar
- **THEN** el sistema actualiza los campos y devuelve 200 con el presupuesto actualizado

### Requirement: Eliminar presupuesto
El sistema SHALL eliminar un presupuesto propio.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/budgets/{id} siendo presupuesto del usuario
- **THEN** el sistema elimina el presupuesto y devuelve 204 No Content

### Requirement: Seguimiento de gasto real vs presupuestado
El sistema SHALL calcular el gasto real acumulado para la etiqueta de un presupuesto dentro de su rango de fechas, comparándolo con el valor del presupuesto.

#### Scenario: Consulta de seguimiento de presupuesto
- **WHEN** se realiza GET /api/budgets/{id}/status
- **THEN** el sistema devuelve `{ budget: { id, value, tag }, spent: <total gastos en el rango>, remaining: <value - spent>, percentUsed: <(spent/value)*100> }`

#### Scenario: Presupuesto superado
- **WHEN** el gasto real supera el valor del presupuesto
- **THEN** `remaining` es negativo y `percentUsed` es mayor que 100
