## Context

La aplicación usa PrimeNG como librería de componentes UI. Los diálogos (`p-dialog`) tienen por defecto `overflow: auto` en su contenedor, lo que hace que los paneles flotantes de `p-select` y `p-multiselect` queden recortados cuando el desplegable sobresale del borde del modal.

PrimeNG ofrece la propiedad `appendTo` en sus componentes de selección, que permite especificar el elemento DOM al que se adjuntará el panel overlay. Usando `appendTo="body"`, el panel se renderiza directamente en el `<body>` con posicionamiento absoluto calculado dinámicamente, evitando el clipping del modal.

## Goals / Non-Goals

**Goals:**
- Los desplegables de `p-select` y `p-multiselect` dentro de diálogos son completamente visibles aunque sobresalgan del borde del modal.

**Non-Goals:**
- No se cambia ningún comportamiento funcional ni de negocio.
- No se modifica el estilo visual de los selectores.
- No se afectan selectores fuera de diálogos.

## Decisions

**Usar `appendTo="body"` en todos los selectores dentro de diálogos**

PrimeNG soporta esta propiedad de forma nativa. Es el patrón recomendado por la documentación de PrimeNG para resolver el clipping dentro de contenedores con overflow. No requiere CSS personalizado ni workarounds.

Alternativa descartada: `overflow: visible` en el modal — rompería el scroll interno y la máscara del diálogo.

## Risks / Trade-offs

- **Posicionamiento en scroll**: Al estar en el body, si el usuario hace scroll mientras el panel está abierto, el panel podría desalinearse brevemente. → Mitigación: comportamiento estándar de PrimeNG, cierra el panel al scroll.
- **Z-index**: El panel necesita z-index mayor que el overlay del modal. PrimeNG gestiona esto automáticamente con su sistema de z-index.
