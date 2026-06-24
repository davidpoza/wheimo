## ADDED Requirements

### Requirement: Upload attachments to a transaction
The system SHALL allow users to upload one or more files (JPEG, PNG, GIF, WebP, or PDF) to a transaction from the transaction detail dialog. The backend SHALL store the original filename for display purposes.

#### Scenario: Successful file upload
- **WHEN** the user selects one or more valid files in the upload control within the transaction detail dialog
- **THEN** each file is sent to `POST /attachments` with the `transactionId` parameter
- **THEN** the attachment list in the dialog refreshes to show the newly uploaded files with their original filenames

#### Scenario: Invalid file type rejected
- **WHEN** the user attempts to upload a file with a type other than image/jpeg, image/png, image/gif, image/webp, or application/pdf
- **THEN** the backend returns a 400 error
- **THEN** the file does not appear in the attachment list

### Requirement: Display attachment list with type-aware icons
The system SHALL display a list of attachments in the transaction detail dialog, showing each attachment's original filename (or description if set) and a type-appropriate icon (image icon for images, file icon for PDFs).

#### Scenario: Attachments shown with correct icons
- **WHEN** a transaction has one or more attachments
- **THEN** image attachments display an image icon
- **THEN** PDF attachments display a file icon
- **THEN** each item shows the original filename or description as its label

### Requirement: View image attachment in modal
The system SHALL allow users to view image attachments (JPEG, PNG, GIF, WebP) in an overlay modal without leaving the transaction detail dialog.

#### Scenario: Click image attachment opens viewer modal
- **WHEN** the user clicks on an attachment whose MIME type starts with `image/`
- **THEN** the system fetches the file from `GET /attachments/{id}` as a blob
- **THEN** an image viewer modal opens displaying the image at its natural size within the viewport
- **THEN** the modal can be closed by the user

#### Scenario: Modal closes and memory is cleaned up
- **WHEN** the user closes the image viewer modal
- **THEN** the object URL created for the image blob is revoked

### Requirement: Download PDF attachment
The system SHALL allow users to download PDF attachments directly from the transaction detail dialog.

#### Scenario: Click PDF attachment triggers download
- **WHEN** the user clicks on an attachment whose MIME type is `application/pdf`
- **THEN** the system fetches the file from `GET /attachments/{id}` as a blob
- **THEN** the browser downloads the file using the attachment's original filename
- **THEN** the object URL created for the blob is revoked after the download is triggered

### Requirement: Delete attachment
The system SHALL allow users to delete individual attachments from a transaction via a delete button next to each attachment in the list.

#### Scenario: Successful attachment deletion
- **WHEN** the user clicks the delete button for an attachment
- **THEN** the system calls `DELETE /attachments/{id}`
- **THEN** the attachment list in the dialog refreshes and no longer shows the deleted attachment

### Requirement: Backend preserves original filename
The backend SHALL store the original filename provided by the client's multipart upload in an `original_filename` column on the `attachments` table, and include it in the `AttachmentDto` response.

#### Scenario: Upload stores original filename
- **WHEN** a file named `receipt-jan-2025.pdf` is uploaded
- **THEN** the `attachments` record has `original_filename = 'receipt-jan-2025.pdf'`
- **THEN** the `AttachmentDto` returned includes `originalFilename: 'receipt-jan-2025.pdf'`

#### Scenario: Existing attachments without original filename
- **WHEN** an attachment row has a NULL `original_filename`
- **THEN** the `AttachmentDto` returns the UUID-based `filename` as the display name fallback
