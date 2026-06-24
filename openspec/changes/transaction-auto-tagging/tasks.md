## 1. Fix bug: tipo de regla en el frontend

- [x] 1.1 En `tag-rules.component.ts`, cambiar el valor del tipo `Regex (description)` de `'regex'` a `'description'` en el array `RULE_TYPES`
- [x] 1.2 Verificar que el formulario envía `type: 'description'` al backend al crear una regla

## 2. Fix: creación de regla con tags

- [x] 2.1 En `TagsService.createRule()`, implementar flujo secuencial: crear la regla y luego hacer `POST /rules/{id}/tags` por cada tagId seleccionado usando `switchMap` + `forkJoin`
- [x] 2.2 Adaptar `TagRulesComponent.createRule()` para pasar los `tagIds` al método del servicio

## 3. Registrar ruta y navegación

- [x] 3.1 Añadir la ruta `rules` en `app.routes.ts` apuntando a `TagRulesComponent` (bajo el layout autenticado)
- [x] 3.2 Añadir entrada de navegación "Reglas" en el componente de layout (`app-layout`) con el icono adecuado (e.g. `pi-sliders-h`)

## 4. Cargar tags al inicializar la pantalla

- [x] 4.1 En `TagRulesComponent.ngOnInit()`, añadir `this.tagsService.loadTags().subscribe()` para que el multiselect de tags esté poblado al abrir el formulario

## 5. Validación de regex en el frontend

- [x] 5.1 Añadir validador personalizado en el formulario que compruebe que el `value` introducido es una regex JavaScript válida (`new RegExp(value)` sin lanzar excepción)
- [x] 5.2 Mostrar mensaje de error en el campo `value` si la regex es inválida

## 6. Smoke test manual

- [ ] 6.1 Crear una regla con regex `mercadona` y un tag desde la pantalla `/rules`
- [ ] 6.2 Importar (o crear manualmente) una transacción con `description` que contenga "Mercadona" y verificar que recibe el tag automáticamente
