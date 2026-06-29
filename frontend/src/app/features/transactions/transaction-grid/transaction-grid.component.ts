import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TransactionsService } from '../transactions.service';
import { RecurrentsService } from '@features/recurrents/recurrents.service';
import { TagsService } from '@features/tags/tags.service';
import { Transaction } from '@core/models/transaction.model';
import { RecurrentLink } from '@core/models/recurrent.model';
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
    ConfirmDialogModule,
    TranslocoModule,
    TransactionDetailsDialogComponent,
    TransactionFilterComponent,
    CreateTransactionDialogComponent,
    TaggingDialogComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './transaction-grid.component.html',
  styleUrl: './transaction-grid.component.scss',
})
export class TransactionGridComponent implements OnInit {
  private readonly txService = inject(TransactionsService);
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  transactions = this.txService.transactions;
  total = this.txService.total;
  filters = this.txService.filters;

  selected = signal<Transaction[]>([]);
  mobileSelectMode = signal(false);
  selectAllActive = signal(false);
  allSelectedIds = signal<number[]>([]);
  detailTx = signal<Transaction | null>(null);
  detailVisible = signal(false);
  createVisible = signal(false);
  taggingVisible = signal(false);
  expandedRows: Record<string, boolean> = {};

  private longPressTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.tagsService.loadTags().subscribe();
    this.txService.loadAll().subscribe();
  }

  get sortField() {
    return this.filters().sort?.split(',')[0] ?? 'date';
  }

  get sortOrder(): 1 | -1 {
    return this.filters().sort?.split(',')[1] === 'asc' ? 1 : -1;
  }

  onPage(event: { first: number; rows: number }) {
    this.txService.filters.update((f) => ({ ...f, offset: event.first, limit: event.rows }));
    this.txService.loadAll().subscribe();
  }

  onSort(event: { field: string; order: 1 | -1 }) {
    const dir = event.order === 1 ? 'asc' : 'desc';
    this.txService.filters.update((f) => ({ ...f, sort: `${event.field},${dir}`, offset: 0 }));
    this.txService.loadAll().subscribe();
  }

  onTouchStart(event: TouchEvent, tx: Transaction) {
    this.longPressTimer = setTimeout(() => this.enterSelectMode(tx), 500);
  }

  onTouchEnd() {
    if (this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; }
  }

  onTouchMove() {
    if (this.longPressTimer) { clearTimeout(this.longPressTimer); this.longPressTimer = null; }
  }

  enterSelectMode(tx: Transaction) {
    this.mobileSelectMode.set(true);
    if (!this.isSelected(tx)) this.selected.update(s => [...s, tx]);
  }

  toggleMobileSelection(tx: Transaction) {
    if (this.isSelected(tx)) {
      this.selected.update(s => s.filter(t => t.id !== tx.id));
      if (this.selected().length === 0) this.mobileSelectMode.set(false);
    } else {
      this.selected.update(s => [...s, tx]);
    }
  }

  effectiveIds(): number[] {
    return this.selectAllActive()
      ? this.allSelectedIds()
      : this.selected().map(t => t.id);
  }

  selectAll() {
    this.txService.getAllIds().subscribe(ids => {
      this.allSelectedIds.set(ids);
      this.selectAllActive.set(true);
      this.selected.set(this.transactions());
    });
  }

  cancelAllSelection() {
    this.selectAllActive.set(false);
    this.allSelectedIds.set([]);
    this.selected.set([]);
    this.mobileSelectMode.set(false);
  }

  cancelMobileSelection() {
    this.selected.set([]);
    this.mobileSelectMode.set(false);
    this.selectAllActive.set(false);
    this.allSelectedIds.set([]);
  }

  isSelected(tx: Transaction): boolean {
    if (this.selectAllActive()) return true;
    return this.selected().some(t => t.id === tx.id);
  }

  openDetail(tx: Transaction) {
    if (this.mobileSelectMode()) { this.toggleMobileSelection(tx); return; }
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
    this.cancelAllSelection();
    this.txService.loadAll().subscribe();
  }

  deleteSelected() {
    const ids = this.effectiveIds();
    if (ids.length === 0) return;

    this.confirmationService.confirm({
      message: this.transloco.translate('transactions.grid.confirm.deleteSelected.message', { count: ids.length }),
      header: this.transloco.translate('transactions.grid.confirm.deleteSelected.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('transactions.grid.confirm.deleteSelected.accept'),
      rejectLabel: this.transloco.translate('transactions.grid.confirm.deleteSelected.reject'),
      accept: () => {
        this.txService.deleteMany(ids).subscribe({
          next: () => {
            this.cancelAllSelection();
            this.txService.loadAll().subscribe();
            this.messageService.add({ severity: 'success', summary: this.transloco.translate('transactions.grid.toast.deletedSelected') });
          },
          error: () => this.messageService.add({ severity: 'error', summary: this.transloco.translate('common.error'), detail: this.transloco.translate('transactions.grid.toast.deleteError') }),
        });
      },
    });
  }

  toggleFav(tx: Transaction) {
    this.txService.update(tx.id, { favourite: !tx.favourite }).subscribe({
      next: () => this.txService.loadAll().subscribe(),
    });
  }

  applyTags(tx: Transaction) {
    this.txService.applyTags(tx.id).subscribe({
      next: () => this.txService.loadAll().subscribe(),
      error: () => this.messageService.add({ severity: 'error', summary: this.transloco.translate('transactions.grid.toast.applyError') }),
    });
  }

  unassignRecurrent(tx: Transaction, link: RecurrentLink) {
    this.recurrentsService.unassignTransaction(link.recurrentId, tx.id).subscribe({
      next: () => {
        this.txService.loadAll().subscribe();
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('transactions.grid.toast.linkRemoved') });
      },
    });
  }
}
