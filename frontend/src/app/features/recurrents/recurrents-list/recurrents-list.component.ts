import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent } from '../../../core/models/recurrent.model';
import { PriceHistoryDialogComponent } from '../price-history-dialog/price-history-dialog.component';
import { AssignTransactionDialogComponent } from '../assign-transaction-dialog/assign-transaction-dialog.component';

const MONTH_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function requireMonthIfAnnual(group: AbstractControl): ValidationErrors | null {
  const type = group.get('periodicityType')?.value;
  const month = group.get('periodicityMonth')?.value;
  return type === 'ANNUAL' && !month ? { monthRequired: true } : null;
}

@Component({
  selector: 'app-recurrents-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    ButtonModule, DialogModule, InputTextModule, InputNumberModule, DatePickerModule, SelectModule, TableModule,
    ToastModule, TooltipModule, ConfirmDialogModule, TranslocoModule,
    PriceHistoryDialogComponent, AssignTransactionDialogComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './recurrents-list.component.html',
  styleUrl: './recurrents-list.component.scss',
})
export class RecurrentsListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  recurrents = this.recurrentsService.recurrents;
  dialogVisible = signal(false);
  editingRecurrent = signal<Recurrent | null>(null);
  historyRecurrent = signal<Recurrent | null>(null);
  assignRecurrent = signal<Recurrent | null>(null);

  get periodicityTypes() {
    return [
      { label: this.transloco.translate('recurrents.list.periodicityType.days'), value: 'DAYS' },
      { label: this.transloco.translate('recurrents.list.periodicityType.annual'), value: 'ANNUAL' },
    ];
  }

  get months() {
    return MONTH_VALUES.map((v) => ({
      label: this.transloco.translate('recurrents.list.months.' + v),
      value: v,
    }));
  }

  form = this.fb.group({
    name: ['', Validators.required],
    establishment: ['', Validators.required],
    amount: [null as number | null],
    units: [null as number | null],
    periodicityType: ['DAYS' as string],
    periodicity: [null as number | null],
    periodicityMonth: [null as number | null],
    startDate: [null as Date | null],
    link: [null as string | null],
  }, { validators: requireMonthIfAnnual });

  get isEdit() { return this.editingRecurrent() !== null; }
  get isAnnual() { return this.form.get('periodicityType')?.value === 'ANNUAL'; }

  ngOnInit() {
    this.recurrentsService.loadAll().subscribe();
  }

  openCreate() {
    this.editingRecurrent.set(null);
    this.form.reset({ periodicityType: 'DAYS' });
    this.dialogVisible.set(true);
  }

  openEdit(r: Recurrent) {
    this.editingRecurrent.set(r);
    this.form.patchValue({
      name: r.name,
      establishment: r.establishment,
      periodicityType: r.periodicityType ?? 'DAYS',
      periodicity: r.periodicity,
      periodicityMonth: r.periodicityMonth,
      startDate: r.startDate ? new Date(r.startDate + 'T00:00:00') : null,
      link: r.link,
    });
    this.dialogVisible.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const { name, establishment, amount, units, periodicityType, periodicity, periodicityMonth, startDate, link } = this.form.value;
    const editing = this.editingRecurrent();
    const startDateValue = periodicityType === 'DAYS' ? this.formatDate(startDate ?? null) : null;

    if (editing) {
      this.recurrentsService.update(editing.id, {
        name: name!,
        establishment: establishment!,
        periodicityType: periodicityType ?? 'DAYS',
        periodicity: periodicityType === 'DAYS' ? (periodicity ?? undefined) : undefined,
        periodicityMonth: periodicityType === 'ANNUAL' ? (periodicityMonth ?? undefined) : undefined,
        startDate: startDateValue,
        link: link ?? undefined,
      }).subscribe({
        next: () => {
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: this.transloco.translate('recurrents.list.toast.updated') });
        },
      });
    } else {
      this.recurrentsService.create({
        name: name!,
        establishment: establishment!,
        amount: amount ?? 0,
        units: units ?? undefined,
        periodicityType: periodicityType ?? 'DAYS',
        periodicity: periodicityType === 'DAYS' ? (periodicity ?? undefined) : undefined,
        periodicityMonth: periodicityType === 'ANNUAL' ? (periodicityMonth ?? undefined) : undefined,
        startDate: startDateValue,
        link: link ?? undefined,
      }).subscribe({
        next: () => {
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: this.transloco.translate('recurrents.list.toast.created') });
        },
      });
    }
  }

  private formatDate(d: Date | null): string | null {
    if (!d) return null;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  delete(r: Recurrent) {
    this.confirmationService.confirm({
      message: this.transloco.translate('recurrents.list.confirm.message', { name: r.name }),
      header: this.transloco.translate('recurrents.list.confirm.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('recurrents.list.confirm.accept'),
      rejectLabel: this.transloco.translate('recurrents.list.confirm.reject'),
      accept: () => {
        this.recurrentsService.delete(r.id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: this.transloco.translate('recurrents.list.toast.deleted') }),
        });
      },
    });
  }

  openHistory(r: Recurrent) {
    this.historyRecurrent.set(r);
  }

  onHistoryClose() {
    this.historyRecurrent.set(null);
    this.recurrentsService.loadAll().subscribe();
  }

  openAssign(r: Recurrent) {
    this.assignRecurrent.set(r);
  }

  onAssignClose() {
    this.assignRecurrent.set(null);
  }

  periodicityLabel(r: Recurrent): string {
    if (r.periodicityType === 'ANNUAL') {
      return r.periodicityMonth
        ? this.transloco.translate('recurrents.list.periodicity.annualWithMonth', {
            month: this.transloco.translate('recurrents.list.months.' + r.periodicityMonth),
          })
        : this.transloco.translate('recurrents.list.periodicity.annual');
    }
    return r.periodicity
      ? this.transloco.translate('recurrents.list.periodicity.days', { days: r.periodicity })
      : '—';
  }
}
