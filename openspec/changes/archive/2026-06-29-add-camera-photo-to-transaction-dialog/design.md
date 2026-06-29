## Context

El `transaction-details-dialog` ya tiene una pestaña de adjuntos funcional con `AttachmentService` (upload, download, delete) y `AttachmentController` en backend (POST /attachments, GET /attachments/{id}, DELETE /attachments/{id}). Las imágenes se almacenan tal cual se reciben en el filesystem sin ningún procesamiento. No existe actualmente ningún flujo de captura desde cámara.

El proyecto de referencia `dps-stock-web` implementa un componente `MobileCameraCaptureComponent` que usa `getUserMedia()` con fallback a `<input capture="environment">`.

## Goals / Non-Goals

**Goals:**
- Permitir capturar fotos directamente desde la cámara en `transaction-details-dialog` sin salir de la app.
- Comprimir y reescalar imágenes en el backend antes de guardarlas para reducir uso de disco.
- Componente de cámara reutilizable en toda la app.

**Non-Goals:**
- Thumbnails automáticos (las miniaturas ya se generan on-the-fly en frontend con blob URLs).
- Cambios en el esquema de base de datos o en los endpoints de API.
- Soporte para vídeo.
- Compresión de PDFs.

## Decisions

### D1: Componente de cámara standalone en `shared/components`

Se crea `CameraCaptureComponent` como componente Angular standalone en `frontend/src/app/shared/components/camera-capture/`. Emite un `@Output() photoCaptured: EventEmitter<File>`.

**Alternativa descartada**: Implementar la lógica directamente en `TransactionDetailsDialogComponent`. Descartada porque el componente de cámara es reutilizable en otros contextos (p.ej., futuros formularios de perfil).

### D2: `getUserMedia()` con fallback a `<input capture>`

El flujo primario usa `navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } })` para mostrar previsualización en vivo y capturar con canvas. Si el API no está disponible (p.ej., HTTP sin TLS, Safari antiguo), se activa un `<input type="file" accept="image/*" capture="environment">` oculto.

**Alternativa descartada**: Usar solo `<input capture>`. No permite previsualización en vivo, que es clave para asegurarse de que el ticket queda bien enfocado antes de capturar.

### D3: Captura a JPEG con canvas en el frontend antes del upload

El fotograma se dibuja en un `<canvas>` oculto y se convierte a `Blob` con `canvas.toBlob('image/jpeg', 0.92)`. Esto reduce el tamaño ya en el cliente (calidad 92% preserva texto de tickets) antes de enviarlo al backend.

**Nota**: El backend comprimirá adicionalmente a 85% y reescalará si supera 1920×1080, por lo que hay compresión en dos etapas pero evita subir imágenes de 10MB desde móvil.

### D4: Optimización de imágenes en backend con `javax.imageio` nativo

`AttachmentService.save()` detectará si el tipo MIME es imagen (JPEG, PNG, WebP, GIF) y ejecutará compresión + reescalado proporcional a máximo 1920×1080 px con calidad JPEG 0.85, usando únicamente APIs JDK estándar.

**Alternativa descartada**: Librería `thumbnailator` o `imgscalr`. Son más sencillas pero añaden dependencias externas. La referencia `dps-stock-backend` prueba que `javax.imageio` + `Graphics2D` con interpolación bicúbica produce resultados de calidad suficiente sin dependencias extra.

**Alternativa descartada**: Procesar imágenes de forma asíncrona en background. Añade complejidad (mensajería, estado pendiente). El volumen esperado es bajo y el procesamiento síncrono es suficientemente rápido.

### D5: Configuración externalizada en `application.yml`

```yaml
app:
  attachments:
    image:
      max-width: 1920
      max-height: 1080
      jpeg-quality: 0.85
```

Permite ajustar sin recompilar.

## Risks / Trade-offs

- **`getUserMedia` requiere HTTPS en producción** → Ya cubierto (la app se sirve con TLS). En desarrollo local con `localhost` funciona sin TLS.
- **GIF animado pierde animación al comprimir como JPEG** → Se acepta: los GIFs animados no son un caso de uso de tickets/recibos. El tipo se convierte a JPEG estático.
- **Imágenes en modo CMYK (algunos PDFs/scans) pueden dar error con `ImageIO`** → Los PDFs no se procesan (solo imágenes). PNGs/JPEGs de cámara son siempre RGB. Se añade try/catch para guardar el original si el procesamiento falla.
- **Canvas toBlob() es asíncrono** → Se gestiona con Promise en el componente Angular.

## Migration Plan

- Sin cambios de schema de base de datos ni de API: despliegue directo.
- Las imágenes existentes no se recomprimen: solo las nuevas subidas aplican la optimización.
- Rollback: revertir `AttachmentService` a la versión anterior no afecta a imágenes ya guardadas.

## Open Questions

- ¿Mostrar el botón de cámara siempre o solo en móvil (viewport ≤ 640px)? → Por defecto, mostrar siempre pero con detección de soporte (`getUserMedia` disponible). En escritorio también es útil si hay webcam.
