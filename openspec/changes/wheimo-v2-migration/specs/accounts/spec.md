## ADDED Requirements

### Requirement: Crear cuenta bancaria
El sistema SHALL permitir a un usuario autenticado crear cuentas bancarias. El campo `bankId` SHALL ser uno de: `opbk`, `nordigen`, `opbkprepaid`, `wallet`, `piggybank`. Las credenciales `accessPassword` SHALL cifrarse con AES-256 antes de persistirse.

#### Scenario: Creación exitosa
- **WHEN** se realiza POST /api/accounts con `name`, `number`, `bankId` válidos y token JWT
- **THEN** el sistema crea la cuenta asociada al userId del token y devuelve 201 con el objeto cuenta

#### Scenario: bankId inválido
- **WHEN** se realiza POST /api/accounts con un `bankId` no soportado
- **THEN** el sistema devuelve 400 Bad Request

#### Scenario: Credenciales cifradas en reposo
- **WHEN** se crea una cuenta con `accessPassword`
- **THEN** el valor almacenado en base de datos SHALL estar cifrado (AES-256)

### Requirement: Listar cuentas del usuario
El sistema SHALL devolver todas las cuentas pertenecientes al usuario autenticado. Las credenciales (`accessPassword`) NO SHALL incluirse en la respuesta.

#### Scenario: Listado exitoso
- **WHEN** se realiza GET /api/accounts con token JWT válido
- **THEN** el sistema devuelve 200 con array de cuentas del usuario (sin accessPassword)

#### Scenario: Usuario sin cuentas
- **WHEN** el usuario no tiene cuentas creadas
- **THEN** el sistema devuelve 200 con array vacío `[]`

### Requirement: Obtener cuenta por ID
El sistema SHALL permitir obtener el detalle de una cuenta propia por ID.

#### Scenario: Cuenta encontrada
- **WHEN** se realiza GET /api/accounts/{id} siendo {id} una cuenta del usuario autenticado
- **THEN** el sistema devuelve 200 con el objeto cuenta

#### Scenario: Cuenta no encontrada o de otro usuario
- **WHEN** se realiza GET /api/accounts/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Actualizar cuenta
El sistema SHALL permitir actualizar cualquier campo de una cuenta propia. Si se actualiza `accessPassword`, SHALL cifrarse de nuevo.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/accounts/{id} con campos válidos
- **THEN** el sistema actualiza solo los campos proporcionados y devuelve 200 con la cuenta actualizada

#### Scenario: Actualizar configuración de ahorro
- **WHEN** se realiza PATCH /api/accounts/{id} con `savingTargetAmount`, `savingFrequency`, `savingInitDate`, `savingTargetDate`
- **THEN** el sistema persiste los datos de ahorro y los incluye en la respuesta

#### Scenario: Actualizar settings de banco (nordigen)
- **WHEN** se realiza PATCH /api/accounts/{id} con `settings: { nordigenAccountId, nordigenLink, nordigenRequisitionId, nordigenRequisitionEndDate }`
- **THEN** el sistema almacena el JSON de settings y lo devuelve en la respuesta

### Requirement: Eliminar cuenta
El sistema SHALL eliminar una cuenta propia y todas sus transacciones asociadas (CASCADE).

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/accounts/{id} siendo cuenta del usuario
- **THEN** el sistema elimina la cuenta y sus transacciones y devuelve 204 No Content

#### Scenario: Cuenta no encontrada
- **WHEN** se realiza DELETE /api/accounts/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Sincronización de transacciones bancarias (trigger)
El sistema SHALL permitir iniciar la sincronización de una cuenta bancaria mediante un endpoint REST. La sincronización real se realizará de forma asíncrona a través del microservicio `wheimo-fetcher`.

#### Scenario: Trigger de sincronización exitoso
- **WHEN** se realiza POST /api/accounts/{id}/resync con `{ from: "YYYY-MM-DD" }` para una cuenta con bankId soportado
- **THEN** el sistema publica un mensaje en Redis con `{ accountId, userId, from }` y devuelve 202 Accepted

#### Scenario: Cuenta sin credenciales
- **WHEN** se realiza POST /api/accounts/{id}/resync para una cuenta que no tiene `accessId` o `accessPassword`
- **THEN** el sistema devuelve 400 Bad Request con mensaje descriptivo

#### Scenario: bankId manual (wallet/piggybank)
- **WHEN** se realiza POST /api/accounts/{id}/resync para una cuenta con bankId `wallet` o `piggybank`
- **THEN** el sistema devuelve 400 Bad Request (no se puede sincronizar cuentas manuales)

### Requirement: Corrección de saldos
El sistema SHALL permitir recalcular los saldos de todas las transacciones de una cuenta a partir de una transacción inicial, actualizando la secuencia de saldos correctamente.

#### Scenario: Fix balances exitoso
- **WHEN** se realiza POST /api/accounts/fix-balances con `{ accountId, fromTransactionId, initialBalance }`
- **THEN** el sistema recalcula y actualiza los saldos de todas las transacciones a partir de `fromTransactionId` y devuelve 204

#### Scenario: Regenerar solo importIds
- **WHEN** se realiza POST /api/accounts/fix-balances con `{ accountId, fromTransactionId, onlyRegenerateImportId: true }`
- **THEN** el sistema recalcula los `importId` de las transacciones afectadas sin modificar saldos y devuelve 204
