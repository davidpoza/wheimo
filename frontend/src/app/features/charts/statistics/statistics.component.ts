import { Component, inject, input, effect, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChartsService, Statistics } from '../charts.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <h3>Statistics</h3>
    @if (stats(); as s) {
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Total Income</span>
          <span class="stat-value income">{{ s.totalIncome | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Total Expenses</span>
          <span class="stat-value expense">{{ s.totalExpenses | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Avg Daily Expense</span>
          <span class="stat-value">{{ s.avgDailyExpense | currency: 'EUR' }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Current Streak (no expense)</span>
          <span class="stat-value">{{ s.currentStreak }} days</span>
        </div>
        <div class="stat">
          <span class="stat-label">Longest Streak</span>
          <span class="stat-value">{{ s.longestStreak }} days</span>
        </div>
        @if (s.mostExpensiveDay) {
          <div class="stat">
            <span class="stat-label">Most Expensive Day</span>
            <span class="stat-value expense">{{ s.mostExpensiveDay.date | date: 'dd/MM/yyyy' }} ({{ s.mostExpensiveDay.amount | currency: 'EUR' }})</span>
          </div>
        }
      </div>
    } @else {
      <div class="empty">Select an account</div>
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
  stats = signal<Statistics | null>(null);

  constructor() {
    effect(() => {
      const id = this.accountId();
      if (!id) return;
      const to = new Date().toISOString();
      const from = new Date(Date.now() - 30 * 86400000).toISOString();
      this.chartsService.getStatistics(id, from, to).subscribe((s) => this.stats.set(s));
    });
  }
}
