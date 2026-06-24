import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent, RecurrentPriceEntry } from '../../../core/models/recurrent.model';

@Component({
  selector: 'app-price-history-dialog',
  standalone: true,
  imports: [
    CurrencyPipe, DatePipe,
    ReactiveFormsModule,
    ButtonModule, DialogModule, InputNumberModule, DatePickerModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './price-history-dialog.component.html',
})
export class PriceHistoryDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly messageService = inject(MessageService);

  recurrent = input.required<Recurrent>();
  close = output<void>();

  visible = signal(true);
  history = signal<RecurrentPriceEntry[]>([]);
  addFormVisible = signal(false);

  form = this.fb.group({
    amount: [null as number | null, Validators.required],
    recordedAt: [null as Date | null],
  });

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.recurrentsService.getPriceHistory(this.recurrent().id).subscribe({
      next: (entries) => this.history.set(entries),
    });
  }

  addEntry() {
    if (this.form.invalid) return;
    const { amount, recordedAt } = this.form.value;
    const recordedAtIso = recordedAt ? (recordedAt as Date).toISOString() : undefined;
    this.recurrentsService.addPriceEntry(this.recurrent().id, amount!, recordedAtIso).subscribe({
      next: () => {
        this.form.reset();
        this.addFormVisible.set(false);
        this.loadHistory();
        this.messageService.add({ severity: 'success', summary: 'Precio registrado' });
      },
    });
  }

  onHide() {
    this.close.emit();
  }
}
