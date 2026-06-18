import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { AccountsService } from '../accounts.service';
import { Account } from '../../../core/models/account.model';

const BANK_OPTIONS = [
  { label: 'Nordigen (Open Banking)', value: 'nordigen' },
  { label: 'Openbank', value: 'openbank' },
  { label: 'Openbank Prepaid', value: 'openbank-prepaid' },
  { label: 'Manual', value: 'manual' },
];

@Component({
  selector: 'app-edit-account-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule, CheckboxModule],
  templateUrl: './edit-account-dialog.component.html',
})
export class EditAccountDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsService);

  visible = input<boolean>(false);
  account = input<Account | null>(null);
  visibleChange = output<boolean>();
  saved = output<void>();

  bankOptions = BANK_OPTIONS;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number: [''],
    bankId: ['manual'],
    accessId: [''],
    accessPassword: [''],
    saving: [false],
  });

  constructor() {
    effect(() => {
      const acc = this.account();
      if (acc) {
        this.form.patchValue({
          name: acc.name,
          description: acc.description,
          number: acc.number,
          bankId: acc.bankId,
          saving: acc.saving,
        });
      } else {
        this.form.reset({ bankId: 'manual', saving: false });
      }
    });
  }

  get bankId() {
    return this.form.get('bankId')?.value;
  }

  get isEdit() {
    return this.account() !== null;
  }

  save() {
    if (this.form.invalid) return;
    const data = this.form.value;
    const obs = this.isEdit
      ? this.accountsService.update(this.account()!.id, data as Partial<Account>)
      : this.accountsService.create(data as Partial<Account>);

    obs.subscribe({ next: () => this.saved.emit() });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
