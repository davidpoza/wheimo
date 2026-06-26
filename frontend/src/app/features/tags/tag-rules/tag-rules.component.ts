import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagsService } from '../tags.service';

function validRegex(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  try {
    new RegExp(control.value);
    return null;
  } catch {
    return { invalidRegex: true };
  }
}

const RULE_TYPES = [
  { label: 'Regex (description)', value: 'description' },
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
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, MultiSelectModule, TableModule, TagModule, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tag-rules.component.html',
  styleUrl: './tag-rules.component.scss',
})
export class TagRulesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  rules = this.tagsService.rules;
  tags = this.tagsService.tags;
  ruleTypes = RULE_TYPES;
  showForm = signal(false);

  form = this.fb.group({
    name: ['', Validators.required],
    type: ['description', Validators.required],
    value: ['', validRegex],
    tagIds: [[] as number[]],
  });

  get selectedType() {
    return this.form.get('type')?.value;
  }

  ngOnInit() {
    this.tagsService.loadRules().subscribe();
    this.tagsService.loadTags().subscribe();
  }

  createRule() {
    if (this.form.invalid) return;
    const { name, type, value, tagIds } = this.form.value;
    this.tagsService.createRule({ name: name!, type: type as any, value: value ?? '' }, tagIds ?? []).subscribe({
      next: () => {
        this.form.reset({ type: 'description', tagIds: [] });
        this.showForm.set(false);
        this.messageService.add({ severity: 'success', summary: 'Rule created' });
      },
    });
  }

  deleteRule(id: number) {
    this.confirmationService.confirm({
      message: '¿Eliminar esta regla?',
      header: 'Confirmar eliminación',
      icon: 'pi pi-trash',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.tagsService.deleteRule(id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: 'Rule deleted' }),
        });
      },
    });
  }
}
