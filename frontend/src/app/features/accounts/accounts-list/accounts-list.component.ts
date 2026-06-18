import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountsService } from '../accounts.service';
import { Account } from '../../../core/models/account.model';
import { EditAccountDialogComponent } from '../edit-account-dialog/edit-account-dialog.component';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, CardModule, TagModule, ToastModule, EditAccountDialogComponent],
  providers: [MessageService],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit {
  private readonly accountsService = inject(AccountsService);
  private readonly messageService = inject(MessageService);

  accounts = this.accountsService.accounts;
  dialogVisible = signal(false);
  editingAccount = signal<Account | null>(null);

  ngOnInit() {
    this.accountsService.loadAll().subscribe();
  }

  openCreate() {
    this.editingAccount.set(null);
    this.dialogVisible.set(true);
  }

  openEdit(account: Account) {
    this.editingAccount.set(account);
    this.dialogVisible.set(true);
  }

  resync(account: Account) {
    this.accountsService.resync(account.id).subscribe({
      next: () => this.messageService.add({ severity: 'info', summary: 'Sync started', detail: account.name }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sync failed' }),
    });
  }

  delete(account: Account) {
    this.accountsService.delete(account.id).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Deleted', detail: account.name }),
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' }),
    });
  }

  onDialogSave() {
    this.dialogVisible.set(false);
    this.accountsService.loadAll().subscribe();
  }
}
