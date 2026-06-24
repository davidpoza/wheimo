## ADDED Requirements

### Requirement: Aplicación automática de reglas al importar transacciones
El sistema SHALL aplicar todas las reglas activas del usuario sobre cada transacción nueva en el momento de importación, antes de persistir los tags. Solo se etiquetan transacciones nuevas (las ya existentes por `importId` no se re-procesan).

#### Scenario: Transacción nueva con match
- **WHEN** se importa una transacción cuyo `description` hace match con la regex de una regla activa del usuario
- **THEN** el sistema asigna los tags de esa regla a la transacción importada

#### Scenario: Transacción nueva sin match
- **WHEN** se importa una transacción cuyo `description` no hace match con ninguna regla
- **THEN** la transacción se guarda sin tags asignados automáticamente

#### Scenario: Múltiples reglas con match
- **WHEN** el `description` de una transacción hace match con más de una regla
- **THEN** el sistema asigna todos los tags de todas las reglas que hacen match

#### Scenario: Transacción ya existente
- **WHEN** se recibe una transacción cuyo `importId` ya existe en la base de datos
- **THEN** el sistema ignora la transacción y no aplica reglas ni modifica los tags existentes

#### Scenario: Sin reglas configuradas
- **WHEN** el usuario no tiene ninguna regla configurada y se importan transacciones
- **THEN** las transacciones se guardan sin tags; no se produce ningún error
