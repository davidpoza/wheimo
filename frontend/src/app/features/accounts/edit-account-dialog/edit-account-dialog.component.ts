import { Component, inject, input, output, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { AccountsService } from '../accounts.service';
import { Account, MovementType } from '../../../core/models/account.model';

const BANK_OPTIONS = [
  { label: 'Nordigen (Open Banking)', value: 'nordigen' },
  { label: 'Openbank', value: 'openbank' },
  { label: 'Openbank Prepaid', value: 'openbank-prepaid' },
  { label: 'Manual', value: 'manual' },
];

const MOVEMENT_TYPE_OPTIONS: { label: string; value: MovementType }[] = [
  { label: 'Ambos', value: 'BOTH' },
  { label: 'Entrada', value: 'INCOME' },
  { label: 'Salida', value: 'EXPENSE' },
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
  movementTypeOptions = MOVEMENT_TYPE_OPTIONS;

  form = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    number: [''],
    bankId: ['manual'],
    accessId: [''],
    accessPassword: [''],
    saving: [false],
    keepBalance: [true],
    movementType: ['BOTH' as MovementType],
  });

  constructor() {
    effect(() => {
      const acc = this.account();
      if (acc) {
        const mt = acc.movementType ?? 'BOTH';
        console.log('[EditAccount] effect patch — account.movementType:', acc.movementType, '→ patching with:', mt);
        this.form.patchValue({
          name: acc.name,
          description: acc.description,
          number: acc.number,
          bankId: acc.bankId,
          saving: acc.saving,
          keepBalance: acc.keepBalance ?? true,
          movementType: mt,
        });
        console.log('[EditAccount] form.value after patch:', this.form.getRawValue());
      } else {
        this.form.reset({ bankId: 'manual', saving: false, keepBalance: true, movementType: 'BOTH' });
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
    const v = this.form.getRawValue();
    console.log('[EditAccount] save() — getRawValue():', v);
    const payload: Record<string, unknown> = {
      name: v.name,
      description: v.description,
      number: v.number,
      bankId: v.bankId,
      saving: v.saving,
      keepBalance: v.keepBalance ?? true,
      movementType: v.movementType ?? 'BOTH',
    };
    if (v.accessId) payload['accessId'] = v.accessId;
    if (v.accessPassword) payload['accessPassword'] = v.accessPassword;
    console.log('[EditAccount] payload being sent:', payload);

    const obs = this.isEdit
      ? this.accountsService.update(this.account()!.id, payload as Partial<Account>)
      : this.accountsService.create(payload as Partial<Account>);

    obs.subscribe({
      next: () => this.saved.emit(),
      error: (err) => console.error('[EditAccount] save failed:', err),
    });
  }

  close() {
    this.visibleChange.emit(false);
  }
}
