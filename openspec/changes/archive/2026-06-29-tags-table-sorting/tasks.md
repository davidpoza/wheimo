## 1. Backend

- [x] 1.1 Añadir método `findByUserIdOrderByNameAsc` en `TagRepository.java`
- [x] 1.2 Actualizar `TagService.findAll` para usar el nuevo método con ordenación

## 2. Frontend — tabla

- [x] 2.1 Añadir `[sortField]="'name'"` y `[sortOrder]="1"` en `<p-table>` de `tags-grid.component.html`
- [x] 2.2 Añadir `pSortableColumn="name"` y `<p-sortIcon field="name" />` en el `<th>` de nombre

## 3. Frontend — signal ordenado tras mutaciones

- [x] 3.1 En `TagsService.createTag`, ordenar la lista por nombre después de añadir el nuevo tag
- [x] 3.2 En `TagsService.updateTag`, ordenar la lista por nombre después de actualizar el tag
