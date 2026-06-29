import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TagExpense } from '@core/models/transaction.model';
import { environment } from '@env/environment';

export interface BalancePoint {
  date: string;
  balance: number;
}

export interface Statistics {
  mostExpensiveDay: { date: string; amount: number } | null;
  currentStreak: number;
  longestStreak: number;
  totalIncome: number;
  totalExpenses: number;
  avgDailyExpense: number;
}

@Injectable({ providedIn: 'root' })
export class ChartsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/transactions`;

  getTagExpenses(from: string, to: string, accountId?: number) {
    let params = new HttpParams().set('from', from).set('to', to);
    if (accountId) params = params.set('accountId', String(accountId));
    return this.http.get<TagExpense[]>(`${this.baseUrl}/tags`, { params });
  }

  getCalendar(accountId: number, year: number) {
    const params = new HttpParams().set('accountId', String(accountId)).set('year', String(year));
    return this.http.get<Record<string, number>>(`${this.baseUrl}/calendar`, { params });
  }

  getStatistics(accountId: number, from: string, to: string) {
    const params = new HttpParams().set('accountId', String(accountId)).set('from', from).set('to', to);
    return this.http.get<Statistics>(`${this.baseUrl}/statistics`, { params });
  }
}
