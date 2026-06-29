## Why

El diálogo de detalles de transacción permite adjuntar archivos, pero no ofrece captura directa desde la cámara del dispositivo. En móvil, esto obliga al usuario a abrir la app de cámara por separado, guardar la foto y luego subirla — un flujo largo para algo tan común como fotografiar un ticket o recibo. Además, el backend almacena las imágenes sin comprimirlas, lo que genera ficheros innecesariamente grandes.

## What Changes

- Se añade un botón "Cámara" en la pestaña de adjuntos del `transaction-details-dialog` que abre la cámara del dispositivo usando `navigator.mediaDevices.getUserMedia()` con fallback a `<input capture="environment">` para navegadores que no lo soporten.
- Se crea el componente reutilizable `CameraCaptureComponent` que encapsula el flujo de previsualización en vivo, captura de fotograma, reintento y envío.
- El backend optimiza automáticamente las imágenes subidas: reescalado proporcional a máximo 1920×1080 px y compresión JPEG al 85% usando las APIs nativas de Java (`javax.imageio`).
- Se añade configuración en `application.yml` para los parámetros de optimización (dimensiones máximas y calidad JPEG).

## Capabilities

### New Capabilities
- `camera-capture`: Componente Angular de captura de foto via cámara con vista previa en vivo, captura de fotograma a JPEG, retry, y upload al servicio de adjuntos existente.
- `attachment-image-optimization`: El backend comprime y reescala imágenes JPEG/PNG/WebP al guardarlas como adjuntos, reduciendo el tamaño en disco manteniendo calidad visual.

### Modified Capabilities

## Impact

- **Frontend**: Nuevo componente `CameraCaptureComponent` en `frontend/src/app/shared/components/`. Modificación de `TransactionDetailsDialogComponent` para incluirlo en la pestaña de adjuntos.
- **Backend**: Modificación de `AttachmentService.save()` para detectar imágenes y aplicar compresión/reescalado antes de escribir el fichero.
- **Configuración**: Nuevas propiedades en `application.yml` bajo `app.attachments.image` (maxWidth, maxHeight, jpegQuality).
- **APIs**: Sin cambios en endpoints ni contratos de API.
- **Dependencias**: Sin nuevas dependencias — tanto frontend (Canvas API nativa) como backend (`javax.imageio` ya incluido en JDK) usan APIs estándar.
