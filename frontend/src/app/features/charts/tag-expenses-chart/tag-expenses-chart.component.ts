import { Component, inject, input, effect, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { ChartsService } from '../charts.service';

@Component({
  selector: 'app-tag-expenses-chart',
  standalone: true,
  imports: [ChartModule, TranslocoModule],
  template: `
    <h3>{{ 'charts.tagExpenses.title' | transloco }}</h3>
    @if (chartData()) {
      <p-chart type="pie" [data]="chartData()" [options]="options" />
    } @else {
      <div class="empty">{{ 'charts.tagExpenses.empty' | transloco }}</div>
    }
  `,
  styles: [':host ::ng-deep canvas { max-height: 260px; }', '.empty { color: var(--p-text-muted-color); padding: 2rem; text-align: center; }'],
})
export class TagExpensesChartComponent {
  private readonly chartsService = inject(ChartsService);
  private readonly transloco = inject(TranslocoService);
  accountId = input<number | null>(null);
  from = input.required<string>();
  to = input.required<string>();
  chartData = signal<any>(null);
  options = { responsive: true, plugins: { legend: { position: 'bottom' as const } } };

  constructor() {
    effect(() => {
      const id = this.accountId();
      const from = this.from();
      const to = this.to();
      if (!id || !from || !to) return;
      this.chartsService.getTagExpenses(from, to, id).subscribe((data) => {
        const expenses = data.filter((d) => d.amount < 0);
        this.chartData.set({
          labels: expenses.map((d) => d.tagName || this.transloco.translate('charts.tagExpenses.untagged')),
          datasets: [{
            data: expenses.map((d) => Math.abs(d.amount)),
            backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'],
          }],
        });
      });
    });
  }
}
