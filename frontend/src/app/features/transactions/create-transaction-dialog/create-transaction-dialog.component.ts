import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TranslocoModule } from '@jsverse/transloco';
import { TransactionsService } from '../transactions.service';
import { AccountsService } from '@features/accounts/accounts.service';

@Component({
  selector: 'app-create-transaction-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, DatePickerModule, SelectModule, TranslocoModule],
  templateUrl: './create-transaction-dialog.component.html',
})
export class CreateTransactionDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly txService = inject(TransactionsService);
  readonly accountsService = inject(AccountsService);

  visible = input<boolean>(false);
  visibleChange = output<boolean>();
  created = output<void>();

  form = this.fb.group({
    accountId: [null, Validators.required],
    amount: [null, Validators.required],
    currency: ['EUR', Validators.required],
    date: [new Date(), Validators.required],
    valueDate: [new Date(), Validators.required],
    description: [''],
    emitterName: [''],
    receiverName: [''],
  });

  save() {
    if (this.form.invalid) return;
    const data = { ...this.form.value };
    this.txService.create(data as any).subscribe({ next: () => this.created.emit() });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
