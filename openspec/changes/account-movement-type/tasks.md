## 1. Base de datos

- [x] 1.1 Crear migración Flyway `V15__add_account_movement_type.sql` con `ALTER TABLE accounts ADD COLUMN movement_type VARCHAR(10) NOT NULL DEFAULT 'BOTH'`

## 2. Backend - Entidad y DTOs

- [x] 2.1 Crear enum `MovementType` (INCOME, EXPENSE, BOTH) en el paquete `domain`
- [x] 2.2 Añadir campo `movementType` (tipo `MovementType`, default `BOTH`) a la entidad `Account`
- [x] 2.3 Añadir campo `movementType` a `AccountDto`
- [x] 2.4 Añadir campo `movementType` a `CreateAccountRequest`
- [x] 2.5 Añadir campo `movementType` a `UpdateAccountRequest`

## 3. Backend - Lógica de negocio

- [x] 3.1 Actualizar `AccountService` para mapear `movementType` al crear y actualizar cuentas, y en el mapeo a DTO
- [x] 3.2 Actualizar `TransactionService.processImportResult` para filtrar transacciones según el `movementType` de la cuenta antes de persistirlas

## 4. Frontend - Modelo y servicio

- [x] 4.1 Añadir campo `movementType: 'INCOME' | 'EXPENSE' | 'BOTH'` al modelo `Account`

## 5. Frontend - Formulario de cuenta

- [x] 5.1 Añadir control `movementType` al formulario en `EditAccountDialogComponent`
- [x] 5.2 Añadir selector de tipo de movimiento en la plantilla HTML (opciones: Entrada / Salida / Ambos)
- [x] 5.3 Precargar el valor del campo al editar una cuenta existente
