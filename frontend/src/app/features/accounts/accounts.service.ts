import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Account } from '../../core/models/account.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  accounts = signal<Account[]>([]);

  loadAll() {
    return this.http.get<Account[]>(this.baseUrl).pipe(tap((accounts) => this.accounts.set(accounts)));
  }

  create(data: Partial<Account>) {
    return this.http.post<Account>(this.baseUrl, data).pipe(
      tap((account) => this.accounts.update((list) => [...list, account])),
    );
  }

  update(id: number, data: Partial<Account>) {
    return this.http.patch<Account>(`${this.baseUrl}/${id}`, data).pipe(
      tap((updated) => this.accounts.update((list) => list.map((a) => (a.id === id ? updated : a)))),
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.accounts.update((list) => list.filter((a) => a.id !== id))),
    );
  }

  resync(id: number) {
    return this.http.post(`${this.baseUrl}/${id}/resync`, {});
  }

  fixBalances() {
    return this.http.post(`${this.baseUrl}/fix-balances`, {});
  }
}
