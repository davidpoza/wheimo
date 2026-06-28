## Context

Los artículos recurrentes (`Recurrent`) guardan un único `amount` (precio actual, `DECIMAL(15,2)`) que se actualiza al registrar entradas en `recurrent_price_entries`. El frontend Angular muestra una tabla en `recurrents-list` y un modal `price-history-dialog` (PrimeNG `p-dialog`, 520px) que lista entradas con `p-table`. La app ya usa PrimeNG `p-chart` (Chart.js) en `features/charts`.

Queremos añadir el concepto de **unidades** (opcional) a nivel de artículo y de cada entrada de historial, calcular **coste total** = precio × unidades en el listado, y graficar precio + unidades en un solo chart dentro del modal, además de pulir el modal.

## Goals / Non-Goals

**Goals:**
- Añadir `units` (nullable) a `recurrents` y `recurrent_price_entries` sin romper datos existentes.
- Mantener `amount` como **precio unitario**; el coste total se calcula, no se almacena.
- Registrar precio y unidades juntos desde el modal y reflejarlos en el historial.
- Un único `p-chart` de línea con doble eje Y para precio y unidades.
- Modal más grande y con mejor layout.

**Non-Goals:**
- No se hace `units` obligatorio ni se migran datos existentes a un valor por defecto.
- No se persiste el coste total (se deriva en cliente).
- No se cambian las reglas de periodicidad ni de vinculación de transacciones.
- No se añade un nuevo endpoint de chart en backend; el chart se construye en cliente a partir de `GET /recurrents/{id}/prices`.

## Decisions

### 1. Tipo de `units`: `DECIMAL` nullable
Se usa `DECIMAL(15,3)` (nullable) tanto en `recurrents` como en `recurrent_price_entries`, mapeado a `BigDecimal` en Java y `number | null` en TS. Permite cantidades fraccionarias (litros, kg) sin atarse a enteros.
- *Alternativa*: `INTEGER`. Descartada por limitar a cantidades enteras.

### 2. Coste total calculado, no almacenado
El listado calcula `amount × units` en el cliente (`recurrents-list`). Evita un tercer campo que mantener sincronizado y mantiene `amount` como única fuente del precio unitario.

### 3. `units` actual se actualiza solo si la entrada lo trae
En `addPriceEntry`, se actualiza siempre `amount`; `units` del artículo se actualiza **solo si** la entrada incluye `units` (no null). Así registrar un precio "rápido" sin unidades no borra las unidades actuales del artículo.
- *Alternativa*: actualizar siempre `units` (poniéndolo a null si falta). Descartada: borraría información útil.

### 4. PATCH ignora `amount` y `units`
Coherente con el comportamiento actual de `amount`: ambos solo se modifican vía historial de precios. El form de crear/editar del listado no toca unidades.

### 5. Chart con doble eje Y en el modal
`p-chart type="line"` con dos datasets: "Precio" (yAxisID `y`) y "Unidades" (yAxisID `y1`, `position: 'right'`). Labels = `recordedAt` ordenado ascendente (el historial llega desc; se invierte en cliente). La serie de unidades solo se incluye si alguna entrada tiene `units`. Reutiliza el patrón ya presente en `balance-evolution.component.ts`.

### 6. Tamaño/layout del modal
Subir el ancho del `p-dialog` (de 520px a ~720px) y reorganizar: acción de alta arriba, gráfico, y debajo la tabla del historial. Pequeñas mejoras de estilo en el form de alta (campos en línea cuando quepan).

## Risks / Trade-offs

- **Entradas históricas sin `units`** → el chart muestra huecos o solo la serie de precio. Mitigación: la serie de unidades solo se dibuja si hay datos; Chart.js maneja puntos faltantes con `spanGaps`/null.
- **Doble eje puede confundir** (escalas distintas) → Mitigación: leyenda clara con etiquetas "Precio (€)" y "Unidades" y colores diferenciados.
- **Migración Flyway** añade columnas nullable → operación segura y retrocompatible; rollback = no usar las columnas (o migración inversa que las elimina).
- **`amount × units` con BigDecimal/redondeo** → el cálculo es en cliente para display; se formatea como EUR. Sin impacto en persistencia.

## Migration Plan

1. Crear `V22__add_units_to_recurrents_and_price_entries.sql` añadiendo `units DECIMAL(15,3)` nullable a ambas tablas.
2. Desplegar backend (entidades/DTOs/servicio/controlador) — retrocompatible: las APIs siguen aceptando payloads sin `units`.
3. Desplegar frontend (modelo, servicio, listado, modal+chart).
4. Rollback: revertir despliegues; las columnas nullable pueden permanecer sin efecto.

## Open Questions

- ¿Formato de unidades en UI (decimales mostrados)? Se asume hasta 3 decimales, sin forzar separador de miles. Ajustable en implementación.
