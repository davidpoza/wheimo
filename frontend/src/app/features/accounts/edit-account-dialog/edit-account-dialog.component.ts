import { Component, inject, input, output, effect, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TabsModule } from 'primeng/tabs';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { AccountsService } from '../accounts.service';
import { AccountExceptionsService } from '../account-exceptions.service';
import { Account, MovementType } from '@core/models/account.model';
import { AccountException } from '@core/models/account-exception.model';

const BANK_OPTION_VALUES: { key: string; value: string }[] = [
  { key: 'nordigen', value: 'nordigen' },
  { key: 'openbank', value: 'openbank' },
  { key: 'openbankPrepaid', value: 'openbank-prepaid' },
  { key: 'manual', value: 'manual' },
];

const MOVEMENT_TYPE_VALUES: { key: string; value: MovementType }[] = [
  { key: 'both', value: 'BOTH' },
  { key: 'income', value: 'INCOME' },
  { key: 'expense', value: 'EXPENSE' },
];

function validRegex(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  try {
    new RegExp(control.value);
    return null;
  } catch {
    return { invalidRegex: true };
  }
}

@Component({
  selector: 'app-edit-account-dialog',
  standalone: true,
  imports: [
    NgTemplateOutlet,
    ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule, SelectModule, CheckboxModule,
    TabsModule, TableModule, ConfirmDialogModule, TranslocoModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './edit-account-dialog.component.html',
})
export class EditAccountDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountsService = inject(AccountsService);
  private readonly exceptionsService = inject(AccountExceptionsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  visible = input<boolean>(false);
  account = input<Account | null>(null);
  visibleChange = output<boolean>();
  saved = output<void>();

  get bankOptions() {
    return BANK_OPTION_VALUES.map((o) => ({
      label: this.transloco.translate('accounts.edit.bank.' + o.key),
      value: o.value,
    }));
  }

  get movementTypeOptions() {
    return MOVEMENT_TYPE_VALUES.map((o) => ({
      label: this.transloco.translate('accounts.edit.movementType.' + o.key),
      value: o.value,
    }));
  }

  exceptions = signal<AccountException[]>([]);
  showExceptionForm = signal(false);
  editingExceptionId = signal<number | null>(null);

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

  exceptionForm = this.fb.group({
    regex: ['', [Validators.required, validRegex]],
    description: [''],
  });

  constructor() {
    effect(() => {
      const acc = this.account();
      if (acc) {
        const mt = acc.movementType ?? 'BOTH';
        this.form.patchValue({
          name: acc.name,
          description: acc.description,
          number: acc.number,
          bankId: acc.bankId,
          saving: acc.saving,
          keepBalance: acc.keepBalance ?? true,
          movementType: mt,
        });
        this.loadExceptions();
      } else {
        this.form.reset({ bankId: 'manual', saving: false, keepBalance: true, movementType: 'BOTH' });
        this.exceptions.set([]);
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

  // --- Exceptions ---

  private loadExceptions() {
    const acc = this.account();
    if (!acc) return;
    this.exceptionsService.list(acc.id).subscribe((list) => this.exceptions.set(list));
  }

  newException() {
    this.editingExceptionId.set(null);
    this.exceptionForm.reset({ regex: '', description: '' });
    this.showExceptionForm.set(true);
  }

  editException(exception: AccountException) {
    this.editingExceptionId.set(exception.id);
    this.exceptionForm.reset({ regex: exception.regex, description: exception.description ?? '' });
    this.showExceptionForm.set(true);
  }

  saveException() {
    if (this.exceptionForm.invalid) return;
    const acc = this.account();
    if (!acc) return;
    const v = this.exceptionForm.getRawValue();
    const payload = { regex: v.regex!, description: v.description || null };
    const editingId = this.editingExceptionId();

    const obs = editingId
      ? this.exceptionsService.update(acc.id, editingId, payload)
      : this.exceptionsService.create(acc.id, payload);

    obs.subscribe({
      next: () => {
        this.showExceptionForm.set(false);
        this.loadExceptions();
      },
      error: (err) => console.error('[EditAccount] save exception failed:', err),
    });
  }

  deleteException(exception: AccountException) {
    const acc = this.account();
    if (!acc) return;
    this.confirmationService.confirm({
      message: this.transloco.translate('accounts.edit.confirm.message'),
      header: this.transloco.translate('accounts.edit.confirm.header'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.exceptionsService.delete(acc.id, exception.id).subscribe(() => this.loadExceptions());
      },
    });
  }
}
