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
import { TagsService } from '../../tags/tags.service';
import { Transaction } from '../../../core/models/transaction.model';
import { environment } from '../../../../environments/environment';

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
  readonly tagsService = inject(TagsService);

  visible = input<boolean>(false);
  transaction = input<Transaction | null>(null);
  visibleChange = output<boolean>();
  saved = output<void>();

  comments = signal('');
  note = signal('');
  selectedTagIds = signal<number[]>([]);
  uploadUrl = `${environment.apiUrl}/attachments`;

  constructor() {
    effect(() => {
      const tx = this.transaction();
      if (tx) {
        this.comments.set(tx.comments ?? '');
        this.note.set(tx.note ?? '');
        this.selectedTagIds.set(tx.tags.map((t) => t.id));
      }
    });
  }

  get allTags() {
    return this.tagsService.tags();
  }

  save() {
    const tx = this.transaction();
    if (!tx) return;
    this.txService.update(tx.id, {
      comments: this.comments(),
      note: this.note() || null,
      tags: this.selectedTagIds(),
    } as any).subscribe({ next: () => this.saved.emit() });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
