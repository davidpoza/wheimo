import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { TransactionsService } from '../transactions.service';
import { TagsService } from '../../tags/tags.service';

@Component({
  selector: 'app-tagging-dialog',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule, MultiSelectModule],
  template: `
    <p-dialog header="Apply Tags to Selected" [visible]="visible()" (visibleChange)="visibleChange.emit($event)" [modal]="true" [style]="{ width: '400px' }">
      <p>Apply tags to {{ transactionIds().length }} transaction(s):</p>
      <p-multiselect
        [(ngModel)]="selectedTagIds"
        [options]="tagsService.tags()"
        optionLabel="name"
        optionValue="id"
        placeholder="Select tags"
        class="w-full"
      />
      <ng-template pTemplate="footer">
        <p-button label="Cancel" [text]="true" severity="secondary" (onClick)="visibleChange.emit(false)" />
        <p-button label="Apply" (onClick)="apply()" [disabled]="selectedTagIds.length === 0" />
      </ng-template>
    </p-dialog>
  `,
})
export class TaggingDialogComponent {
  private readonly txService = inject(TransactionsService);
  readonly tagsService = inject(TagsService);

  visible = input<boolean>(false);
  transactionIds = input<number[]>([]);
  visibleChange = output<boolean>();
  done = output<void>();

  selectedTagIds: number[] = [];

  apply() {
    this.txService.applySpecificTags(this.transactionIds(), this.selectedTagIds).subscribe({
      next: () => {
        this.selectedTagIds = [];
        this.done.emit();
      },
    });
  }
}
