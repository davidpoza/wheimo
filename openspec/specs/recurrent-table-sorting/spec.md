### Requirement: Backend devuelve recurrentes ordenados por nombre

El endpoint `GET /recurrents` SHALL devolver la lista de recurrentes ordenada por el campo `name` en orden ascendente (A→Z).

#### Scenario: Orden por defecto en la respuesta

- **WHEN** el cliente llama a `GET /recurrents`
- **THEN** los registros se devuelven ordenados por `name ASC` sin importar el orden de inserción en BD

### Requirement: Tabla de recurrentes permite ordenar por columnas

La tabla de pagos recurrentes en el frontend SHALL permitir al usuario ordenar los registros haciendo clic en las cabeceras de las columnas de datos.

#### Scenario: Carga inicial con orden por nombre

- **WHEN** el usuario navega a la pantalla de recurrentes
- **THEN** la tabla muestra los registros ordenados por nombre ascendente y la cabecera "Nombre" muestra el indicador de ordenación activa

#### Scenario: Ordenar por otra columna ascendente

- **WHEN** el usuario hace clic en la cabecera de una columna ordenable (establecimiento, precio actual, coste total)
- **THEN** la tabla reordena los registros por esa columna en orden ascendente y muestra el icono de sort correspondiente

#### Scenario: Invertir orden de una columna

- **WHEN** el usuario hace clic por segunda vez en la cabecera de la columna activa
- **THEN** la tabla invierte el orden a descendente

#### Scenario: Columnas no ordenables

- **WHEN** el usuario hace clic en las cabeceras de las columnas "Link" o acciones (columna de botones)
- **THEN** no ocurre ningún cambio de ordenación
