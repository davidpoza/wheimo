import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BudgetsService } from '../budgets.service';
import { TagsService } from '../../tags/tags.service';
import { BudgetStatus } from '../../../core/models/budget.model';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe, PercentPipe,
    ReactiveFormsModule,
    ButtonModule, DialogModule, InputNumberModule, DatePickerModule, SelectModule,
    ProgressBarModule, ToastModule, ConfirmDialogModule,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss',
})
export class BudgetsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly budgetsService = inject(BudgetsService);
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  statuses = this.budgetsService.statuses;
  tags = this.tagsService.tags;
  dialogVisible = signal(false);

  form = this.fb.group({
    tagId: [null as number | null, Validators.required],
    value: [null as number | null, Validators.required],
    startDate: [null as Date | null, Validators.required],
    endDate: [null as Date | null, Validators.required],
  });

  ngOnInit() {
    this.tagsService.loadTags().subscribe();
    this.budgetsService.loadAllStatuses().subscribe();
  }

  severity(status: BudgetStatus): 'success' | 'info' | 'warn' | 'danger' {
    const pct = status.percentage;
    if (pct < 60) return 'success';
    if (pct < 85) return 'warn';
    return 'danger';
  }

  createBudget() {
    if (this.form.invalid) return;
    const { tagId, value, startDate, endDate } = this.form.value;
    this.budgetsService.create({ tag: { id: tagId! } as any, value: value!, startDate: startDate!.toISOString(), endDate: endDate!.toISOString() }).subscribe({
      next: () => {
        this.dialogVisible.set(false);
        this.form.reset();
        this.budgetsService.loadAllStatuses().subscribe();
        this.messageService.add({ severity: 'success', summary: 'Budget created' });
      },
    });
  }

  deleteBudget(id: number) {
    this.confirmationService.confirm({
      message: '¿Eliminar este presupuesto?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.budgetsService.delete(id).subscribe({
          next: () => {
            this.budgetsService.loadAllStatuses().subscribe();
            this.messageService.add({ severity: 'success', summary: 'Budget deleted' });
          },
        });
      },
    });
  }
}
