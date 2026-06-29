## Context

La pantalla de recurrentes muestra una tabla con todos los pagos recurrentes del usuario. Actualmente el backend devuelve los registros en orden indefinido (orden de inserción en BD) y el componente `p-table` de PrimeNG no tiene ordenación habilitada. La lista puede volverse confusa a medida que crece.

Stack: backend Spring Boot + Spring Data JPA; frontend Angular con PrimeNG v19.

## Goals / Non-Goals

**Goals:**
- El endpoint `GET /recurrents` devuelve los registros ordenados por `name ASC`.
- La tabla frontend permite al usuario ordenar por las columnas de datos (nombre, establecimiento, periodicidad, precio actual, coste total) haciendo clic en la cabecera.
- La ordenación por defecto al cargar es `name ASC`, alineada con el orden del backend.

**Non-Goals:**
- Ordenación server-side bajo demanda (paginación/sort por parámetros de query): no se necesita, el volumen de recurrentes por usuario es pequeño.
- Ordenación en columnas de acciones (link, botones).
- Persistencia de la preferencia de ordenación entre sesiones.

## Decisions

### Backend: añadir método con ORDER BY en el repositorio

Se añade `findAllByOrderByNameAsc()` en `RecurrentRepository` y se llama desde `RecurrentService.findAll()`. Alternativa descartada: ordenar en Java con `stream().sorted(...)` — innecesario cuando la BD puede hacerlo de forma eficiente en el índice existente sobre `name`.

### Frontend: ordenación client-side con PrimeNG `p-table`

PrimeNG `p-table` soporta ordenación client-side nativa con los atributos `[sortField]`, `[sortOrder]` y la directiva `pSortableColumn` en las cabeceras. No se necesita lógica adicional en el componente TypeScript. Alternativa descartada: ordenación manual con `signal` — más código, mismo resultado.

La columna de periodicidad muestra un label calculado (`periodicityLabel(r)`), no un campo simple del modelo, por lo que la ordenación sobre ella usará el valor mostrado en pantalla a través del campo `periodicityType` del modelo (suficiente para un orden razonable; la alternativa de ordenar por el string formateado requeriría un campo virtual).

## Risks / Trade-offs

- [Riesgo] La columna "periodicidad" muestra texto calculado — el sort de PrimeNG sobre `periodicityType` ordena `ANNUAL` antes que `DAYS` alfabéticamente, lo que puede no ser el orden más intuitivo. → Mitigación: aceptable por ahora; se puede refinar en un cambio posterior si se recibe feedback.
- [Trade-off] Ordenación client-side implica que todos los registros ya están en memoria — correcto dado que `loadAll()` trae la lista completa.
