import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TransactionsService } from '../transactions.service';
import { RecurrentsService } from '../../recurrents/recurrents.service';
import { Transaction } from '../../../core/models/transaction.model';
import { RecurrentLink } from '../../../core/models/recurrent.model';
import { TransactionDetailsDialogComponent } from '../transaction-details-dialog/transaction-details-dialog.component';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { CreateTransactionDialogComponent } from '../create-transaction-dialog/create-transaction-dialog.component';
import { TaggingDialogComponent } from '../tagging-dialog/tagging-dialog.component';

@Component({
  selector: 'app-transaction-grid',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    CheckboxModule,
    ToastModule,
    TransactionDetailsDialogComponent,
    TransactionFilterComponent,
    CreateTransactionDialogComponent,
    TaggingDialogComponent,
  ],
  providers: [MessageService],
  templateUrl: './transaction-grid.component.html',
  styleUrl: './transaction-grid.component.scss',
})
export class TransactionGridComponent implements OnInit {
  private readonly txService = inject(TransactionsService);
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly messageService = inject(MessageService);

  transactions = this.txService.transactions;
  total = this.txService.total;
  filters = this.txService.filters;

  selected = signal<Transaction[]>([]);
  detailTx = signal<Transaction | null>(null);
  detailVisible = signal(false);
  createVisible = signal(false);
  taggingVisible = signal(false);
  expandedRows: Record<number, boolean> = {};

  ngOnInit() {
    this.txService.loadAll().subscribe();
  }

  onPage(event: { first: number; rows: number }) {
    this.txService.filters.update((f) => ({ ...f, offset: event.first, limit: event.rows }));
    this.txService.loadAll().subscribe();
  }

  openDetail(tx: Transaction) {
    this.detailTx.set(tx);
    this.detailVisible.set(true);
  }

  onDetailSaved() {
    this.detailVisible.set(false);
    this.txService.loadAll().subscribe();
  }

  onCreated() {
    this.createVisible.set(false);
    this.txService.loadAll().subscribe();
  }

  openTagging() {
    this.taggingVisible.set(true);
  }

  onTaggingDone() {
    this.taggingVisible.set(false);
    this.txService.loadAll().subscribe();
  }

  toggleFav(tx: Transaction) {
    this.txService.update(tx.id, { favourite: !tx.favourite }).subscribe({
      next: () => this.txService.loadAll().subscribe(),
    });
  }

  applyTags(tx: Transaction) {
    this.txService.applyTags(tx.id).subscribe({
      next: () => this.txService.loadAll().subscribe(),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error applying tags' }),
    });
  }

  unassignRecurrent(tx: Transaction, link: RecurrentLink) {
    this.recurrentsService.unassignTransaction(link.recurrentId, tx.id).subscribe({
      next: () => {
        this.txService.loadAll().subscribe();
        this.messageService.add({ severity: 'success', summary: 'Vínculo eliminado' });
      },
    });
  }
}
