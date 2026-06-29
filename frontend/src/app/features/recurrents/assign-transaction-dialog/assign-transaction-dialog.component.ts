import { Component, inject, input, output, OnInit, OnDestroy, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PaginatorModule } from 'primeng/paginator';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { RecurrentsService } from '../recurrents.service';
import { TransactionsService } from '@features/transactions/transactions.service';
import { Recurrent, RecurrentLink } from '@core/models/recurrent.model';
import { Transaction, TransactionFilters } from '@core/models/transaction.model';

@Component({
  selector: 'app-assign-transaction-dialog',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, FormsModule,
    ButtonModule, DialogModule, DatePickerModule,
    InputTextModule, RadioButtonModule, PaginatorModule,
    ToastModule, TooltipModule, TranslocoModule,
  ],
  providers: [MessageService],
  templateUrl: './assign-transaction-dialog.component.html',
  styles: [`
    .filters-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .filters-row .field { flex: 1; margin: 0; }
    .field label { display: block; font-size: 0.85rem; font-weight: 500; color: var(--text-color-secondary); margin-bottom: 0.35rem; }
    .tx-list { border: 1px solid var(--surface-border); border-radius: var(--border-radius); overflow: hidden; margin-bottom: 0.75rem; max-height: 280px; overflow-y: auto; }
    .tx-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.6rem 0.875rem; cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--surface-border); }
    .tx-item:last-child { border-bottom: none; }
    .tx-item:hover { background: var(--surface-hover); }
    .tx-item.selected { background: var(--highlight-bg); }
    .tx-date { font-size: 0.8rem; color: var(--text-color-secondary); white-space: nowrap; min-width: 60px; }
    .tx-desc { flex: 1; font-size: 0.875rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tx-amount { font-size: 0.875rem; font-weight: 600; white-space: nowrap; }
    .tx-amount.expense { color: var(--red-500); }
    .tx-amount.income { color: var(--green-500); }
    .empty-list, .loading-list { padding: 1.5rem; text-align: center; color: var(--text-color-secondary); font-size: 0.875rem; }
    .assign-action { display: flex; justify-content: flex-end; margin-bottom: 1rem; }
    .linked-section h4 { margin: 0 0 0.5rem; font-size: 0.875rem; color: var(--text-color-secondary); }
    .linked-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
    .linked-table th, .linked-table td { padding: 0.4rem 0.5rem; text-align: left; }
    .linked-table thead tr { border-bottom: 1px solid var(--surface-border); }
    .linked-table tbody tr:not(:last-child) { border-bottom: 1px solid var(--surface-border); }
    .linked-table .expense { color: var(--red-500); }
  `],
})
export class AssignTransactionDialogComponent implements OnInit, OnDestroy {
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly txService = inject(TransactionsService);
  private readonly messageService = inject(MessageService);
  private readonly transloco = inject(TranslocoService);

  recurrent = input.required<Recurrent>();
  close = output<void>();

  readonly pageSize = 8;

  visible = signal(true);
  transactions = signal<Transaction[]>([]);
  selectedTransaction = signal<Transaction | null>(null);
  dateRange = signal<Date[] | null>(null);
  filterText = signal('');
  page = signal(0);
  total = signal(0);
  loading = signal(false);
  linkedTransactions = signal<RecurrentLink[]>([]);
  assigning = signal(false);

  private readonly textFilter$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  get defaultRange(): Date[] | null {
    const predicted = this.recurrent().nextPredictedDate;
    if (!predicted) return null;
    const base = new Date(predicted);
    const from = new Date(base.getTime() - 48 * 60 * 60 * 1000);
    const to = new Date(base.getTime() + 48 * 60 * 60 * 1000);
    return [from, to];
  }

  ngOnInit() {
    this.dateRange.set(this.defaultRange);
    this.loadLinked();

    this.textFilter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.page.set(0);
      this.doSearch();
    });

    this.doSearch();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  doSearch() {
    this.loading.set(true);
    const filters: TransactionFilters = {
      limit: this.pageSize,
      offset: this.page() * this.pageSize,
      sort: 'date,desc',
    };
    const text = this.filterText();
    if (text) filters.search = text;
    const range = this.dateRange();
    if (range?.[0]) filters.from = range[0].toISOString();
    if (range?.[1]) filters.to = range[1].toISOString();

    this.txService.search(filters).subscribe({
      next: (result) => {
        this.transactions.set(result.data);
        this.total.set(result.total);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onFilterTextChange(value: string) {
    this.filterText.set(value);
    this.textFilter$.next(value);
  }

  onDateChange() {
    this.page.set(0);
    this.doSearch();
  }

  onPageChange(event: { first?: number; rows?: number }) {
    this.page.set((event.first ?? 0) / this.pageSize);
    this.doSearch();
  }

  loadLinked() {
    this.recurrentsService.getLinkedTransactions(this.recurrent().id).subscribe({
      next: (links) => this.linkedTransactions.set(links),
    });
  }

  assign() {
    const tx = this.selectedTransaction();
    if (!tx) return;
    this.assigning.set(true);
    this.recurrentsService.assignTransaction(this.recurrent().id, tx.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('recurrents.assign.toast.assigned') });
        this.selectedTransaction.set(null);
        this.loadLinked();
        this.recurrentsService.loadAll().subscribe();
        this.assigning.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: this.transloco.translate('recurrents.assign.toast.assignError') });
        this.assigning.set(false);
      },
    });
  }

  unassign(link: RecurrentLink) {
    this.recurrentsService.unassignTransaction(this.recurrent().id, link.transactionId).subscribe({
      next: () => {
        this.loadLinked();
        this.recurrentsService.loadAll().subscribe();
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('recurrents.assign.toast.linkRemoved') });
      },
    });
  }

  onHide() {
    this.close.emit();
  }
}
