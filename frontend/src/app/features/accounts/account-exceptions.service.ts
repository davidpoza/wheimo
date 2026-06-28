import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountException } from '../../core/models/account-exception.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountExceptionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/accounts`;

  private url(accountId: number) {
    return `${this.baseUrl}/${accountId}/exceptions`;
  }

  list(accountId: number) {
    return this.http.get<AccountException[]>(this.url(accountId));
  }

  create(accountId: number, data: { regex: string; description?: string | null }) {
    return this.http.post<AccountException>(this.url(accountId), data);
  }

  update(accountId: number, id: number, data: { regex?: string; description?: string | null }) {
    return this.http.patch<AccountException>(`${this.url(accountId)}/${id}`, data);
  }

  delete(accountId: number, id: number) {
    return this.http.delete(`${this.url(accountId)}/${id}`);
  }
}
