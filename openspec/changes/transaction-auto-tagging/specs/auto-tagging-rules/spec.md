## ADDED Requirements

### Requirement: Gestión de reglas de etiquetado automático
El sistema SHALL proporcionar una pantalla accesible desde la navegación principal donde el usuario pueda crear, listar y eliminar reglas de etiquetado automático. Cada regla define una expresión regular aplicada al concepto (description) de la transacción y uno o más tags a asignar cuando hay match.

#### Scenario: Acceso a la pantalla de reglas
- **WHEN** el usuario navega a `/rules`
- **THEN** el sistema muestra la lista de reglas del usuario y un botón para crear una nueva regla

#### Scenario: Crear una regla de etiquetado
- **WHEN** el usuario completa el formulario con nombre, regex y al menos un tag y pulsa "Create"
- **THEN** el sistema guarda la regla con `type: 'description'` y la muestra en la lista

#### Scenario: Crear una regla sin tags
- **WHEN** el usuario crea una regla sin seleccionar ningún tag
- **THEN** el sistema guarda la regla y la muestra en la lista sin tags asignados

#### Scenario: Nombre duplicado
- **WHEN** el usuario intenta crear una regla con un nombre que ya existe para ese usuario
- **THEN** el sistema devuelve un error 409 y no crea la regla

#### Scenario: Eliminar una regla
- **WHEN** el usuario pulsa el botón de eliminar de una regla y confirma
- **THEN** el sistema elimina la regla y la quita de la lista

### Requirement: Regex aplicada sobre el concepto de la transacción
La regla SHALL usar el campo `description` de la transacción como campo de evaluación. La regex se evalúa con flag case-insensitive. Una regex vacía o nula SHALL considerarse inválida al crear la regla.

#### Scenario: Regex con match parcial
- **WHEN** el concepto de la transacción contiene la cadena que hace match con la regex (parcial)
- **THEN** el sistema considera que la regla aplica a esa transacción

#### Scenario: Regex case-insensitive
- **WHEN** la regex es `mercadona` y el concepto es `COMPRA MERCADONA 001`
- **THEN** el sistema considera que la regla aplica

#### Scenario: Regex inválida al guardar
- **WHEN** el usuario introduce un patrón que no es una regex válida (e.g. `[unclosed`)
- **THEN** el sistema rechaza la creación y muestra un error de validación
