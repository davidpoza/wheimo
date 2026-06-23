import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent } from '../../../core/models/recurrent.model';
import { PriceHistoryDialogComponent } from '../price-history-dialog/price-history-dialog.component';
import { AssignTransactionDialogComponent } from '../assign-transaction-dialog/assign-transaction-dialog.component';

@Component({
  selector: 'app-recurrents-list',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    ButtonModule, DialogModule, InputTextModule, InputNumberModule,
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

  form = this.fb.group({
    name: ['', Validators.required],
    establishment: ['', Validators.required],
    amount: [null as number | null],
    periodicity: [null as number | null],
    link: [null as string | null],
  });

  get isEdit() { return this.editingRecurrent() !== null; }

  ngOnInit() {
    this.recurrentsService.loadAll().subscribe();
  }

  openCreate() {
    this.editingRecurrent.set(null);
    this.form.reset();
    this.dialogVisible.set(true);
  }

  openEdit(r: Recurrent) {
    this.editingRecurrent.set(r);
    this.form.patchValue({
      name: r.name,
      establishment: r.establishment,
      periodicity: r.periodicity,
      link: r.link,
    });
    this.dialogVisible.set(true);
  }

  save() {
    if (this.form.invalid) return;
    const { name, establishment, amount, periodicity, link } = this.form.value;
    const editing = this.editingRecurrent();

    if (editing) {
      this.recurrentsService.update(editing.id, { name: name!, establishment: establishment!, periodicity: periodicity ?? undefined, link: link ?? undefined }).subscribe({
        next: () => {
          this.dialogVisible.set(false);
          this.messageService.add({ severity: 'success', summary: 'Artículo actualizado' });
        },
      });
    } else {
      this.recurrentsService.create({ name: name!, establishment: establishment!, amount: amount ?? 0, periodicity: periodicity ?? undefined, link: link ?? undefined }).subscribe({
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
}
