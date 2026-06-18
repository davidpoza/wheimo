## ADDED Requirements

### Requirement: Subir adjunto a una transacción
El sistema SHALL permitir subir archivos (imágenes o PDF) y asociarlos a una transacción propia. Los archivos SHALL almacenarse en disco local con nombre único. El campo `type` SHALL registrar el MIME type del archivo.

#### Scenario: Subida exitosa
- **WHEN** se realiza POST /api/attachments con multipart/form-data incluyendo el archivo y `transactionId` de una transacción del usuario
- **THEN** el sistema guarda el archivo en disco, crea el registro en base de datos y devuelve 201 con `{ id, filename, description, type, transactionId, createdAt }`

#### Scenario: Transacción de otro usuario
- **WHEN** se intenta subir un adjunto a una transacción que no pertenece al usuario autenticado
- **THEN** el sistema devuelve 403 Forbidden

#### Scenario: Tipo de archivo no permitido
- **WHEN** se sube un archivo de tipo no soportado (ej: .exe)
- **THEN** el sistema devuelve 400 Bad Request

### Requirement: Obtener adjunto
El sistema SHALL servir el archivo binario del adjunto al usuario propietario.

#### Scenario: Descarga exitosa
- **WHEN** se realiza GET /api/attachments/{id} siendo adjunto de una transacción del usuario
- **THEN** el sistema devuelve el archivo binario con el Content-Type correcto

#### Scenario: Adjunto no encontrado o de otro usuario
- **WHEN** se realiza GET /api/attachments/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Actualizar descripción de adjunto
El sistema SHALL permitir actualizar la descripción de un adjunto propio.

#### Scenario: Actualización exitosa
- **WHEN** se realiza PATCH /api/attachments/{id} con `{ description: "Factura supermercado" }`
- **THEN** el sistema actualiza la descripción y devuelve 200 con el adjunto actualizado

### Requirement: Eliminar adjunto
El sistema SHALL eliminar el registro del adjunto y el archivo físico del disco.

#### Scenario: Eliminación exitosa
- **WHEN** se realiza DELETE /api/attachments/{id} siendo adjunto del usuario
- **THEN** el sistema elimina el registro de base de datos y el archivo físico y devuelve 204 No Content

#### Scenario: Adjunto no encontrado
- **WHEN** se realiza DELETE /api/attachments/{id} con ID inexistente o de otro usuario
- **THEN** el sistema devuelve 404 Not Found

### Requirement: Listar adjuntos de una transacción
El sistema SHALL incluir los adjuntos al obtener el detalle de una transacción (como parte del objeto transacción).

#### Scenario: Transacción con adjuntos
- **WHEN** se realiza GET /api/transactions/{id}
- **THEN** la respuesta incluye `attachments: [{ id, filename, description, type, createdAt }]`

#### Scenario: Transacción sin adjuntos
- **WHEN** la transacción no tiene adjuntos
- **THEN** la respuesta incluye `attachments: []`

### Requirement: Asociar adjunto existente a transacción
El sistema SHALL permitir vincular un adjunto a una transacción mediante la actualización de la transacción.

#### Scenario: Asociación mediante PATCH de transacción
- **WHEN** se realiza PATCH /api/transactions/{id} con `{ attachments: [attachmentId] }`
- **THEN** el sistema actualiza el `transactionId` del adjunto indicado y lo asocia a la transacción
