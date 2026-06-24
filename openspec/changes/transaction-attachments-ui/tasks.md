## 1. Backend — originalFilename support

- [x] 1.1 Add `original_filename TEXT` column to `attachments` table via new Flyway migration `V17__add_attachment_original_filename.sql`
- [x] 1.2 Add `originalFilename` field to `Attachment` entity (`@Column(name = "original_filename")`)
- [x] 1.3 Add `originalFilename` field to `AttachmentDto`
- [x] 1.4 Update `AttachmentService.upload()` to save `file.getOriginalFilename()` into `originalFilename`
- [x] 1.5 Update `AttachmentService.toDto()` to include `originalFilename` in the returned DTO

## 2. Frontend — Attachment model and service

- [x] 2.1 Add `originalFilename` field to the `Attachment` TypeScript model (`src/app/core/models/attachment.model.ts`)
- [x] 2.2 Create `src/app/features/transactions/attachment.service.ts` with:
  - `upload(transactionId, file): Observable<Attachment>` — `POST /attachments` multipart
  - `download(id): Observable<Blob>` — `GET /attachments/{id}` with `responseType: 'blob'`
  - `delete(id): Observable<void>` — `DELETE /attachments/{id}`

## 3. Frontend — Transaction detail dialog UI

- [x] 3.1 Add `FileUpload` PrimeNG component to `TransactionDetailsDialogComponent` template wired to `AttachmentService.upload()`, supporting PDF and image MIME types, multiple files
- [x] 3.2 Replace the static attachment list with an interactive list showing:
  - Image icon (`pi-image`) for image/* types, file icon (`pi-file-pdf` or `pi-file`) for PDFs
  - Display label using `att.originalFilename || att.description || att.filename`
  - Clickable row that calls the correct handler (image vs PDF)
  - Delete button per row (`pi-trash`) that calls `AttachmentService.delete()`
- [x] 3.3 Implement `openAttachment(att: Attachment)` method:
  - For images: fetch blob → create object URL → set `previewImageUrl` signal → open image modal
  - For PDFs: fetch blob → create object URL → trigger programmatic `<a download>` click → revoke URL
- [x] 3.4 Add image viewer modal (`<p-dialog>`) to the template controlled by `previewImageUrl` signal; revoke object URL on modal close
- [x] 3.5 After successful upload or delete, call `TransactionsService.getById(tx.id)` to refresh the transaction, update the local `transaction` signal in the dialog, and emit a `transactionChange` output so the parent can sync its list
- [x] 3.6 Inject `AttachmentService` and wire all signals/effects in the component TypeScript
