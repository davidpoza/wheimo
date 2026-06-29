## 1. Backend

- [x] 1.1 Añadir método `findAllByOrderByNameAsc()` en `RecurrentRepository`
- [x] 1.2 Actualizar `RecurrentService.findAll()` para usar el nuevo método

## 2. Frontend

- [x] 2.1 Añadir atributos `[sortField]="'name'"` y `[sortOrder]="1"` en el `<p-table>` de `recurrents-list.component.html`
- [x] 2.2 Añadir `pSortableColumn` y `<p-sortIcon>` en las cabeceras: nombre, establecimiento, periodicidad, precio actual, coste total
