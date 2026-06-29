import { Component, inject, OnInit, signal, computed, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChartsService } from '../charts.service';
import { AccountsService } from '@features/accounts/accounts.service';
import { TransactionsService } from '@features/transactions/transactions.service';
import { TagExpensesChartComponent } from '../tag-expenses-chart/tag-expenses-chart.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
import { StatisticsComponent } from '../statistics/statistics.component';

type TimePreset = 'currentMonth' | 'last3Months' | 'last6Months' | 'last12Months' | 'custom';

function resolvePreset(preset: TimePreset): { from: string; to: string } | null {
  const now = new Date();
  const to = now.toISOString();
  switch (preset) {
    case 'currentMonth':
      return { from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(), to };
    case 'last3Months': {
      const d = new Date(now); d.setMonth(d.getMonth() - 3);
      return { from: d.toISOString(), to };
    }
    case 'last6Months': {
      const d = new Date(now); d.setMonth(d.getMonth() - 6);
      return { from: d.toISOString(), to };
    }
    case 'last12Months': {
      const d = new Date(now); d.setMonth(d.getMonth() - 12);
      return { from: d.toISOString(), to };
    }
    case 'custom':
      return null;
  }
}

@Component({
  selector: 'app-balance-evolution',
  standalone: true,
  imports: [FormsModule, ChartModule, SelectModule, ButtonModule, DatePickerModule, TranslocoModule, TagExpensesChartComponent, HeatmapComponent, StatisticsComponent],
  templateUrl: './balance-evolution.component.html',
  styleUrl: './balance-evolution.component.scss',
})
export class BalanceEvolutionComponent implements OnInit {
  private readonly chartsService = inject(ChartsService);
  private readonly accountsService = inject(AccountsService);
  private readonly txService = inject(TransactionsService);
  private readonly transloco = inject(TranslocoService);

  accounts = this.accountsService.accounts;
  selectedAccountId = signal<number | null>(null);
  selectedPreset = signal<TimePreset>('currentMonth');
  customRange = signal<Date[] | null>(null);
  chartData = signal<any>(null);
  chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  };

  from = computed(() => {
    const preset = this.selectedPreset();
    if (preset === 'custom') {
      return this.customRange()?.[0]?.toISOString() ?? '';
    }
    return resolvePreset(preset)!.from;
  });

  to = computed(() => {
    const preset = this.selectedPreset();
    if (preset === 'custom') {
      return this.customRange()?.[1]?.toISOString() ?? '';
    }
    return resolvePreset(preset)!.to;
  });

  get presets() {
    return [
      { value: 'currentMonth', label: this.transloco.translate('charts.timeRange.currentMonth') },
      { value: 'last3Months', label: this.transloco.translate('charts.timeRange.last3Months') },
      { value: 'last6Months', label: this.transloco.translate('charts.timeRange.last6Months') },
      { value: 'last12Months', label: this.transloco.translate('charts.timeRange.last12Months') },
      { value: 'custom', label: this.transloco.translate('charts.timeRange.custom') },
    ];
  }

  constructor() {
    effect(() => {
      this.loadChart();
    });
  }

  ngOnInit() {
    this.accountsService.loadAll().subscribe(() => {
      const first = this.accounts()[0];
      if (first) {
        this.selectedAccountId.set(first.id);
      }
    });
  }

  loadChart() {
    const accountId = this.selectedAccountId();
    const from = this.from();
    const to = this.to();
    if (!accountId || !from || !to) return;

    this.txService.loadAll({ accountId, from, to, limit: 500, offset: 0, sort: 'date,asc' }).subscribe(() => {
      const txs = this.txService.transactions();
      this.chartData.set({
        labels: txs.map((t) => t.date.slice(0, 10)),
        datasets: [{
          label: this.transloco.translate('charts.balance.dataset'),
          data: txs.map((t) => t.balance),
          fill: true,
          tension: 0.3,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.1)',
        }],
      });
    });
  }
}
