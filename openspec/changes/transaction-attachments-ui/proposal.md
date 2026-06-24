## Why

Users need to attach supporting documents (receipts, invoices, screenshots) to transactions for bookkeeping and auditing purposes. The backend infrastructure already exists (`Attachment` entity, `AttachmentController`, `AttachmentService`) but the frontend UI is incomplete — it only shows a static list with no upload, download, image preview, or delete functionality.

## What Changes

- Add `originalFilename` field to the `Attachment` backend entity and DTO, preserved from the uploaded file's original name, so display names are human-readable rather than UUID-based.
- Add a Flyway migration (V17) to add the `original_filename` column to the `attachments` table.
- Create an `AttachmentService` on the frontend to call upload, download (as blob), and delete endpoints.
- Replace the static attachment list in `TransactionDetailsDialogComponent` with a fully interactive UI:
  - File upload control (supports PDF + images, multiple files)
  - Per-attachment actions: click PDF → download, click image → open in viewer modal, delete button
  - List refreshes after upload or delete

## Capabilities

### New Capabilities

- `transaction-attachments`: Full attachment management UX within the transaction detail dialog — upload files, list attachments with type-aware actions (image modal / PDF download), and delete attachments.

### Modified Capabilities

<!-- none -->

## Impact

- **Backend**: `Attachment.java`, `AttachmentDto.java`, `AttachmentService.java` (save originalFilename), new migration `V17__add_attachment_original_filename.sql`
- **Frontend**: New `AttachmentService`, updated `TransactionDetailsDialogComponent` (TS + HTML), updated `Attachment` model (add `originalFilename`)
- **No breaking changes** to existing API endpoints — `originalFilename` is additive
