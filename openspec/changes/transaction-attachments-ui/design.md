## Context

The `attachments` table, `Attachment` JPA entity, `AttachmentController`, and `AttachmentService` already exist and are fully functional on the backend. The API supports upload (`POST /attachments`), download (`GET /attachments/{id}`), description update (`PATCH /attachments/{id}`), and delete (`DELETE /attachments/{id}`).

On the frontend, `Transaction` already carries `attachments: Attachment[]` and `TransactionDetailsDialogComponent` imports `FileUploadModule` but shows only a static icon list with no interactivity. The `Attachment` model lacks `originalFilename`.

## Goals / Non-Goals

**Goals:**
- Preserve the original upload filename for human-readable display (backend `original_filename` column + DTO field)
- Expose file upload UI inside the transaction detail dialog
- Make each attachment clickable: images open in a viewer modal, PDFs trigger a browser download
- Allow deleting individual attachments
- Refresh the attachment list in the dialog after any mutation

**Non-Goals:**
- Inline image editor or annotation
- Bulk upload progress tracking beyond what PrimeNG's FileUpload provides
- Changing the storage backend (stays on-disk)
- Attachment drag-and-drop reordering

## Decisions

### 1. Store originalFilename in the backend

**Decision**: Add `original_filename TEXT` column to the `attachments` table and populate it at upload time from `file.getOriginalFilename()`.

**Why**: The stored filename is a UUID (e.g., `e3b0c44298.pdf`). Without the original name, the UI must fall back to `description`, which may be empty. Storing it server-side keeps the display name authoritative and avoids requiring the client to pass it separately.

**Alternative considered**: Client sends original name in a separate form field → rejected because it duplicates what the server already has from the multipart metadata.

### 2. Frontend AttachmentService as a standalone injectable

**Decision**: Create `src/app/features/transactions/attachment.service.ts` with `upload()`, `download()` (returns `Observable<Blob>`), and `delete()` methods.

**Why**: Keeps attachment HTTP calls out of `TransactionsService` (single-responsibility) and makes it easy to inject in the dialog without coupling to the transaction store.

### 3. Image viewer: inline PrimeNG Dialog inside TransactionDetailsDialogComponent

**Decision**: Add a second `<p-dialog>` inside `TransactionDetailsDialogComponent` for image preview, controlled by a `previewUrl` signal. No separate component.

**Why**: The dialog is self-contained and the image viewer is trivial (just an `<img>`). A separate component would add file overhead with no reuse benefit.

**Alternative considered**: `p-image` with `preview` mode → rejected because it does not support programmatic open from a click handler; relies on an overlay trigger within its own template.

### 4. PDF download via anchor + object URL

**Decision**: Call `GET /attachments/{id}`, receive a `Blob`, create an object URL, attach it to a temporary `<a>` element with the `download` attribute, and click it programmatically.

**Why**: The backend sets `Content-Disposition: inline`, which causes browsers to try to open PDFs in a new tab rather than download. The programmatic anchor approach forces a download with the original filename regardless of browser settings.

### 5. Attachment list refresh after upload/delete

**Decision**: After a successful upload or delete, call `TransactionsService.getById(tx.id)` and emit the refreshed transaction via a new `transactionChange` output so the parent grid can update its local record.

**Why**: The dialog already receives `transaction` as an input signal. Re-fetching by ID gives a fresh `attachments` array without reloading the whole transaction list.

## Risks / Trade-offs

- [Object URLs not revoked] → Call `URL.revokeObjectURL()` after the download anchor fires / after the image modal closes to prevent memory leaks.
- [Large image downloads slow the modal open] → Acceptable for now; images are expected to be receipt/invoice photos, not large assets.
- [originalFilename column is nullable for existing rows] → Migration adds it as `TEXT` (nullable); existing attachments display `filename` (UUID) as fallback in the DTO `displayName` helper.
