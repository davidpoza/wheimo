## 1. Backend — Optimización de imágenes

- [x] 1.1 Añadir propiedades de configuración de imagen en `application.yml`: `app.attachments.image.max-width`, `app.attachments.image.max-height`, `app.attachments.image.jpeg-quality`
- [x] 1.2 Crear clase de configuración `AttachmentImageProperties` (o añadir campos a la configuración existente de attachments) anotada con `@ConfigurationProperties`
- [x] 1.3 Implementar método privado `optimizeImage(byte[] input, String mimeType): byte[]` en `AttachmentService` usando `javax.imageio`: detectar si es imagen, reescalar proporcionalmente a max-width/max-height con interpolación bicúbica, comprimir JPEG a jpeg-quality
- [x] 1.4 Integrar `optimizeImage()` en el flujo de `AttachmentService.save()` antes de escribir el fichero al disco, con try/catch para guardar el original si el procesamiento falla
- [x] 1.5 Verificar que PDFs pasan por el flujo sin ser procesados (condición `mimeType.startsWith("image/")`)

## 2. Frontend — Componente CameraCaptureComponent

- [x] 2.1 Crear directorio `frontend/src/app/shared/components/camera-capture/` y los ficheros del componente standalone (`camera-capture.component.ts`, `camera-capture.component.html`)
- [x] 2.2 Implementar en el template: elemento `<video>` para previsualización en vivo, `<canvas>` oculto para captura, `<img>` para mostrar el fotograma capturado, botones Capturar/Repetir/Usar foto/Cancelar, y `<input type="file" accept="image/*" capture="environment">` oculto para fallback
- [x] 2.3 Implementar en el componente TypeScript: `@Output() photoCaptured: EventEmitter<File>`, `@Output() cancelled: EventEmitter<void>`, lógica de `getUserMedia()` con `facingMode: { ideal: 'environment' }`, captura de fotograma con `canvas.toBlob('image/jpeg', 0.92)`, detección de soporte para activar fallback, y limpieza de MediaStream en `ngOnDestroy`
- [x] 2.4 Exportar el componente desde el barrel de shared si existe, o asegurarse de que es importable como standalone

## 3. Frontend — Integración en TransactionDetailsDialogComponent

- [x] 3.1 Importar `CameraCaptureComponent` en `transaction-details-dialog.component.ts`
- [x] 3.2 Añadir signal/variable de estado `showCameraCapture = signal(false)` para controlar la visibilidad del modal de cámara
- [x] 3.3 Añadir método `onPhotoCaptured(file: File)` que llame a `attachmentService.upload()` con el fichero capturado (reutilizando el mismo flujo que `onFilesSelected()`) y cierre el modal
- [x] 3.4 En el template HTML, añadir botón "Cámara" en la pestaña de adjuntos junto al FileUpload existente
- [x] 3.5 En el template HTML, añadir `<app-camera-capture>` dentro de un `<p-dialog>` controlado por `showCameraCapture`, con binding a `(photoCaptured)` y `(cancelled)`
