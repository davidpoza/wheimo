import { Component, inject, input, output, OnInit, signal, computed } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { RecurrentsService } from '../recurrents.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { Recurrent, RecurrentLink } from '../../../core/models/recurrent.model';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-assign-transaction-dialog',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, FormsModule,
    ButtonModule, DialogModule, AutoCompleteModule, DatePickerModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './assign-transaction-dialog.component.html',
})
export class AssignTransactionDialogComponent implements OnInit {
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly txService = inject(TransactionsService);
  private readonly messageService = inject(MessageService);

  recurrent = input.required<Recurrent>();
  close = output<void>();

  visible = signal(true);
  suggestions = signal<Transaction[]>([]);
  selectedTransaction = signal<Transaction | null>(null);
  dateRange = signal<Date[] | null>(null);
  linkedTransactions = signal<RecurrentLink[]>([]);
  assigning = signal(false);

  private readonly searchTerm$ = new Subject<string>();

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

    this.searchTerm$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term) => {
        const range = this.dateRange();
        const filters: Record<string, string> = { limit: '20', offset: '0' };
        if (term) filters['search'] = term;
        if (range?.[0]) filters['from'] = range[0].toISOString();
        if (range?.[1]) filters['to'] = range[1].toISOString();
        return this.txService.search(filters as any);
      }),
    ).subscribe({ next: (page) => this.suggestions.set(page.data) });
  }

  loadLinked() {
    this.recurrentsService.getLinkedTransactions(this.recurrent().id).subscribe({
      next: (links) => this.linkedTransactions.set(links),
    });
  }

  onSearch(event: AutoCompleteCompleteEvent) {
    this.searchTerm$.next(event.query);
  }

  onDateChange() {
    this.searchTerm$.next('');
  }

  transactionLabel(tx: Transaction): string {
    const desc = tx.description || tx.emitterName || tx.receiverName || `#${tx.id}`;
    const date = new Date(tx.date).toLocaleDateString('es-ES');
    return `${date} — ${desc} (${tx.amount} ${tx.currency})`;
  }

  assign() {
    const tx = this.selectedTransaction();
    if (!tx) return;
    this.assigning.set(true);
    this.recurrentsService.assignTransaction(this.recurrent().id, tx.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Transacción asignada' });
        this.selectedTransaction.set(null);
        this.loadLinked();
        this.recurrentsService.loadAll().subscribe();
        this.assigning.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error al asignar' });
        this.assigning.set(false);
      },
    });
  }

  unassign(link: RecurrentLink) {
    this.recurrentsService.unassignTransaction(this.recurrent().id, link.transactionId).subscribe({
      next: () => {
        this.loadLinked();
        this.recurrentsService.loadAll().subscribe();
        this.messageService.add({ severity: 'success', summary: 'Vínculo eliminado' });
      },
    });
  }

  onHide() {
    this.close.emit();
  }
}
