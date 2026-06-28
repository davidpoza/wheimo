import { Component, inject, input, effect, signal, computed } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';
import { ChartsService } from '../charts.service';

interface DayCell {
  date: string;
  amount: number;
  label: string;
}

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [TooltipModule],
  templateUrl: './heatmap.component.html',
  styleUrl: './heatmap.component.scss',
})
export class HeatmapComponent {
  private readonly chartsService = inject(ChartsService);
  accountId = input<number | null>(null);
  year = new Date().getFullYear();
  calendarData = signal<Record<string, number>>({});

  weeks = computed(() => this.buildWeeks(this.calendarData()));

  // Column template shared by the month-label row and the heatmap grid so they align.
  gridCols = computed(() => `repeat(${this.weeks().length}, 1fr)`);

  // Each month label spans the week columns that belong to it, positioned via grid-column.
  monthSpans = computed(() => {
    const spans: { name: string; start: number; span: number }[] = [];
    let prevMonth = -1;
    this.weeks().forEach((week, i) => {
      const firstDay = week.find((d) => d);
      const month = firstDay ? Number(firstDay.date.slice(5, 7)) - 1 : prevMonth;
      if (month !== prevMonth) {
        spans.push({ name: this.months[month], start: i + 1, span: 1 });
        prevMonth = month;
      } else if (spans.length) {
        spans[spans.length - 1].span++;
      }
    });
    return spans;
  });

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor() {
    effect(() => {
      const id = this.accountId();
      if (!id) return;
      this.chartsService.getCalendar(id, this.year).subscribe((data) => this.calendarData.set(data));
    });
  }

  private buildWeeks(data: Record<string, number>): DayCell[][] {
    const weeks: DayCell[][] = [];
    const start = new Date(`${this.year}-01-01`);
    const end = new Date(`${this.year}-12-31`);
    const startDay = start.getDay();

    let week: DayCell[] = Array(startDay).fill(null);
    const cur = new Date(start);

    while (cur <= end) {
      const key = cur.toISOString().slice(0, 10);
      week.push({ date: key, amount: data[key] ?? 0, label: `${key}: ${data[key] ?? 0}€` });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      cur.setDate(cur.getDate() + 1);
    }

    if (week.length) {
      while (week.length < 7) week.push(null as any);
      weeks.push(week);
    }

    return weeks;
  }

  intensity(amount: number): string {
    if (!amount) return 'level-0';
    const abs = Math.abs(amount);
    if (abs < 20) return 'level-1';
    if (abs < 50) return 'level-2';
    if (abs < 100) return 'level-3';
    return 'level-4';
  }
}
