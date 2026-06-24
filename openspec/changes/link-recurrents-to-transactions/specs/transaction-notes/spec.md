## ADDED Requirements

### Requirement: Nota libre en transacción
Cada transacción SHALL tener un campo `note` (texto libre, nullable) que el usuario puede editar para documentar contexto sobre el importe o el origen del gasto. La nota SHALL ser persistida en la base de datos.

#### Scenario: Añadir nota a una transacción
- **WHEN** se hace PATCH `/transactions/{id}` con el campo `note`
- **THEN** el sistema devuelve 200 con la transacción actualizada incluyendo la `note`

#### Scenario: Borrar nota de una transacción
- **WHEN** se hace PATCH `/transactions/{id}` con `note: null` o `note: ""`
- **THEN** el sistema devuelve 200 con `note` como null

#### Scenario: La nota se incluye en la respuesta de transacciones
- **WHEN** se hace GET `/transactions` o GET `/transactions/{id}`
- **THEN** cada transacción incluye el campo `note` (string o null)

### Requirement: Nota indexada en búsqueda de transacciones
El sistema SHALL incluir el campo `note` en el índice de búsqueda de texto libre. Cuando el usuario filtra transacciones con el parámetro `search`, el sistema SHALL buscar coincidencias también en el campo `note`.

#### Scenario: Buscar por contenido de nota devuelve transacciones coincidentes
- **WHEN** se hace GET `/transactions?search=texto` y hay transacciones cuya `note` contiene "texto"
- **THEN** esas transacciones aparecen en los resultados aunque `emitterName`, `receiverName` y `description` no coincidan

#### Scenario: Búsqueda sin coincidencias en nota no devuelve resultados extra
- **WHEN** se hace GET `/transactions?search=xyz` y ninguna transacción tiene "xyz" en `note`, `emitterName`, `receiverName` ni `description`
- **THEN** el sistema devuelve 200 con array vacío

### Requirement: Nota visible y editable en detalle de transacción
La pantalla de detalle de transacción (modal o panel) SHALL mostrar el campo `note` y permitir al usuario editarlo y guardarlo sin necesidad de acciones adicionales (save inline o botón explícito).

#### Scenario: Ver nota en detalle de transacción
- **WHEN** el usuario abre el detalle de una transacción con `note` no nula
- **THEN** se muestra el contenido de la nota en un campo de texto

#### Scenario: Editar y guardar nota
- **WHEN** el usuario edita la nota y confirma (blur o botón guardar)
- **THEN** se llama al endpoint PATCH con la nueva nota y la UI refleja el valor actualizado
