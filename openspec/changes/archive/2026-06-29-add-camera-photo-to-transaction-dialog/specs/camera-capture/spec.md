## ADDED Requirements

### Requirement: Captura de foto via cámara en transaction-details-dialog
El sistema SHALL permitir al usuario capturar una fotografía directamente desde la cámara del dispositivo dentro del diálogo de detalles de transacción y adjuntarla a la transacción sin salir del diálogo.

#### Scenario: Botón de cámara visible en pestaña de adjuntos
- **WHEN** el usuario abre la pestaña de adjuntos en el transaction-details-dialog
- **THEN** se muestra un botón "Cámara" junto al botón existente de subir archivo

#### Scenario: Apertura de la cámara con previsualización en vivo
- **WHEN** el usuario pulsa el botón "Cámara"
- **THEN** se abre un modal con la previsualización en vivo de la cámara trasera del dispositivo

#### Scenario: Captura de fotograma
- **WHEN** el usuario pulsa el botón "Capturar" en el modal de cámara
- **THEN** se congela la imagen del fotograma actual y se muestra una previsualización de la foto capturada

#### Scenario: Reintento de captura
- **WHEN** el usuario ha capturado un fotograma y pulsa "Repetir"
- **THEN** el modal vuelve a la previsualización en vivo para capturar de nuevo

#### Scenario: Upload de la foto capturada
- **WHEN** el usuario pulsa "Usar foto" tras la captura
- **THEN** la imagen se sube como adjunto a la transacción y aparece en la cuadrícula de adjuntos

#### Scenario: Cancelación del modal de cámara
- **WHEN** el usuario pulsa "Cancelar" en cualquier momento del modal
- **THEN** el modal se cierra, la cámara se detiene y no se sube ningún archivo

#### Scenario: Liberación de recursos de cámara al cerrar
- **WHEN** el modal de cámara se cierra (por cualquier motivo)
- **THEN** todos los tracks del MediaStream activo deben detenerse para liberar la cámara del dispositivo

### Requirement: Fallback cuando getUserMedia no está disponible
El sistema SHALL ofrecer un mecanismo alternativo de captura de foto cuando `navigator.mediaDevices.getUserMedia` no esté disponible en el navegador.

#### Scenario: Fallback a input nativo con capture
- **WHEN** `navigator.mediaDevices.getUserMedia` no está disponible
- **THEN** al pulsar "Cámara" se activa un `<input type="file" accept="image/*" capture="environment">` nativo del navegador

#### Scenario: Procesamiento del archivo del fallback
- **WHEN** el usuario selecciona o captura una imagen mediante el input nativo de fallback
- **THEN** el archivo se sube como adjunto igual que si se hubiera capturado con getUserMedia
