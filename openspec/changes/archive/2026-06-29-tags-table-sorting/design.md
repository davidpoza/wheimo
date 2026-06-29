## Context

La tabla de tags usa PrimeNG `p-table`. La columna "Nombre" no tiene la directiva `[pSortableColumn]` ni el componente `p-sortIcon`, por lo que no es clicable para ordenar. El backend devuelve los tags en el orden de inserción de BD (`findByUserId`), sin garantía de orden.

El patrón ya existe en recurrentes: `RecurrentRepository.findAllByOrderByNameAsc()` en backend y `[pSortableColumn]` en frontend.

## Goals / Non-Goals

**Goals:**
- Backend: `GET /tags` devuelve tags ordenados por nombre ASC por defecto.
- Frontend: cabecera "Nombre" es clicable para ordenar ASC/DESC; columna de acciones no es ordenable.

**Non-Goals:**
- Ordenación por cualquier otra columna de tags (solo existe "nombre" como columna de datos).
- Paginación o filtrado.
- Persistencia de la preferencia de ordenación del usuario.

## Decisions

**Backend — Spring Data derived query**
Se añade `findByUserIdOrderByNameAsc` en `TagRepository` (misma convención que `findAllByOrderByNameAsc` en `RecurrentRepository`). No se necesita ninguna migración de BD ni cambio en `TagService` más allá de llamar al nuevo método.

**Frontend — PrimeNG sortable column**
Se añade `[sortField]="'name'"` en `<p-table>` para la ordenación inicial, `pSortableColumn="name"` en el `<th>` de nombre y `<p-sortIcon field="name" />` dentro del mismo `<th>`. La columna de acciones no lleva directiva de ordenación. No se necesita lógica TypeScript adicional: la ordenación la gestiona PrimeNG internamente sobre el array en memoria.

## Risks / Trade-offs

- [Riesgo] Tras crear o editar un tag, el signal `tags` actualiza la lista en memoria sin reordenar → el nuevo tag aparece al final hasta que se recarga la página. Mitigación: ordenar el signal por nombre en el service tras cada mutación (create/update).
