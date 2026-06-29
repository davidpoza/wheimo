import { Component, inject, input, effect, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ChartsService, Statistics } from '../charts.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, TranslocoModule],
  template: `
    <h3>{{ 'charts.statistics.title' | transloco }}</h3>
    @if (stats(); as s) {
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">{{ 'charts.statistics.totalIncome' | transloco }}</span>
          <span class="stat-value income">{{ s.totalIncome | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ 'charts.statistics.totalExpenses' | transloco }}</span>
          <span class="stat-value expense">{{ s.totalExpenses | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ 'charts.statistics.avgDailyExpense' | transloco }}</span>
          <span class="stat-value">{{ s.avgDailyExpense | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ 'charts.statistics.currentStreak' | transloco }}</span>
          <span class="stat-value">{{ 'charts.statistics.days' | transloco: { count: s.currentStreak } }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">{{ 'charts.statistics.longestStreak' | transloco }}</span>
          <span class="stat-value">{{ 'charts.statistics.days' | transloco: { count: s.longestStreak } }}</span>
        </div>
        @if (s.mostExpensiveDay) {
          <div class="stat">
            <span class="stat-label">{{ 'charts.statistics.mostExpensiveDay' | transloco }}</span>
            <span class="stat-value expense">{{ s.mostExpensiveDay.date | date: 'dd/MM/yyyy' }} ({{ s.mostExpensiveDay.amount | currency: 'EUR' }})</span>
          </div>
        }
      </div>
    } @else {
      <div class="empty">{{ 'charts.statistics.empty' | transloco }}</div>
    }
  `,
  styles: [`
    .stats-grid { display: flex; flex-direction: column; gap: 0.75rem; }
    .stat { display: flex; justify-content: space-between; align-items: center; }
    .stat-label { font-size: 0.875rem; color: var(--p-text-muted-color); }
    .stat-value { font-weight: 600; }
    .income { color: var(--p-green-500); }
    .expense { color: var(--p-red-500); }
    .empty { color: var(--p-text-muted-color); padding: 2rem; text-align: center; }
  `],
})
export class StatisticsComponent {
  private readonly chartsService = inject(ChartsService);
  accountId = input<number | null>(null);
  from = input.required<string>();
  to = input.required<string>();
  stats = signal<Statistics | null>(null);

  constructor() {
    effect(() => {
      const id = this.accountId();
      const from = this.from();
      const to = this.to();
      if (!id || !from || !to) return;
      this.chartsService.getStatistics(id, from, to).subscribe((s) => this.stats.set(s));
    });
  }
}
