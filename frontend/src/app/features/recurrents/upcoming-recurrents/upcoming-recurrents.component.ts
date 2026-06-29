import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent } from '../../../core/models/recurrent.model';

@Component({
  selector: 'app-upcoming-recurrents',
  standalone: true,
  imports: [CurrencyPipe, TableModule, TagModule, TranslocoModule],
  templateUrl: './upcoming-recurrents.component.html',
  styleUrl: './upcoming-recurrents.component.scss',
})
export class UpcomingRecurrentsComponent implements OnInit {
  private readonly recurrentsService = inject(RecurrentsService);
  private readonly transloco = inject(TranslocoService);

  upcoming = signal<Recurrent[]>([]);

  ngOnInit() {
    this.recurrentsService.getUpcoming().subscribe((list) => this.upcoming.set(list));
  }

  periodicityLabel(r: Recurrent): string {
    if (r.periodicityType === 'ANNUAL') {
      return r.periodicityMonth
        ? this.transloco.translate('recurrents.upcoming.periodicity.annualWithMonth', {
            month: this.transloco.translate('recurrents.list.months.' + r.periodicityMonth),
          })
        : this.transloco.translate('recurrents.upcoming.periodicity.annual');
    }
    if (r.periodicityType === 'MONTHLY') {
      return r.periodicityDay
        ? this.transloco.translate('recurrents.upcoming.periodicity.monthly', { day: r.periodicityDay })
        : this.transloco.translate('recurrents.list.periodicityType.monthly');
    }
    return r.periodicity
      ? this.transloco.translate('recurrents.upcoming.periodicity.days', { days: r.periodicity })
      : '—';
  }

  periodicitySeverity(r: Recurrent): 'warn' | 'info' | 'success' {
    if (r.periodicityType === 'ANNUAL') return 'warn';
    if (r.periodicityType === 'MONTHLY') return 'success';
    return 'info';
  }
}
