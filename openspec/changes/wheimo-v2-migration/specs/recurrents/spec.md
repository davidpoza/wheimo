## ADDED Requirements

### Requirement: Crear pago recurrente
El sistema SHALL permitir registrar pagos recurrentes identificados por nombre y emisor, opcionalmente vinculados a una transacción de referencia.

#### Scenario: Creación exitosa
- **WHEN** se realiza POST /api/recurrents con `{ name, amount, emitter, transactionId? }`
- **THEN** el sistema crea el pago recurrente y devuelve 201 con `{ id, name, amount, emitter, transactionId, createdAt }`

#### Scenario: Sin transacción de referencia
- **WHEN** se realiza POST /api/recurrents sin `transactionId`
- **THEN** el sistema crea el pago recurrente con `transactionId = null`

### Requirement: Listar pagos recurrentes
El sistema SHALL devolver todos los pagos recurrentes del usuario.

#### Scenario: Listado exitoso
- **WHEN** se realiza GET /api/recurrents con token JWT válido
- **THEN** el sistema devuelve 200 con array de pagos recurrentes

### Requirement: Actualizar pago recurrente
El sistema SHALL permitir actualizar los campos de un pago recurrente.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/recurrents/{id} con campos a modificar
- **THEN** el sistema actualiza los campos y devuelve 200 con el pago recurrente actualizado

### Requirement: Eliminar pago recurrente
El sistema SHALL eliminar un pago recurrente.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/recurrents/{id}
- **THEN** el sistema elimina el registro y devuelve 204 No Content

#### Scenario: No encontrado
- **WHEN** se realiza DELETE /api/recurrents/{id} con ID inexistente
- **THEN** el sistema devuelve 404 Not Found
