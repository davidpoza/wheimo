## Context

El proyecto tiene un microservicio `fetcher` que obtiene movimientos bancarios de distintas fuentes (Openbank API, Nordigen). El backend actúa como orquestador: publica peticiones en Redis, el fetcher las procesa y publica el resultado de vuelta en Redis, y el backend persiste las transacciones mediante `TransactionService.processImportResult()`.

Para el caso de importación por XLS, el trigger es diferente (upload de fichero del usuario en lugar de un job programado), pero el resultado esperado es el mismo: una lista normalizada de `ImportedTransaction` que llega al backend para persistirse.

El fichero de muestra disponible es `fetcher/Movimientos de Tarjeta.xls`, del banco Openbank (tarjeta).

## Goals / Non-Goals

**Goals:**
- Parsear el XLS de Openbank y normalizar los movimientos al modelo `ImportedTransaction` existente.
- Añadir un endpoint HTTP interno al fetcher (`POST /import/xls`) que recibe el fichero y devuelve los movimientos.
- Añadir un endpoint en el backend (`POST /accounts/{accountId}/import/xls`) que hace de proxy hacia el fetcher y persiste el resultado usando la lógica ya existente (`processImportResult`).
- Pantalla de upload en el frontend.

**Non-Goals:**
- Soporte de múltiples formatos XLS (otros bancos). El parser inicial es específico para Openbank tarjeta.
- Autenticación entre backend y fetcher (red interna de docker-compose).
- Importación asíncrona / progress tracking. El proceso es síncrono.

## Decisions

### 1. El parser XLS vive en el fetcher, no en el backend

El fetcher es el responsable de toda la ingesta de datos bancarios. Meter el parser en el backend mezclaría responsabilidades. Cuando el agregador bancario esté listo, los parsers XLS y API quedarán en el mismo servicio.

**Alternativa descartada**: Parser en el backend. Más simple a corto plazo, pero obliga a mover lógica al fetcher igualmente cuando llegue el agregador.

### 2. Comunicación backend→fetcher vía HTTP síncrono, no Redis

El flujo de upload es síncrono (el usuario espera feedback). Usar Redis aquí requeriría correlation IDs, timeout handling, y complejidad innecesaria. El fetcher ya tiene `spring-boot-starter-web`, por lo que añadir un endpoint HTTP es trivial.

El backend llama al fetcher con `RestTemplate`/`WebClient` usando la URL interna de docker-compose (`http://fetcher:8081`).

**Alternativa descartada**: Publicar en Redis y esperar respuesta. Añade latencia y complejidad sin beneficio para este caso de uso.

### 3. El backend reutiliza `processImportResult` directamente

El método ya gestiona deduplicación (`importId`), persistencia y aplicación de reglas/tags. No hay que reimplementar nada.

### 4. Apache POI para lectura de XLS

El formato `.xls` (BIFF8) requiere `poi` (no `poi-ooxml` que es para xlsx). Dependencia: `org.apache.poi:poi:5.x`.

### 5. Generación del `importId` para filas XLS

Se usará el mismo mecanismo que `OpenbankImporter`: SHA-256 de `accountId|balance|date|description|amount`. Garantiza idempotencia en re-importaciones del mismo fichero.

## Risks / Trade-offs

- **Formato XLS específico de Openbank** → El parser asume columnas concretas. Si el banco cambia el formato, habrá que actualizar el parser. Mitigación: mantener el fichero de muestra como fixture de test.
- **Tamaño del fichero en memoria** → Apache POI carga el XLS completo en memoria. Para ficheros de movimientos bancarios (cientos de filas), no es un problema real.
- **Sin autenticación backend→fetcher** → Aceptable porque el fetcher no está expuesto fuera de la red de docker-compose. Mitigación: documentar que el fetcher nunca debe publicarse en puertos externos.

## Open Questions

- **Columnas exactas del XLS de Openbank tarjeta**: verificar contra `fetcher/Movimientos de Tarjeta.xls`. Columnas esperadas: Fecha, Fecha valor, Concepto, Importe, Saldo. Confirmar número de filas de cabecera a saltar.
- **Puerto del fetcher**: confirmar el puerto interno que usa el fetcher en docker-compose para que el backend lo configure correctamente.
