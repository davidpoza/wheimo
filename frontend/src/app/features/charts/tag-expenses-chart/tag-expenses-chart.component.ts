import { Component, inject, input, effect, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartsService } from '../charts.service';

@Component({
  selector: 'app-tag-expenses-chart',
  standalone: true,
  imports: [ChartModule],
  template: `
    <h3>Expenses by Tag</h3>
    @if (chartData()) {
      <p-chart type="pie" [data]="chartData()" [options]="options" />
    } @else {
      <div class="empty">No data</div>
    }
  `,
  styles: [':host ::ng-deep canvas { max-height: 260px; }', '.empty { color: var(--p-text-muted-color); padding: 2rem; text-align: center; }'],
})
export class TagExpensesChartComponent {
  private readonly chartsService = inject(ChartsService);
  accountId = input<number | null>(null);
  chartData = signal<any>(null);
  options = { responsive: true, plugins: { legend: { position: 'bottom' as const } } };

  constructor() {
    effect(() => {
      const id = this.accountId();
      if (!id) return;
      const to = new Date().toISOString();
      const from = new Date(Date.now() - 30 * 86400000).toISOString();
      this.chartsService.getTagExpenses(from, to, id).subscribe((data) => {
        const expenses = data.filter((d) => d.amount < 0);
        this.chartData.set({
          labels: expenses.map((d) => d.tagName || 'Untagged'),
          datasets: [{
            data: expenses.map((d) => Math.abs(d.amount)),
            backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'],
          }],
        });
      });
    });
  }
}
