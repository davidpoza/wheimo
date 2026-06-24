import { Component, inject, input, output, effect, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { TagModule } from 'primeng/tag';
import { FileUploadModule } from 'primeng/fileupload';
import { TransactionsService } from '../transactions.service';
import { AttachmentService } from '../attachment.service';
import { TagsService } from '../../tags/tags.service';
import { Transaction } from '../../../core/models/transaction.model';
import { Attachment } from '../../../core/models/attachment.model';

@Component({
  selector: 'app-transaction-details-dialog',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, FormsModule,
    DialogModule, ButtonModule, InputTextModule, TextareaModule,
    MultiSelectModule, TagModule, FileUploadModule,
  ],
  templateUrl: './transaction-details-dialog.component.html',
})
export class TransactionDetailsDialogComponent {
  private readonly txService = inject(TransactionsService);
  private readonly attachmentService = inject(AttachmentService);
  readonly tagsService = inject(TagsService);

  visible = input<boolean>(false);
  transaction = input<Transaction | null>(null);
  visibleChange = output<boolean>();
  saved = output<void>();
  transactionChange = output<Transaction>();

  comments = signal('');
  selectedTagIds = signal<number[]>([]);
  localTransaction = signal<Transaction | null>(null);
  previewImageUrl = signal<string | null>(null);

  constructor() {
    effect(() => {
      const tx = this.transaction();
      if (tx) {
        this.localTransaction.set(tx);
        this.comments.set(tx.comments ?? '');
        this.selectedTagIds.set(tx.tags.map((t) => t.id));
      }
    });
  }

  get allTags() {
    return this.tagsService.tags();
  }

  attachmentLabel(att: Attachment): string {
    return att.originalFilename || att.description || att.filename;
  }

  isImage(att: Attachment): boolean {
    return att.type.startsWith('image/');
  }

  onFilesSelected(event: { files: File[] }): void {
    const tx = this.localTransaction();
    if (!tx || !event.files?.length) return;
    const uploads = event.files.map((file) =>
      this.attachmentService.upload(tx.id, file)
    );
    let completed = 0;
    uploads.forEach((obs) => {
      obs.subscribe({
        next: () => {
          completed++;
          if (completed === uploads.length) this.refreshTransaction();
        },
      });
    });
  }

  openAttachment(att: Attachment): void {
    this.attachmentService.download(att.id).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      if (this.isImage(att)) {
        this.previewImageUrl.set(url);
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = att.originalFilename || att.filename;
        a.click();
        URL.revokeObjectURL(url);
      }
    });
  }

  closeImagePreview(): void {
    const url = this.previewImageUrl();
    if (url) URL.revokeObjectURL(url);
    this.previewImageUrl.set(null);
  }

  deleteAttachment(att: Attachment): void {
    this.attachmentService.delete(att.id).subscribe({
      next: () => this.refreshTransaction(),
    });
  }

  private refreshTransaction(): void {
    const tx = this.localTransaction();
    if (!tx) return;
    this.txService.getById(tx.id).subscribe((updated) => {
      this.localTransaction.set(updated);
      this.transactionChange.emit(updated);
    });
  }

  save() {
    const tx = this.localTransaction();
    if (!tx) return;
    this.txService.update(tx.id, {
      comments: this.comments(),
      tags: this.selectedTagIds(),
    } as any).subscribe({ next: () => this.saved.emit() });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
