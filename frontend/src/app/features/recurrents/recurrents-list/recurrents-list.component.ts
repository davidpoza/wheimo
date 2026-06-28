import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent } from '../../../core/models/recurrent.model';
import { PriceHistoryDialogComponent } from '../price-history-dialog/price-history-dialog.component';
import { AssignTransactionDialogComponent } from '../assign-transaction-dialog/assign-transaction-dialog.component';

const PERIODICITY_TYPES = [
  { label: 'Por días', value: 'DAYS' },
  { label: 'Anual', value: 'ANNUAL' },
];

const MONTHS = [
  { label: 'Enero', value: 1 },
  { label: 'Febrero', value: 2 },
  { label: 'Marzo', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Mayo', value: 5 },
  { label: 'Junio', value: 6 },
  { label: 'Julio', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Septiembre', value: 9 },
  { label: 'Octubre', value: 10 },
  { label: 'Noviembre', value: 11 },
  { label: 'Diciembre', value: 12 },
];

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
    ButtonModule, DialogModule, InputTextModule, InputNumberModule, SelectModule, TableModule,
    ToastModule, TooltipModule, ConfirmDialogModule,
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

  recurrents = this.recurrentsService.recurrents;
  dialogVisible = signal(false);
  editingRecurrent = signal<Recurrent | null>(null);
  historyRecurrent = signal<Recurrent | null>(null);
  assignRecurrent = signal<Recurrent | null>(null);

  periodicityTypes = PERIODICITY_TYPES;
  months = MONTHS;

  form = this.fb.group({
    name: ['', Validators.required],
    establishment: ['', Validators.required],
    amount: [null as number | null],
    units: [null as number | null],
    periodicityType: ['DAYS' as string],
    periodicity: [null as number | null],
    periodicityMonth: [null as number | null],
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
      link: r.link,
    });
    this.dialogVisible.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const { name, establishment, amount, units, periodicityType, periodicity, periodicityMonth, link } = this.form.value;
    const editing = this.editingRecurrent();

    if (editing) {
      this.recurrentsService.update(editing.id, {
        name: name!,
        establishment: establishment!,
        periodicityType: periodicityType ?? 'DAYS',
        periodicity: periodicityType === 'DAYS' ? (periodicity ?? undefined) : undefined,
        periodicityMonth: periodicityType === 'ANNUAL' ? (periodicityMonth ?? undefined) : undefined,
        link: link ?? undefined,
      }).subscribe({
        next: () => {
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Artículo actualizado' });
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
        link: link ?? undefined,
      }).subscribe({
        next: () => {
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Artículo creado' });
        },
      });
    }
  }

  delete(r: Recurrent) {
    this.confirmationService.confirm({
      message: `¿Eliminar "${r.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.recurrentsService.delete(r.id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: 'Artículo eliminado' }),
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
      const m = MONTHS.find(x => x.value === r.periodicityMonth);
      return m ? `Anual (${m.label})` : 'Anual';
    }
    return r.periodicity ? `${r.periodicity} días` : '—';
  }
}
