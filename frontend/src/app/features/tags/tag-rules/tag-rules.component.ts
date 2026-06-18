import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TagsService } from '../tags.service';

const RULE_TYPES = [
  { label: 'Regex (description)', value: 'regex' },
  { label: 'Equality', value: 'equality' },
  { label: 'Amount >', value: 'gt' },
  { label: 'Amount >=', value: 'gte' },
  { label: 'Amount <', value: 'lt' },
  { label: 'Amount <=', value: 'lte' },
  { label: 'Amount =', value: 'eq' },
  { label: 'Is Expense', value: 'isExpense' },
  { label: 'Has Receipt', value: 'isReceipt' },
];

@Component({
  selector: 'app-tag-rules',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, SelectModule, MultiSelectModule, TableModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './tag-rules.component.html',
  styleUrl: './tag-rules.component.scss',
})
export class TagRulesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);

  rules = this.tagsService.rules;
  tags = this.tagsService.tags;
  ruleTypes = RULE_TYPES;
  showForm = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['regex', Validators.required],
    value: [''],
    tagIds: [[] as number[]],
  });

  get selectedType() {
    return this.form.get('type')?.value;
  }

  ngOnInit() {
    this.tagsService.loadRules().subscribe();
  }

  createRule() {
    if (this.form.invalid) return;
    const { name, type, value, tagIds } = this.form.value;
    this.tagsService.createRule({ name: name!, type: type as any, value: value ?? '', tags: tagIds?.map(id => ({ id })) as any }).subscribe({
      next: () => {
        this.form.reset({ type: 'regex', tagIds: [] });
        this.showForm.set(false);
        this.messageService.add({ severity: 'success', summary: 'Rule created' });
      },
    });
  }

  deleteRule(id: number) {
    this.tagsService.deleteRule(id).subscribe({
      next: () => this.messageService.add({ severity: 'success', summary: 'Rule deleted' }),
    });
  }
}
