import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagsService } from '../tags.service';
import { Tag } from '../../../core/models/tag.model';
import { TagRulesComponent } from '../tag-rules/tag-rules.component';

@Component({
  selector: 'app-tags-grid',
  standalone: true,
  imports: [FormsModule, ButtonModule, InputTextModule, TableModule, ToastModule, TagRulesComponent],
  providers: [MessageService],
  templateUrl: './tags-grid.component.html',
  styleUrl: './tags-grid.component.scss',
})
export class TagsGridComponent implements OnInit {
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);

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
        this.messageService.add({ severity: 'success', summary: 'Tag created' });
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
        this.messageService.add({ severity: 'success', summary: 'Tag updated' });
      },
    });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  deleteTag(tag: Tag) {
    this.tagsService.deleteTag(tag.id).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Tag deleted' }),
    });
  }
}
