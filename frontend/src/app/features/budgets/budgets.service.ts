import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Budget, BudgetStatus } from '../../core/models/budget.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BudgetsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/budgets`;

  budgets = signal<Budget[]>([]);
  statuses = signal<BudgetStatus[]>([]);

  loadAll() {
    return this.http.get<Budget[]>(this.baseUrl).pipe(tap((b) => this.budgets.set(b)));
  }

  create(data: Partial<Budget>) {
    return this.http.post<Budget>(this.baseUrl, data).pipe(
      tap((b) => this.budgets.update((list) => [...list, b])),
    );
  }

  update(id: number, data: Partial<Budget>) {
    return this.http.patch<Budget>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updated) => this.budgets.update((list) => list.map((b) => (b.id === id ? updated : b)))),
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.budgets.update((list) => list.filter((b) => b.id !== id))),
    );
  }

  getStatus(id: number) {
    return this.http.get<BudgetStatus>(`${this.baseUrl}/${id}/status`);
  }

  loadAllStatuses() {
    return this.http.get<Budget[]>(this.baseUrl).pipe(
      tap((budgets) => {
        this.budgets.set(budgets);
        budgets.forEach((b) => {
          this.getStatus(b.id).subscribe((status) => {
            this.statuses.update((list) => {
              const idx = list.findIndex((s) => s.budget.id === b.id);
              return idx >= 0 ? list.map((s, i) => (i === idx ? status : s)) : [...list, status];
            });
          });
        });
      }),
    );
  }
}
