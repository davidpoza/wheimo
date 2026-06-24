## 1. Fetcher: Preparación

- [x] 1.1 Añadir dependencia `org.apache.poi:poi:5.3.0` al `pom.xml` del fetcher
- [x] 1.2 Verificar columnas exactas del XLS abriendo `fetcher/Movimientos de Tarjeta.xls` con Apache POI y logueando las cabeceras

## 2. Fetcher: Parser XLS

- [x] 2.1 Crear `OpenbankXlsImporter` que implemente la lógica de parsing: leer filas, mapear columnas (Fecha, Concepto, Importe, Saldo) a `ImportedTransaction`
- [x] 2.2 Implementar generación de `importId` con SHA-256 igual que en `OpenbankImporter`
- [x] 2.3 Crear `XlsImportController` con endpoint `POST /import/xls` que reciba `MultipartFile` + `accountId` + `userId` y devuelva `List<ImportedTransaction>`
- [x] 2.4 Añadir DTO de respuesta `XlsImportResponse` con la lista de transacciones (o reusar `SyncResultMessage`)

## 3. Backend: Endpoint proxy

- [x] 3.1 Añadir propiedad de configuración `fetcher.url=http://wheimo-fetcher:8081` en `application.properties`
- [x] 3.2 Crear `FetcherClient` (usando `RestTemplate`) que haga `POST /import/xls` al fetcher con el fichero multipart
- [x] 3.3 Crear `XlsImportService` que: llame a `FetcherClient`, construya el `SyncResultMessage` con el resultado, llame a `transactionService.processImportResult()` y devuelva el resumen `{ imported, skipped }`
- [x] 3.4 Crear `XlsImportController` con endpoint `POST /accounts/{accountId}/import/xls`, verificando que la cuenta pertenece al usuario autenticado
- [x] 3.5 Añadir manejo de errores: 403 si la cuenta no pertenece al usuario, 422 si el fetcher devuelve error de parsing

## 4. Frontend: UI de upload

- [x] 4.1 Añadir botón/opción "Importar XLS" en la pantalla de detalle de cuenta
- [x] 4.2 Crear componente de upload con selector de fichero y botón de confirmar
- [x] 4.3 Llamar al endpoint `POST /accounts/{accountId}/import/xls` con el fichero
- [x] 4.4 Mostrar resultado al usuario: "X movimientos importados, Y ignorados (duplicados)"
- [x] 4.5 Mostrar error legible en caso de fallo (422 o error de red)
- [x] 4.6 Refrescar la lista de transacciones de la cuenta tras una importación exitosa

## 5. Verificación

- [ ] 5.1 Importar el fichero de muestra `Movimientos de Tarjeta.xls` end-to-end y verificar que las transacciones aparecen correctamente
- [ ] 5.2 Reimportar el mismo fichero y verificar que no se crean duplicados (`imported: 0`)
