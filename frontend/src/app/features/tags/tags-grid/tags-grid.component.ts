import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { TagsService } from '../tags.service';
import { Tag } from '../../../core/models/tag.model';
import { TagRulesComponent } from '../tag-rules/tag-rules.component';

@Component({
  selector: 'app-tags-grid',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, TableModule, ToastModule, ConfirmDialogModule, TranslocoModule, TagRulesComponent],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tags-grid.component.html',
  styleUrl: './tags-grid.component.scss',
})
export class TagsGridComponent implements OnInit {
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  tags = this.tagsService.tags;
  newTagName = signal('');
  editingId = signal<number | null>(null);
  editingName = signal('');
  activeTab = signal<'tags' | 'rules'>('tags');

  ngOnInit() {
    this.tagsService.loadTags().subscribe();
    this.tagsService.loadRules().subscribe();
  }

  createTag() {
    if (!this.newTagName().trim()) return;
    this.tagsService.createTag(this.newTagName().trim()).subscribe({
      next: () => {
        this.newTagName.set('');
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('tags.grid.toast.created') });
      },
    });
  }

  startEdit(tag: Tag) {
    this.editingId.set(tag.id);
    this.editingName.set(tag.name);
  }

  saveEdit(tag: Tag) {
    this.tagsService.updateTag(tag.id, this.editingName()).subscribe({
      next: () => {
        this.editingId.set(null);
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('tags.grid.toast.updated') });
      },
    });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  deleteTag(tag: Tag) {
    this.confirmationService.confirm({
      message: this.transloco.translate('tags.grid.confirm.message', { name: tag.name }),
      header: this.transloco.translate('tags.grid.confirm.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('tags.grid.confirm.accept'),
      rejectLabel: this.transloco.translate('tags.grid.confirm.reject'),
      accept: () => {
        this.tagsService.deleteTag(tag.id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: this.transloco.translate('tags.grid.toast.deleted') }),
        });
      },
    });
  }
}
