import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DrawerModule } from 'primeng/drawer';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TransactionsService } from '../transactions.service';
import { TagsService } from '@features/tags/tags.service';
import { AccountsService } from '@features/accounts/accounts.service';
import { TransactionFilters } from '@core/models/transaction.model';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [FormsModule, InputTextModule, SelectModule, DatePickerModule, ButtonModule, MultiSelectModule, DrawerModule, TranslocoModule],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.scss',
})
export class TransactionFilterComponent implements OnInit {
  private readonly txService = inject(TransactionsService);
  private readonly tagsService = inject(TagsService);
  private readonly accountsService = inject(AccountsService);
  private readonly transloco = inject(TranslocoService);

  tags = this.tagsService.tags;
  accounts = this.accountsService.accounts;
  drawerVisible = signal(false);

  draft: TransactionFilters = {};

  ngOnInit() {
    this.tagsService.loadTags().subscribe();
    this.accountsService.loadAll().subscribe();
  }

  get operationOptions() {
    return [
      { label: this.transloco.translate('transactions.filter.operation.all'), value: null },
      { label: this.transloco.translate('transactions.filter.operation.expenses'), value: 'expense' },
      { label: this.transloco.translate('transactions.filter.operation.income'), value: 'income' },
    ];
  }

  apply() {
    this.txService.setFilters(this.draft);
    this.txService.loadAll().subscribe();
    this.drawerVisible.set(false);
  }

  reset() {
    this.draft = {};
    this.txService.resetFilters();
    this.txService.loadAll().subscribe();
    this.drawerVisible.set(false);
  }
}
