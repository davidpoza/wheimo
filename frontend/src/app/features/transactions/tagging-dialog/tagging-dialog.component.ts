import { Component, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TransactionsService } from '../transactions.service';
import { TagsService } from '@features/tags/tags.service';

@Component({
  selector: 'app-tagging-dialog',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule, MultiSelectModule, ConfirmDialogModule, TranslocoModule],
  providers: [ConfirmationService],
  template: `
    <p-dialog [header]="'transactions.tagging.header' | transloco" [visible]="visible()" (visibleChange)="visibleChange.emit($event)" [modal]="true" [style]="{ width: '400px' }">
      <p>{{ 'transactions.tagging.applyTo' | transloco: { count: transactionIds().length } }}</p>
      <p-multiselect
        [(ngModel)]="selectedTagIds"
        [options]="tagsService.tags()"
        optionLabel="name"
        optionValue="id"
        [placeholder]="'common.selectTags' | transloco"
        class="w-full"
        appendTo="body"
      />
      <ng-template pTemplate="footer">
        <p-button [label]="'common.cancel' | transloco" [text]="true" severity="secondary" (onClick)="visibleChange.emit(false)" />
        <p-button [label]="'common.apply' | transloco" (onClick)="apply()" [disabled]="selectedTagIds.length === 0" />
      </ng-template>
    </p-dialog>
    <p-confirmDialog />
  `,
})
export class TaggingDialogComponent {
  private readonly txService = inject(TransactionsService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);
  readonly tagsService = inject(TagsService);

  visible = input<boolean>(false);
  transactionIds = input<number[]>([]);
  visibleChange = output<boolean>();
  done = output<void>();

  selectedTagIds: number[] = [];

  apply() {
    this.confirmationService.confirm({
      message: this.transloco.translate('transactions.tagging.confirm.message', { count: this.transactionIds().length }),
      header: this.transloco.translate('transactions.tagging.confirm.header'),
      icon: 'pi pi-tags',
      acceptLabel: this.transloco.translate('transactions.tagging.confirm.accept'),
      rejectLabel: this.transloco.translate('transactions.tagging.confirm.reject'),
      accept: () => {
        this.txService.applySpecificTags(this.transactionIds(), this.selectedTagIds).subscribe({
          next: () => {
            this.selectedTagIds = [];
            this.done.emit();
          },
        });
      },
    });
  }
}
