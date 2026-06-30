import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabsModule } from 'primeng/tabs';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { PriceReading, PriceTracker } from '@core/models/price-tracking.model';
import { PriceTrackerFormComponent } from '../price-tracker-form/price-tracker-form.component';
import { PriceTrackerPayload, PriceTrackingService } from '../price-tracking.service';

type PeriodPreset = '1M' | '3M' | '6M' | '1Y' | 'ALL';

export const CHART_COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0891b2',
  '#ca8a04', '#be185d', '#059669', '#7c3aed', '#b45309', '#0e7490',
];

@Component({
  selector: 'app-price-tracking-page',
  standalone: true,
  imports: [
    ButtonModule, ChartModule, ConfirmDialogModule, TabsModule, ToastModule, TooltipModule,
    TranslocoModule,
    PriceTrackerFormComponent,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './price-tracking-page.component.html',
  styleUrl: './price-tracking-page.component.scss',
})
export class PriceTrackingPageComponent implements OnInit {
  private readonly priceTrackingService = inject(PriceTrackingService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  readonly chartColors = CHART_COLORS;

  trackers = this.priceTrackingService.trackers;
  fetcherTypes = this.priceTrackingService.fetcherTypes;
  readings = signal<PriceReading[]>([]);
  activeTrackerId = signal<number | null>(null);
  selectedPeriod = signal<PeriodPreset>('3M');
  formVisible = signal(false);
  editingTracker = signal<PriceTracker | null>(null);
  loadingReadings = signal(false);
  fetching = signal(false);
  hiddenSeries = signal<Set<string>>(new Set());

  activeTrackers = computed(() => this.trackers().filter((tracker) => tracker.active));
  activeTracker = computed(() => this.trackers().find((tracker) => tracker.id === this.activeTrackerId()) ?? null);
  activeTabValue = computed(() => this.activeTrackerId() ?? undefined);

  allStationKeys = computed(() =>
    [...new Set(this.readings().map((r) => r.locationKey))].sort()
  );

  periods = [
    { label: '1M', value: '1M' as PeriodPreset },
    { label: '3M', value: '3M' as PeriodPreset },
    { label: '6M', value: '6M' as PeriodPreset },
    { label: '1A', value: '1Y' as PeriodPreset },
    { label: this.transloco.translate('priceTracking.period.all'), value: 'ALL' as PeriodPreset },
  ];

  chartData = computed(() => {
    const readings = this.readings();
    const hidden = this.hiddenSeries();
    const labels = [...new Set(readings.map((r) => r.readingDate))].sort();
    const byLocation = readings.reduce((acc, r) => {
      if (hidden.has(r.locationKey)) return acc;
      const group = acc.get(r.locationKey) ?? new Map<string, number>();
      group.set(r.readingDate, r.value);
      acc.set(r.locationKey, group);
      return acc;
    }, new Map<string, Map<string, number>>());

    const allKeys = [...new Set(readings.map((r) => r.locationKey))].sort();

    return {
      labels,
      datasets: [...byLocation.entries()].map(([locationKey, values]) => {
        const colorIndex = allKeys.indexOf(locationKey);
        const color = CHART_COLORS[colorIndex % CHART_COLORS.length];
        return {
          label: locationKey,
          data: labels.map((label) => values.get(label) ?? null),
          fill: false,
          tension: 0.25,
          borderColor: color,
          backgroundColor: color,
          pointRadius: 4,
        };
      }),
    };
  });

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: false, title: { display: true, text: 'EUR/l' } },
    },
  };

  constructor() {
    effect(() => {
      const trackers = this.activeTrackers();
      const activeId = this.activeTrackerId();
      if (trackers.length && !trackers.some((tracker) => tracker.id === activeId)) {
        this.activeTrackerId.set(trackers[0].id);
      }
      if (!trackers.length) {
        this.activeTrackerId.set(null);
        this.readings.set([]);
      }
    });

    effect(() => {
      const trackerId = this.activeTrackerId();
      this.selectedPeriod();
      this.hiddenSeries.set(new Set());
      if (trackerId) {
        this.loadReadings(trackerId);
      }
    });
  }

  ngOnInit(): void {
    this.priceTrackingService.loadFetcherTypes().subscribe();
    this.priceTrackingService.loadTrackers().subscribe();
  }

  toggleSeries(key: string): void {
    this.hiddenSeries.update((set) => {
      const next = new Set(set);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  colorForKey(key: string): string {
    const index = this.allStationKeys().indexOf(key);
    return CHART_COLORS[index % CHART_COLORS.length];
  }

  openCreate(): void {
    this.editingTracker.set(null);
    this.formVisible.set(true);
  }

  openEdit(tracker: PriceTracker): void {
    this.editingTracker.set(tracker);
    this.formVisible.set(true);
  }

  saveTracker(payload: PriceTrackerPayload): void {
    const editing = this.editingTracker();
    const request = editing
      ? this.priceTrackingService.update(editing.id, payload)
      : this.priceTrackingService.create(payload);

    request.subscribe({
      next: (tracker) => {
        this.formVisible.set(false);
        this.editingTracker.set(null);
        this.activeTrackerId.set(tracker.id);
        this.messageService.add({
          severity: 'success',
          summary: this.transloco.translate(editing ? 'priceTracking.toast.updated' : 'priceTracking.toast.created'),
        });
      },
    });
  }

  deleteTracker(tracker: PriceTracker): void {
    this.confirmationService.confirm({
      message: this.transloco.translate('priceTracking.confirm.message', { name: tracker.name }),
      header: this.transloco.translate('priceTracking.confirm.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('priceTracking.confirm.accept'),
      rejectLabel: this.transloco.translate('priceTracking.confirm.reject'),
      accept: () => {
        this.priceTrackingService.delete(tracker.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: this.transloco.translate('priceTracking.toast.deleted') });
          },
        });
      },
    });
  }

  fetchActive(): void {
    const tracker = this.activeTracker();
    if (!tracker) return;
    this.fetching.set(true);
    this.priceTrackingService.fetchOne(tracker.id).subscribe({
      next: (result) => {
        this.fetching.set(false);
        this.loadReadings(tracker.id);
        this.messageService.add({
          severity: result.status === 'ok' ? 'success' : 'error',
          summary: result.status === 'ok'
            ? this.transloco.translate('priceTracking.toast.fetchOk', { count: result.newReadings ?? 0 })
            : this.transloco.translate('priceTracking.toast.fetchError'),
          detail: result.message,
        });
      },
      error: () => this.fetching.set(false),
    });
  }

  setPeriod(period: PeriodPreset): void {
    this.selectedPeriod.set(period);
  }

  setActiveTracker(value: string | number | undefined): void {
    if (value === undefined) return;
    this.activeTrackerId.set(Number(value));
  }

  private loadReadings(trackerId: number): void {
    const from = this.periodFromDate(this.selectedPeriod());
    this.loadingReadings.set(true);
    this.priceTrackingService.getReadings(trackerId, from, this.formatDate(new Date())).subscribe({
      next: (readings) => {
        this.readings.set(readings);
        this.loadingReadings.set(false);
      },
      error: () => this.loadingReadings.set(false),
    });
  }

  private periodFromDate(period: PeriodPreset): string | undefined {
    if (period === 'ALL') return undefined;
    const date = new Date();
    if (period === '1M') date.setMonth(date.getMonth() - 1);
    if (period === '3M') date.setMonth(date.getMonth() - 3);
    if (period === '6M') date.setMonth(date.getMonth() - 6);
    if (period === '1Y') date.setFullYear(date.getFullYear() - 1);
    return this.formatDate(date);
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
