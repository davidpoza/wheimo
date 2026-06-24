## Why

El banco no ofrece integración directa vía API pública todavía, pero permite descargar los movimientos en formato XLS. Esto permite importar movimientos sin depender del agregador bancario, desbloqueando el flujo principal de la app.

## What Changes

- Nuevo endpoint HTTP interno en el fetcher: `POST /import/xls` que acepta un fichero multipart y devuelve los movimientos parseados.
- Nueva implementación de parser XLS en el fetcher (`XlsBankImporter`) que lee el formato del banco y normaliza los movimientos al modelo `ImportedTransaction`.
- Nuevo endpoint en el backend: `POST /accounts/{accountId}/import/xls` que actúa como proxy hacia el fetcher y persiste los movimientos importados.
- Pantalla en el frontend para subir el fichero XLS asociado a una cuenta.

## Capabilities

### New Capabilities

- `xls-import`: Importación de movimientos bancarios mediante fichero XLS descargado del banco. Incluye upload desde frontend, proxy en backend, parsing en fetcher y persistencia.

### Modified Capabilities

<!-- Sin cambios en capabilities existentes -->

## Impact

- **fetcher**: nueva dependencia Apache POI para leer XLS; nuevo controller HTTP; nueva clase parser.
- **backend**: nuevo endpoint proxy; reutiliza lógica de persistencia de transacciones existente.
- **frontend**: nueva UI de upload de fichero en la pantalla de cuenta.
- **docker-compose**: el fetcher ya no necesita estar aislado de red (ya estaba en red interna), sin cambios necesarios.
