import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '@env/environment';
import { FetcherType, FetchResult, PriceReading, PriceTracker } from '@core/models/price-tracking.model';

export interface PriceTrackerPayload {
  name: string;
  fetcherType: string;
  params: Record<string, unknown>;
  active?: boolean;
}

@Injectable({ providedIn: 'root' })
export class PriceTrackingService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/price-trackers`;

  trackers = signal<PriceTracker[]>([]);
  fetcherTypes = signal<FetcherType[]>([]);

  loadTrackers() {
    return this.http.get<PriceTracker[]>(this.baseUrl).pipe(tap((trackers) => this.trackers.set(trackers)));
  }

  loadFetcherTypes() {
    return this.http.get<FetcherType[]>(`${this.baseUrl}/fetcher-types`).pipe(
      tap((types) => this.fetcherTypes.set(types)),
    );
  }

  getReadings(trackerId: number, from?: string, to?: string) {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to) params = params.set('to', to);
    return this.http.get<PriceReading[]>(`${this.baseUrl}/${trackerId}/readings`, { params });
  }

  create(payload: PriceTrackerPayload) {
    return this.http.post<PriceTracker>(this.baseUrl, payload).pipe(
      tap((tracker) => this.trackers.update((list) => [...list, tracker].sort((a, b) => a.name.localeCompare(b.name)))),
    );
  }

  update(id: number, payload: Partial<PriceTrackerPayload>) {
    return this.http.put<PriceTracker>(`${this.baseUrl}/${id}`, payload).pipe(
      tap((updated) => this.trackers.update((list) => list.map((t) => (t.id === id ? updated : t)).sort((a, b) => a.name.localeCompare(b.name)))),
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.trackers.update((list) => list.filter((t) => t.id !== id))),
    );
  }

  fetchOne(id: number) {
    return this.http.post<FetchResult>(`${this.baseUrl}/${id}/fetch`, {});
  }
}
