## ADDED Requirements

### Requirement: Upload XLS via backend
El backend SHALL exponer un endpoint `POST /accounts/{accountId}/import/xls` que acepte un fichero multipart (`file`) y lo reenvíe al fetcher para su procesado.

El endpoint SHALL verificar que la cuenta pertenece al usuario autenticado antes de procesar el fichero.

El endpoint SHALL devolver un resumen con el número de transacciones importadas y el número de duplicados ignorados.

#### Scenario: Upload exitoso
- **WHEN** el usuario hace `POST /accounts/{accountId}/import/xls` con un fichero XLS válido
- **THEN** el sistema devuelve HTTP 200 con `{ imported: N, skipped: M }` donde N son transacciones nuevas y M son duplicados

#### Scenario: Cuenta no pertenece al usuario
- **WHEN** el usuario hace POST con un `accountId` que no le pertenece
- **THEN** el sistema devuelve HTTP 403

#### Scenario: Fichero inválido o no parseable
- **WHEN** el usuario sube un fichero que no es XLS válido o no tiene el formato esperado
- **THEN** el sistema devuelve HTTP 422 con mensaje de error descriptivo

### Requirement: Fetcher expone endpoint de parsing XLS
El fetcher SHALL exponer un endpoint HTTP interno `POST /import/xls` que acepte un fichero multipart junto con `accountId` y `userId` como parámetros de query.

El endpoint SHALL devolver la lista de `ImportedTransaction` normalizadas en formato JSON.

#### Scenario: Parsing exitoso
- **WHEN** el fetcher recibe un XLS de Openbank tarjeta bien formado
- **THEN** devuelve HTTP 200 con la lista de transacciones normalizadas con todos los campos: importId, amount, currency, date, valueDate, description, balance

#### Scenario: Fichero vacío o sin filas de datos
- **WHEN** el fetcher recibe un XLS sin filas de movimientos
- **THEN** devuelve HTTP 200 con lista vacía

#### Scenario: Error de parsing
- **WHEN** el fichero no puede parsearse como XLS
- **THEN** devuelve HTTP 422 con descripción del error

### Requirement: Deduplicación en reimportación
El sistema SHALL ignorar transacciones cuyo `importId` ya exista en la base de datos, permitiendo importar el mismo fichero varias veces sin crear duplicados.

El `importId` SHALL generarse como SHA-256 de `accountId|balance|date|description|amount`.

#### Scenario: Reimportación del mismo fichero
- **WHEN** el usuario sube el mismo fichero XLS por segunda vez
- **THEN** el sistema devuelve `{ imported: 0, skipped: N }` sin crear transacciones duplicadas

#### Scenario: Importación parcialmente nueva
- **WHEN** el usuario sube un fichero XLS que contiene movimientos ya importados y movimientos nuevos
- **THEN** el sistema importa solo los movimientos nuevos e ignora los ya existentes

### Requirement: Upload de XLS desde el frontend
El frontend SHALL proveer una pantalla de upload de fichero XLS accesible desde la vista de una cuenta.

#### Scenario: Upload y feedback al usuario
- **WHEN** el usuario selecciona un fichero XLS y confirma el upload
- **THEN** el frontend muestra el resultado de la importación indicando cuántos movimientos se importaron y cuántos se ignoraron por ser duplicados

#### Scenario: Error en el upload
- **WHEN** el backend devuelve un error (422 o 5xx)
- **THEN** el frontend muestra un mensaje de error legible al usuario
