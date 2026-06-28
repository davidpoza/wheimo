import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Recurrent, RecurrentLink, RecurrentPriceEntry } from '../../core/models/recurrent.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RecurrentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/recurrents`;

  recurrents = signal<Recurrent[]>([]);

  loadAll() {
    return this.http.get<Recurrent[]>(this.baseUrl).pipe(tap((list) => this.recurrents.set(list)));
  }

  getUpcoming() {
    return this.http.get<Recurrent[]>(`${this.baseUrl}/upcoming`);
  }

  create(data: Partial<Recurrent>) {
    return this.http.post<Recurrent>(this.baseUrl, data).pipe(
      tap((r) => this.recurrents.update((list) => [...list, r])),
    );
  }

  update(id: number, data: Partial<Recurrent>) {
    return this.http.patch<Recurrent>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updated) => this.recurrents.update((list) => list.map((r) => (r.id === id ? updated : r)))),
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.recurrents.update((list) => list.filter((r) => r.id !== id))),
    );
  }

  addPriceEntry(recurrentId: number, amount: number, units?: number | null, recordedAt?: string) {
    const body: { amount: number; units?: number; recordedAt?: string } = { amount };
    if (units != null) body.units = units;
    if (recordedAt) body.recordedAt = recordedAt;
    return this.http.post<RecurrentPriceEntry>(`${this.baseUrl}/${recurrentId}/prices`, body).pipe(
      tap((entry) => {
        this.recurrents.update((list) =>
          list.map((r) =>
            r.id === recurrentId
              ? { ...r, amount: entry.amount, units: entry.units != null ? entry.units : r.units }
              : r,
          ),
        );
      }),
    );
  }

  getPriceHistory(recurrentId: number) {
    return this.http.get<RecurrentPriceEntry[]>(`${this.baseUrl}/${recurrentId}/prices`);
  }

  assignTransaction(recurrentId: number, transactionId: number) {
    return this.http.post<RecurrentLink>(`${this.baseUrl}/${recurrentId}/transactions/${transactionId}`, {});
  }

  unassignTransaction(recurrentId: number, transactionId: number) {
    return this.http.delete(`${this.baseUrl}/${recurrentId}/transactions/${transactionId}`);
  }

  getLinkedTransactions(recurrentId: number) {
    return this.http.get<RecurrentLink[]>(`${this.baseUrl}/${recurrentId}/transactions`);
  }
}
