## ADDED Requirements

### Requirement: Compresión y reescalado automático de imágenes en upload
El backend SHALL comprimir y reescalar automáticamente las imágenes subidas como adjuntos antes de guardarlas en disco, para reducir el uso de almacenamiento manteniendo calidad visual aceptable.

#### Scenario: Imagen dentro de límites de dimensión no se reescala
- **WHEN** se sube una imagen cuyas dimensiones son menores o iguales al máximo configurado (1920×1080 px)
- **THEN** la imagen se guarda con sus dimensiones originales pero comprimida al nivel de calidad JPEG configurado

#### Scenario: Imagen más grande que el límite se reescala proporcionalmente
- **WHEN** se sube una imagen cuya anchura o altura supera el máximo configurado
- **THEN** la imagen se guarda reescalada proporcionalmente para que quepa en 1920×1080 px sin distorsión, y comprimida a la calidad JPEG configurada

#### Scenario: Imagen no JPEG se convierte a JPEG tras optimización
- **WHEN** se sube una imagen PNG, WebP o GIF
- **THEN** la imagen se optimiza y se guarda en formato JPEG con la calidad configurada, manteniendo el `type` original en la base de datos para referencia

#### Scenario: Fallo en procesamiento de imagen no bloquea el upload
- **WHEN** el procesamiento de imagen falla por cualquier motivo (formato inusual, imagen corrupta, error de I/O)
- **THEN** el sistema guarda el archivo original sin procesar y el upload completa igualmente (sin error para el usuario)

#### Scenario: PDFs no son procesados
- **WHEN** se sube un archivo PDF como adjunto
- **THEN** el archivo se guarda tal cual sin ningún procesamiento de imagen

### Requirement: Configuración externalizada de parámetros de optimización
El sistema SHALL permitir configurar los parámetros de optimización de imagen sin recompilar el backend.

#### Scenario: Parámetros configurables en application.yml
- **WHEN** se modifican los valores de `app.attachments.image.max-width`, `app.attachments.image.max-height` o `app.attachments.image.jpeg-quality` en la configuración
- **THEN** el sistema aplica los nuevos valores en los siguientes uploads sin necesidad de cambios en código
