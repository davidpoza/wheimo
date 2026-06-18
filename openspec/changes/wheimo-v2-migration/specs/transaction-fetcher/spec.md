## ADDED Requirements

### Requirement: Consumir mensajes de sincronización desde Redis
El microservicio `wheimo-fetcher` SHALL escuchar continuamente el canal Redis `sync-requests`. Cada mensaje SHALL contener `{ accountId, userId, from, bankId, accessId, encryptedPassword, settings }`. Al recibir un mensaje, SHALL iniciar el proceso de importación para esa cuenta.

#### Scenario: Consumo de mensaje de sync
- **WHEN** `wheimo-api` publica un mensaje en el canal Redis `sync-requests`
- **THEN** `wheimo-fetcher` lo consume, identifica el importer adecuado por `bankId` y ejecuta la importación

#### Scenario: bankId no soportado
- **WHEN** el mensaje contiene un `bankId` sin importer disponible (`wallet`, `piggybank`)
- **THEN** `wheimo-fetcher` publica un error en `sync-results` y no lanza excepción no controlada

### Requirement: Importer Nordigen
El sistema SHALL conectar con la API abierta de Nordigen (GoCardless Open Banking) para importar transacciones. El proceso SHALL: (1) generar token con `accessId`/`accessPassword`, (2) obtener detalles de cuenta y transacciones bookadas, (3) parsear el campo `remittanceInformationUnstructured` para extraer emisor, receptor, concepto y tarjeta, (4) calcular saldos parciales (Nordigen no los provee por transacción).

#### Scenario: Importación Nordigen exitosa
- **WHEN** se recibe mensaje con `bankId = "nordigen"` y credenciales válidas
- **THEN** el importer autentica, obtiene las transacciones desde `from` date, las parsea y publica el resultado en `sync-results`

#### Scenario: Parseo de remittanceInformationUnstructured
- **WHEN** el campo contiene `"TRANSFERENCIA A FAVOR DE JUAN GARCÍA, CONCEPTO pago alquiler"`
- **THEN** el importer extrae `receiverName = "JUAN GARCÍA"` y `description = "pago alquiler"`

#### Scenario: Cálculo de saldos parciales Nordigen
- **WHEN** se importan N transacciones nuevas para una cuenta Nordigen
- **THEN** el importer calcula el saldo de cada transacción acumulando desde el saldo actual de la cuenta (última transacción conocida), iterando en orden cronológico ascendente

#### Scenario: Credenciales inválidas Nordigen
- **WHEN** el token de Nordigen falla por credenciales incorrectas
- **THEN** el importer publica un mensaje de error en `sync-results` con `{ accountId, error: "login_failed" }`

### Requirement: Importer Openbank (opbk)
El sistema SHALL autenticarse en la API privada de Openbank usando `accessId` y `accessPassword` (descifrada), obtener las transacciones del contrato/producto configurado y devolver el listado normalizado.

#### Scenario: Importación Openbank exitosa
- **WHEN** se recibe mensaje con `bankId = "opbk"` y credenciales válidas
- **THEN** el importer autentica contra Openbank, obtiene transacciones desde `from` date y publica resultado en `sync-results`

#### Scenario: Sesión expirada Openbank
- **WHEN** el login de Openbank falla por credenciales incorrectas o sesión inválida
- **THEN** el importer publica error en `sync-results` con `{ accountId, error: "login_failed" }`

### Requirement: Importer Openbank Prepaid (opbkprepaid)
El sistema SHALL importar transacciones de la tarjeta de prepago Openbank usando la misma autenticación pero endpoint distinto y parsing específico para tarjetas prepago.

#### Scenario: Importación Openbank Prepaid exitosa
- **WHEN** se recibe mensaje con `bankId = "opbkprepaid"` y settings con `pan` de la tarjeta
- **THEN** el importer obtiene transacciones de la tarjeta prepago y publica resultado en `sync-results`

### Requirement: Deduplicación de transacciones
El sistema SHALL generar un `importId` único por transacción basado en `accountId`, `balance`, `date` y `description`. `wheimo-api` SHALL ignorar transacciones con `importId` ya existente en base de datos.

#### Scenario: Transacción ya importada
- **WHEN** se intenta importar una transacción con `importId` ya existente en la tabla `transactions`
- **THEN** `wheimo-api` descarta esa transacción sin error

#### Scenario: Transacción nueva
- **WHEN** el `importId` no existe en la base de datos
- **THEN** `wheimo-api` persiste la transacción

### Requirement: Publicar resultados de importación en Redis
Tras completar la importación (con éxito o error), `wheimo-fetcher` SHALL publicar en el canal Redis `sync-results` un mensaje con `{ accountId, userId, transactions: [...], balance, error? }`.

#### Scenario: Publicación de resultado exitoso
- **WHEN** la importación termina con éxito
- **THEN** se publica en `sync-results` `{ accountId, userId, transactions: [{ importId, amount, currency, date, valueDate, description, emitterName, receiverName, assCard, receipt, balance }], balance }`

#### Scenario: Publicación de error
- **WHEN** la importación falla (login, red, parse)
- **THEN** se publica en `sync-results` `{ accountId, userId, error: "<motivo>" }`

### Requirement: wheimo-api consume resultados y persiste transacciones
Tras recibir el resultado de `sync-results`, `wheimo-api` SHALL: (1) persistir las transacciones nuevas (no duplicadas), (2) aplicar las reglas de etiquetado del usuario, (3) actualizar el balance de la cuenta con el saldo de la última transacción importada.

#### Scenario: Persistencia y etiquetado tras importación
- **WHEN** `wheimo-api` recibe mensaje de `sync-results` con transacciones nuevas
- **THEN** persiste las transacciones, aplica reglas de etiquetado y actualiza el balance de la cuenta

#### Scenario: Resultado con error
- **WHEN** `wheimo-api` recibe mensaje de `sync-results` con `error`
- **THEN** registra el error en logs y no realiza ninguna persistencia

### Requirement: Descifrado de credenciales en el fetcher
`wheimo-api` SHALL enviar las credenciales `accessPassword` cifradas en el mensaje Redis. `wheimo-fetcher` SHALL descifrar usando la misma passphrase AES-256 configurada como variable de entorno.

#### Scenario: Descifrado correcto
- **WHEN** `wheimo-fetcher` recibe mensaje con `encryptedPassword`
- **THEN** descifra el password antes de pasarlo al importer
