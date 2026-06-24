import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private readonly count = signal(0);

  readonly isLoading = computed(() => this.count() > 0);

  show(): void {
    this.count.update(n => n + 1);
  }

  hide(): void {
    this.count.update(n => (n > 0 ? n - 1 : 0));
  }
}
