## 1. Base de datos

- [x] 1.1 Crear migración `V22__add_units_to_recurrents_and_price_entries.sql` que añade `units DECIMAL(15,3)` nullable a `recurrents` y a `recurrent_price_entries`

## 2. Backend

- [x] 2.1 Añadir campo `units` (`BigDecimal`, nullable) a la entidad `Recurrent`
- [x] 2.2 Añadir campo `units` (`BigDecimal`, nullable) a la entidad `RecurrentPriceEntry`
- [x] 2.3 Añadir `units` a `RecurrentDto` y exponerlo en `toDto`
- [x] 2.4 Añadir `units` a `RecurrentPriceEntryDto` y exponerlo en `toPriceDto`
- [x] 2.5 En `RecurrentService.addPriceEntry`, aceptar `units` opcional, guardarlo en la entrada y actualizar `units` del artículo solo si viene informado
- [x] 2.6 En `RecurrentController.addPrice`, parsear `units` opcional del body y pasarlo al servicio
- [x] 2.7 Confirmar que PATCH `/recurrents/{id}` sigue ignorando `amount` y `units` (no añadirlos a `updateById`)

## 3. Frontend — modelo y servicio

- [x] 3.1 Añadir `units: number | null` a `Recurrent` y `RecurrentPriceEntry` en `recurrent.model.ts`
- [x] 3.2 En `recurrents.service.ts`, actualizar `addPriceEntry` para enviar `units` opcional y actualizar `units` del artículo en el signal tras la respuesta

## 4. Frontend — listado con coste total

- [x] 4.1 Añadir columna "Coste total" en `recurrents-list.component.html`, mostrando `amount × units` (EUR) cuando `units != null` y "—" en caso contrario; mantener "Precio actual" como precio unitario
- [x] 4.2 Ajustar `colspan` del mensaje vacío y cualquier helper necesario en `recurrents-list.component.ts`

## 5. Frontend — modal de historial (form, tabla, tamaño)

- [x] 5.1 Añadir control `units` (opcional) al formulario del modal en `price-history-dialog.component.ts` y enviarlo en `addEntry`
- [x] 5.2 Añadir campo "Unidades (opcional)" al form de alta en la plantilla del modal
- [x] 5.3 Añadir columna "Unidades" a la `p-table` del historial (mostrando "—" cuando sea null)
- [x] 5.4 Ampliar el ancho del `p-dialog` (~720px) y mejorar el layout/estilos del modal

## 6. Frontend — gráfico precio + unidades

- [x] 6.1 Importar `ChartModule` en `price-history-dialog.component.ts` y construir `chartData`/`chartOptions` con dos datasets ("Precio" eje `y`, "Unidades" eje `y1` derecho)
- [x] 6.2 Ordenar entradas ascendente por `recordedAt` para el eje X y omitir la serie "Unidades" si ninguna entrada tiene unidades
- [x] 6.3 Añadir `p-chart` de tipo línea al modal entre el form y la tabla; manejar estado de historial vacío sin errores

## 7. Verificación

- [x] 7.1 Compilar backend y frontend sin errores
- [x] 7.2 Probar manualmente: registrar entrada con y sin unidades, ver coste total en el listado, ver tabla y gráfico en el modal
