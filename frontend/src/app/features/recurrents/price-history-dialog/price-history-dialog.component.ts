import { Component, inject, input, output, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
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
    ButtonModule, DialogModule, InputNumberModule, DatePickerModule, TableModule, ChartModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './price-history-dialog.component.html',
  styles: [`
    .history-container { display: flex; flex-direction: column; gap: 1.25rem; }
    .history-actions { display: flex; justify-content: flex-end; }
    .add-form { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; border: 1px solid var(--surface-border); border-radius: 8px; }
    .add-form .form-row { display: flex; gap: 1rem; flex-wrap: wrap; }
    .add-form .form-row .field { flex: 1 1 180px; margin: 0; }
    .history-chart { height: 240px; }
    .amount { text-align: right; }
    .empty { text-align: center; color: var(--text-color-secondary); padding: 1rem; }
  `],
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

  chartData = signal<any>(null);
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: true, position: 'top' } },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Precio (€)' },
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Unidades' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  form = this.fb.group({
    amount: [null as number | null, Validators.required],
    units: [null as number | null],
    recordedAt: [null as Date | null],
  });

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    this.recurrentsService.getPriceHistory(this.recurrent().id).subscribe({
      next: (entries) => {
        this.history.set(entries);
        this.buildChart(entries);
      },
    });
  }

  private buildChart(entries: RecurrentPriceEntry[]) {
    if (!entries.length) {
      this.chartData.set(null);
      return;
    }
    // History arrives sorted desc; chart wants oldest -> newest.
    const ordered = [...entries].reverse();
    const labels = ordered.map((e) => new Date(e.recordedAt).toLocaleDateString('es-ES'));

    const datasets: any[] = [
      {
        label: 'Precio',
        data: ordered.map((e) => e.amount),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.3,
        yAxisID: 'y',
      },
    ];

    const hasUnits = ordered.some((e) => e.units != null);
    if (hasUnits) {
      datasets.push({
        label: 'Unidades',
        data: ordered.map((e) => e.units),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.1)',
        tension: 0.3,
        spanGaps: true,
        yAxisID: 'y1',
      });
    }

    this.chartData.set({ labels, datasets });
  }

  addEntry() {
    if (this.form.invalid) return;
    const { amount, units, recordedAt } = this.form.value;
    const recordedAtIso = recordedAt ? (recordedAt as Date).toISOString() : undefined;
    this.recurrentsService.addPriceEntry(this.recurrent().id, amount!, units, recordedAtIso).subscribe({
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
