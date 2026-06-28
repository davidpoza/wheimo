import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChartsService } from '../charts.service';
import { AccountsService } from '../../accounts/accounts.service';
import { TransactionsService } from '../../transactions/transactions.service';
import { TagExpensesChartComponent } from '../tag-expenses-chart/tag-expenses-chart.component';
import { HeatmapComponent } from '../heatmap/heatmap.component';
import { StatisticsComponent } from '../statistics/statistics.component';

@Component({
  selector: 'app-balance-evolution',
  standalone: true,
  imports: [FormsModule, ChartModule, SelectModule, ButtonModule, TranslocoModule, TagExpensesChartComponent, HeatmapComponent, StatisticsComponent],
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
  chartData = signal<any>(null);
  chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  };

  ngOnInit() {
    this.accountsService.loadAll().subscribe(() => {
      const first = this.accounts()[0];
      if (first) {
        this.selectedAccountId.set(first.id);
        this.loadChart();
      }
    });
  }

  loadChart() {
    const accountId = this.selectedAccountId();
    if (!accountId) return;

    const to = new Date().toISOString();
    const from = new Date(Date.now() - 90 * 86400000).toISOString();

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
