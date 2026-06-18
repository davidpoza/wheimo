import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Tag } from '../../core/models/tag.model';
import { Rule } from '../../core/models/rule.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);
  private readonly tagsUrl = `${environment.apiUrl}/tags`;
  private readonly rulesUrl = `${environment.apiUrl}/rules`;

  tags = signal<Tag[]>([]);
  rules = signal<Rule[]>([]);

  loadTags() {
    return this.http.get<Tag[]>(this.tagsUrl).pipe(tap((tags) => this.tags.set(tags)));
  }

  createTag(name: string) {
    return this.http.post<Tag>(this.tagsUrl, { name }).pipe(
      tap((tag) => this.tags.update((list) => [...list, tag])),
    );
  }

  updateTag(id: number, name: string) {
    return this.http.patch<Tag>(`${this.tagsUrl}/${id}`, { name }).pipe(
      tap((updated) => this.tags.update((list) => list.map((t) => (t.id === id ? updated : t)))),
    );
  }

  deleteTag(id: number) {
    return this.http.delete(`${this.tagsUrl}/${id}`).pipe(
      tap(() => this.tags.update((list) => list.filter((t) => t.id !== id))),
    );
  }

  loadRules() {
    return this.http.get<Rule[]>(this.rulesUrl).pipe(tap((rules) => this.rules.set(rules)));
  }

  createRule(data: Partial<Rule>) {
    return this.http.post<Rule>(this.rulesUrl, data).pipe(
      tap((rule) => this.rules.update((list) => [...list, rule])),
    );
  }

  updateRule(id: number, data: Partial<Rule>) {
    return this.http.patch<Rule>(`${this.rulesUrl}/${id}`, data).pipe(
      tap((updated) => this.rules.update((list) => list.map((r) => (r.id === id ? updated : r)))),
    );
  }

  deleteRule(id: number) {
    return this.http.delete(`${this.rulesUrl}/${id}`).pipe(
      tap(() => this.rules.update((list) => list.filter((r) => r.id !== id))),
    );
  }

  addTagToRule(ruleId: number, tagId: number) {
    return this.http.post<Rule>(`${this.rulesUrl}/${ruleId}/tags`, { tagId }).pipe(
      tap((updated) => this.rules.update((list) => list.map((r) => (r.id === ruleId ? updated : r)))),
    );
  }

  removeTagFromRule(ruleId: number, tagId: number) {
    return this.http.delete(`${this.rulesUrl}/${ruleId}/tags/${tagId}`).pipe(
      tap(() => this.loadRules().subscribe()),
    );
  }
}
