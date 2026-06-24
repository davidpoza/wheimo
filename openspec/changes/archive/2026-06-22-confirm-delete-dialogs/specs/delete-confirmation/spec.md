## ADDED Requirements

### Requirement: Confirmación antes de eliminar tag

El sistema SHALL mostrar un diálogo de confirmación de PrimeNG antes de eliminar un tag.

#### Scenario: Usuario confirma eliminación de tag

- **WHEN** el usuario pulsa el botón de eliminar en un tag
- **THEN** se muestra un `<p-confirmDialog>` con el nombre del tag
- **WHEN** el usuario pulsa "Sí"
- **THEN** el tag se elimina y se muestra toast de éxito

#### Scenario: Usuario cancela eliminación de tag

- **WHEN** el usuario pulsa el botón de eliminar en un tag
- **THEN** se muestra el diálogo de confirmación
- **WHEN** el usuario pulsa "No"
- **THEN** el tag NO se elimina y no ocurre ninguna acción

---

### Requirement: Confirmación antes de eliminar regla de tag

El sistema SHALL mostrar un diálogo de confirmación de PrimeNG antes de eliminar una regla de tag.

#### Scenario: Usuario confirma eliminación de regla

- **WHEN** el usuario pulsa el botón de eliminar en una regla
- **THEN** se muestra un `<p-confirmDialog>` con mensaje de confirmación
- **WHEN** el usuario pulsa "Sí"
- **THEN** la regla se elimina

#### Scenario: Usuario cancela eliminación de regla

- **WHEN** el usuario pulsa el botón de eliminar en una regla y pulsa "No"
- **THEN** la regla NO se elimina

---

### Requirement: Confirmación antes de eliminar cuenta

El sistema SHALL mostrar un diálogo de confirmación de PrimeNG antes de eliminar una cuenta.

#### Scenario: Usuario confirma eliminación de cuenta

- **WHEN** el usuario pulsa el botón de eliminar en una cuenta
- **THEN** se muestra un `<p-confirmDialog>` con el nombre de la cuenta
- **WHEN** el usuario confirma
- **THEN** la cuenta se elimina y se muestra toast de éxito

#### Scenario: Usuario cancela eliminación de cuenta

- **WHEN** el usuario pulsa el botón de eliminar y cancela
- **THEN** la cuenta NO se elimina

---

### Requirement: Confirmación antes de eliminar presupuesto

El sistema SHALL mostrar un diálogo de confirmación de PrimeNG antes de eliminar un presupuesto.

#### Scenario: Usuario confirma eliminación de presupuesto

- **WHEN** el usuario pulsa el botón de eliminar en un presupuesto
- **THEN** se muestra un `<p-confirmDialog>`
- **WHEN** el usuario confirma
- **THEN** el presupuesto se elimina

#### Scenario: Usuario cancela eliminación de presupuesto

- **WHEN** el usuario pulsa el botón de eliminar y cancela
- **THEN** el presupuesto NO se elimina
