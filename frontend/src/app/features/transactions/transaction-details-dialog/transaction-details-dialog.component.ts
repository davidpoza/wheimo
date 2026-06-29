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
import { TabsModule } from 'primeng/tabs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TransactionsService } from '../transactions.service';
import { AttachmentService } from '../attachment.service';
import { TagsService } from '@features/tags/tags.service';
import { AccountsService } from '@features/accounts/accounts.service';
import { Transaction } from '@core/models/transaction.model';
import { Attachment } from '@core/models/attachment.model';
import { CameraCaptureComponent } from '@shared/components/camera-capture/camera-capture.component';

@Component({
  selector: 'app-transaction-details-dialog',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, FormsModule,
    DialogModule, ButtonModule, InputTextModule, TextareaModule,
    MultiSelectModule, TagModule, FileUploadModule, TabsModule,
    ConfirmDialogModule, TranslocoModule,
    CameraCaptureComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './transaction-details-dialog.component.html',
  styleUrl: './transaction-details-dialog.component.scss',
})
export class TransactionDetailsDialogComponent {
  private readonly txService = inject(TransactionsService);
  private readonly attachmentService = inject(AttachmentService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);
  readonly tagsService = inject(TagsService);
  private readonly accountsService = inject(AccountsService);

  visible = input<boolean>(false);
  transaction = input<Transaction | null>(null);
  visibleChange = output<boolean>();
  saved = output<void>();
  transactionChange = output<Transaction>();

  comments = signal('');
  selectedTagIds = signal<number[]>([]);
  localTransaction = signal<Transaction | null>(null);
  previewImageUrl = signal<string | null>(null);
  showCameraCapture = signal(false);
  readonly thumbCache = signal(new Map<number, string>());

  constructor() {
    effect(() => {
      const tx = this.transaction();
      if (tx) {
        this.localTransaction.set(tx);
        this.comments.set(tx.comments ?? '');
        this.selectedTagIds.set(tx.tags.map((t) => t.id));
        this.fetchMissingThumbnails(tx);
      }
    });
  }

  get allTags() {
    return this.tagsService.tags();
  }

  accountName(accountId: number): string {
    return this.accountsService.accounts().find(a => a.id === accountId)?.name ?? '';
  }

  attachmentLabel(att: Attachment): string {
    return att.originalFilename || att.description || att.filename;
  }

  isImage(att: Attachment): boolean {
    return att.type.startsWith('image/');
  }

  onFilesSelected(event: { currentFiles: File[] }): void {
    const tx = this.localTransaction();
    if (!tx || !event.currentFiles?.length) return;
    this.uploadFiles(tx.id, event.currentFiles);
  }

  onPhotoCaptured(file: File): void {
    const tx = this.localTransaction();
    if (!tx) return;
    this.showCameraCapture.set(false);
    this.uploadFiles(tx.id, [file]);
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
    this.confirmationService.confirm({
      message: this.transloco.translate('transactions.details.confirm.deleteAttachment.message', { name: this.attachmentLabel(att) }),
      header: this.transloco.translate('transactions.details.confirm.deleteAttachment.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('transactions.details.confirm.deleteAttachment.accept'),
      rejectLabel: this.transloco.translate('transactions.details.confirm.deleteAttachment.reject'),
      acceptButtonProps: { severity: 'danger' },
      accept: () => {
        const cached = this.thumbCache().get(att.id);
        if (cached) {
          URL.revokeObjectURL(cached);
          this.thumbCache.update(m => { const next = new Map(m); next.delete(att.id); return next; });
        }
        this.attachmentService.delete(att.id).subscribe({
          next: () => this.refreshTransaction(),
        });
      },
    });
  }

  private fetchMissingThumbnails(tx: Transaction): void {
    const cache = this.thumbCache();
    tx.attachments
      .filter(att => att.type.startsWith('image/') && !cache.has(att.id))
      .forEach(att => {
        this.attachmentService.downloadThumbnail(att.id).subscribe({
          next: (blob) => {
            const url = URL.createObjectURL(blob);
            this.thumbCache.update(m => new Map(m).set(att.id, url));
          },
        });
      });
  }

  private uploadFiles(transactionId: number, files: File[]): void {
    const uploads = files.map((file) =>
      this.attachmentService.upload(transactionId, file)
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

  private refreshTransaction(): void {
    const tx = this.localTransaction();
    if (!tx) return;
    this.txService.getById(tx.id).subscribe((updated) => {
      this.localTransaction.set(updated);
      this.transactionChange.emit(updated);
      this.fetchMissingThumbnails(updated);
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
