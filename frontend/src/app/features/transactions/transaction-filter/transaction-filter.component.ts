import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { DrawerModule } from 'primeng/drawer';
import { TransactionsService } from '../transactions.service';
import { TagsService } from '../../tags/tags.service';
import { AccountsService } from '../../accounts/accounts.service';
import { TransactionFilters } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-filter',
  standalone: true,
  imports: [FormsModule, InputTextModule, SelectModule, DatePickerModule, ButtonModule, MultiSelectModule, DrawerModule],
  templateUrl: './transaction-filter.component.html',
  styleUrl: './transaction-filter.component.scss',
})
export class TransactionFilterComponent {
  private readonly txService = inject(TransactionsService);
  private readonly tagsService = inject(TagsService);
  private readonly accountsService = inject(AccountsService);

  tags = this.tagsService.tags;
  accounts = this.accountsService.accounts;
  drawerVisible = signal(false);

  draft: TransactionFilters = {};

  operationOptions = [
    { label: 'All', value: null },
    { label: 'Expenses', value: 'expense' },
    { label: 'Income', value: 'income' },
  ];

  apply() {
    this.txService.setFilters(this.draft);
    this.txService.loadAll().subscribe();
    this.drawerVisible.set(false);
  }

  reset() {
    this.draft = {};
    this.txService.setFilters({});
    this.txService.loadAll().subscribe();
    this.drawerVisible.set(false);
  }
}
