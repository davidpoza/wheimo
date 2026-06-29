### Requirement: Backend devuelve tags ordenados por nombre

El endpoint `GET /tags` SHALL devolver la lista de tags del usuario ordenada por el campo `name` en orden ascendente (A→Z).

#### Scenario: Orden por defecto en la respuesta

- **WHEN** el cliente llama a `GET /tags`
- **THEN** los registros se devuelven ordenados por `name ASC` sin importar el orden de inserción en BD

### Requirement: Tabla de tags permite ordenar por columna nombre

La tabla de tags en el frontend SHALL permitir al usuario ordenar los registros haciendo clic en la cabecera de la columna "Nombre".

#### Scenario: Carga inicial con orden por nombre

- **WHEN** el usuario navega a la pantalla de tags (pestaña "Tags")
- **THEN** la tabla muestra los registros ordenados por nombre ascendente y la cabecera "Nombre" muestra el indicador de ordenación activa

#### Scenario: Invertir orden de la columna nombre

- **WHEN** el usuario hace clic por segunda vez en la cabecera "Nombre"
- **THEN** la tabla reordena los registros en orden descendente (Z→A)

#### Scenario: Columna de acciones no es ordenable

- **WHEN** el usuario hace clic en la columna de acciones (botones editar/eliminar)
- **THEN** no ocurre ningún cambio de ordenación

### Requirement: Lista en memoria se mantiene ordenada tras mutaciones

Tras crear o editar un tag, el signal de tags en el frontend SHALL mantener el orden por nombre ascendente sin necesidad de recargar la página.

#### Scenario: Nuevo tag aparece en posición correcta

- **WHEN** el usuario crea un nuevo tag
- **THEN** el tag aparece en la tabla en la posición que le corresponde según orden alfabético

#### Scenario: Tag editado se reposiciona si cambia el nombre

- **WHEN** el usuario edita el nombre de un tag existente
- **THEN** el tag se reposiciona en la tabla según el nuevo orden alfabético
