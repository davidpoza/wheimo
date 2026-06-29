import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs';
import { Transaction, TransactionFilters, TransactionPage, TagExpense } from '../../core/models/transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  private readonly DEFAULT_FILTERS: TransactionFilters = { limit: 50, offset: 0, sort: 'date,desc' };

  transactions = signal<Transaction[]>([]);
  total = signal<number>(0);
  filters = signal<TransactionFilters>({ ...this.DEFAULT_FILTERS });

  loadAll(filters?: TransactionFilters) {
    const active = { ...this.filters(), ...filters };
    let params = new HttpParams();
    Object.entries(active).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        if (Array.isArray(v)) {
          v.forEach((item) => (params = params.append(k, item)));
        } else {
          params = params.set(k, String(v));
        }
      }
    });
    return this.http.get<TransactionPage>(this.baseUrl, { params }).pipe(
      tap((page) => {
        this.transactions.set(page.data);
        this.total.set(page.total);
      }),
    );
  }

  search(filters: TransactionFilters) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        if (Array.isArray(v)) v.forEach((item) => (params = params.append(k, item)));
        else params = params.set(k, String(v));
      }
    });
    return this.http.get<TransactionPage>(this.baseUrl, { params });
  }

  create(data: Partial<Transaction>) {
    return this.http.post<Transaction>(this.baseUrl, data);
  }

  getById(id: number) {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }

  update(id: number, data: Partial<Transaction>) {
    return this.http.patch<Transaction>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  deleteMany(ids: number[]) {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.http.delete(this.baseUrl, { params });
  }

  applyTags(id: number) {
    return this.http.post<Transaction>(`${this.baseUrl}/${id}/apply-tags`, {});
  }

  applySpecificTags(transactionIds: number[], tagIds: number[]) {
    return this.http.post(`${this.baseUrl}/apply-specific-tags`, { ids: transactionIds, tagIds });
  }

  getTagExpenses(from: string, to: string, accountId?: number) {
    let params = new HttpParams().set('from', from).set('to', to);
    if (accountId) params = params.set('accountId', accountId);
    return this.http.get<TagExpense[]>(`${this.baseUrl}/tags`, { params });
  }

  setFilters(f: TransactionFilters) {
    this.filters.set({ ...this.filters(), ...f, offset: 0 });
  }

  resetFilters() {
    this.filters.set({ ...this.DEFAULT_FILTERS });
  }
}
