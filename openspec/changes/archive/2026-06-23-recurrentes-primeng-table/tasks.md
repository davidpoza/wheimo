## 1. Template HTML

- [x] 1.1 Reemplazar `<table>` nativo y el bloque `@if (recurrents().length === 0)` por `<p-table [value]="recurrents()" styleClass="p-datatable-sm">`
- [x] 1.2 Añadir `<ng-template pTemplate="header">` con las columnas: Nombre, Establecimiento, Periodicidad, Precio actual, Link, acciones
- [x] 1.3 Añadir `<ng-template pTemplate="body" let-r>` con las celdas correspondientes (manteniendo pipes, tooltips y botones de acción existentes)
- [x] 1.4 Añadir `<ng-template pTemplate="empty">` con el mensaje "No hay artículos recurrentes. Crea uno para empezar."

## 2. Componente TypeScript

- [x] 2.1 Añadir `TableModule` de `primeng/table` a la lista `imports` del componente

## 3. Estilos SCSS

- [x] 3.1 Eliminar selectores de tabla nativa (`table`, `thead`, `tbody`, `tr`, `td`) que ya no aplican
- [x] 3.2 Revisar y ajustar estilos de `.recurrents-table` para que funcionen correctamente con la estructura DOM de `p-table`

## 4. Verificación

- [ ] 4.1 Arrancar el frontend y verificar que la lista de recurrentes se muestra correctamente con datos
- [ ] 4.2 Verificar el estado vacío (sin artículos) muestra el mensaje correcto
- [ ] 4.3 Verificar que los botones de acción (asignar, historial, editar, eliminar) funcionan
