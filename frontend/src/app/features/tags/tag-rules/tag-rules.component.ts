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
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
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

const RULE_TYPE_VALUES = ['description', 'equality', 'gt', 'gte', 'lt', 'lte', 'eq', 'isExpense', 'isReceipt'];

@Component({
  selector: 'app-tag-rules',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, DialogModule, InputTextModule, SelectModule, MultiSelectModule, TableModule, TagModule, ToastModule, ConfirmDialogModule, TranslocoModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './tag-rules.component.html',
  styleUrl: './tag-rules.component.scss',
})
export class TagRulesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly tagsService = inject(TagsService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly transloco = inject(TranslocoService);

  rules = this.tagsService.rules;
  tags = this.tagsService.tags;
  showForm = signal(false);

  get ruleTypes() {
    return RULE_TYPE_VALUES.map((value) => ({
      label: this.transloco.translate('tags.rules.type.' + value),
      value,
    }));
  }

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
        this.messageService.add({ severity: 'success', summary: this.transloco.translate('tags.rules.toast.created') });
      },
    });
  }

  deleteRule(id: number) {
    this.confirmationService.confirm({
      message: this.transloco.translate('tags.rules.confirm.message'),
      header: this.transloco.translate('tags.rules.confirm.header'),
      icon: 'pi pi-trash',
      acceptLabel: this.transloco.translate('tags.rules.confirm.accept'),
      rejectLabel: this.transloco.translate('tags.rules.confirm.reject'),
      accept: () => {
        this.tagsService.deleteRule(id).subscribe({
          next: () => this.messageService.add({ severity: 'success', summary: this.transloco.translate('tags.rules.toast.deleted') }),
        });
      },
    });
  }
}
