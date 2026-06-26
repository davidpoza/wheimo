import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RecurrentsService } from '../recurrents.service';
import { Recurrent } from '../../../core/models/recurrent.model';

const MONTHS: Record<number, string> = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre',
};

@Component({
  selector: 'app-upcoming-recurrents',
  standalone: true,
  imports: [CurrencyPipe, TableModule, TagModule],
  templateUrl: './upcoming-recurrents.component.html',
  styleUrl: './upcoming-recurrents.component.scss',
})
export class UpcomingRecurrentsComponent implements OnInit {
  private readonly recurrentsService = inject(RecurrentsService);

  upcoming = signal<Recurrent[]>([]);

  ngOnInit() {
    this.recurrentsService.getUpcoming().subscribe((list) => this.upcoming.set(list));
  }

  periodicityLabel(r: Recurrent): string {
    if (r.periodicityType === 'ANNUAL') {
      return r.periodicityMonth ? `Anual (${MONTHS[r.periodicityMonth]})` : 'Anual';
    }
    return r.periodicity ? `Cada ${r.periodicity} días` : '—';
  }
}
