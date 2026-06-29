## Context

La aplicación usa PrimeNG v21 como librería de componentes UI. El componente `p-datepicker` de PrimeNG acepta el atributo `[firstDayOfWeek]` (número entero, 0=domingo, 1=lunes). Actualmente ningún datepicker tiene este atributo configurado, por lo que usan el valor por defecto (0 = domingo).

Hay 9 instancias de `p-datepicker` en 5 ficheros HTML.

## Goals / Non-Goals

**Goals:**
- Añadir `[firstDayOfWeek]="1"` a los 9 datepickers existentes.
- Garantizar que cualquier datepicker futuro incluya este atributo.

**Non-Goals:**
- Cambiar el locale o el formato de fechas.
- Configurar un valor global a nivel de módulo (no existe esta opción en PrimeNG para `firstDayOfWeek`).
- Modificar lógica de negocio o validaciones de fecha.

## Decisions

**Atributo inline en cada componente**: PrimeNG no ofrece configuración global de `firstDayOfWeek` vía provider, por lo que la única opción es añadir el binding `[firstDayOfWeek]="1"` directamente en cada `<p-datepicker>`. Es verboso pero explícito y sin magia.

## Risks / Trade-offs

- [Riesgo] Nuevos datepickers añadidos en el futuro sin el atributo volverán a mostrar domingo como primer día. → Mitigación: documentar la convención en el spec; revisión de código.
