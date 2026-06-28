import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccountsService } from '../accounts.service';
import { Account } from '../../../core/models/account.model';
import { EditAccountDialogComponent } from '../edit-account-dialog/edit-account-dialog.component';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CurrencyPipe, ButtonModule, CardModule, TagModule, ToastModule, TooltipModule, ConfirmDialogModule, TranslocoModule, EditAccountDialogComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './accounts-list.component.html',
  styleUrl: './accounts-list.component.scss',
})
export class AccountsListComponent implements OnInit {
  @ViewChild('xlsInput') xlsInput!: ElementRef<HTMLInputElement>;

  private readonly accountsService = inject(AccountsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  accounts = this.accountsService.accounts;
  dialogVisible = signal(false);
  editingAccount = signal<Account | null>(null);
  importingAccountId = signal<number | null>(null);

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
      next: () => this.messageService.add({ severity: 'info', summary: this.transloco.translate('accounts.list.toast.syncStarted'), detail: account.name }),
      error: () => this.messageService.add({ severity: 'error', summary: this.transloco.translate('common.error'), detail: this.transloco.translate('accounts.list.toast.syncFailed') }),
    });
  }

  delete(account: Account) {
    this.confirmationService.confirm({
      message: this.transloco.translate('accounts.list.confirm.message', { name: account.name }),
      header: this.transloco.translate('accounts.list.confirm.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('accounts.list.confirm.accept'),
      rejectLabel: this.transloco.translate('accounts.list.confirm.reject'),
      accept: () => {
        this.accountsService.delete(account.id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: this.transloco.translate('accounts.list.toast.deleted'), detail: account.name }),
          error: () => this.messageService.add({ severity: 'error', summary: this.transloco.translate('common.error'), detail: this.transloco.translate('accounts.list.toast.deleteFailed') }),
        });
      },
    });
  }

  openXlsImport(account: Account) {
    this.importingAccountId.set(account.id);
    this.xlsInput.nativeElement.value = '';
    this.xlsInput.nativeElement.click();
  }

  onXlsFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const accountId = this.importingAccountId();
    if (!file || accountId == null) return;

    this.accountsService.importXls(accountId, file).subscribe({
      next: (result) => {
        this.messageService.add({
          severity: 'success',
          summary: this.transloco.translate('accounts.list.toast.importComplete'),
          detail: this.transloco.translate('accounts.list.toast.importDetail', { imported: result.imported, skipped: result.skipped }),
        });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: this.transloco.translate('accounts.list.toast.importFailed'), detail: this.transloco.translate('accounts.list.toast.importParseError') });
      },
    });
  }

  onDialogSave() {
    this.dialogVisible.set(false);
    this.accountsService.loadAll().subscribe();
  }
}
