import { Component, computed, effect, inject, input, output, untracked } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TranslocoModule } from '@jsverse/transloco';
import { FetcherType, PriceTracker } from '@core/models/price-tracking.model';
import { PriceTrackerPayload } from '../price-tracking.service';

@Component({
  selector: 'app-price-tracker-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DialogModule, ButtonModule, InputTextModule, TextareaModule, SelectModule, ToggleSwitchModule,
    TranslocoModule,
  ],
  templateUrl: './price-tracker-form.component.html',
  styleUrl: './price-tracker-form.component.scss',
})
export class PriceTrackerFormComponent {
  private readonly fb = inject(FormBuilder);

  visible = input(false);
  tracker = input<PriceTracker | null>(null);
  fetcherTypes = input<FetcherType[]>([]);
  visibleChange = output<boolean>();
  save = output<PriceTrackerPayload>();

  readonly editing = computed(() => this.tracker() !== null);

  // productOptions depends only on fetcherTypes — NOT on any form value signal,
  // so it never re-triggers the effect when the user changes the product selection.
  readonly productOptions = computed<Array<{ id: string; label: string }>>(
    () => this.fetcherTypes()[0]?.paramSchema.products ?? []
  );

  form = this.fb.group({
    name: ['', Validators.required],
    fetcherType: ['GASOIL', Validators.required],
    active: [true],
    municipiosText: ['', Validators.required],
    productoKey: ['', Validators.required],
  });

  constructor() {
    // Only reset the form when the dialog OPENS (visible false→true).
    // tracker() and fetcherTypes() are read via untracked() so they do not
    // create reactive dependencies — Angular re-notifies InputSignals on every
    // change-detection cycle, which would otherwise reset user edits mid-session.
    let prevVisible = false;
    effect(() => {
      const isVisible = this.visible();

      if (!isVisible) {
        prevVisible = false;
        return;
      }
      if (prevVisible) return; // already initialized this open cycle
      prevVisible = true;

      const tracker = untracked(() => this.tracker());
      const types = untracked(() => this.fetcherTypes());
      const firstProductKey = types[0]?.paramSchema.products?.[0]?.id ?? '';

      if (tracker) {
        const params = tracker.params ?? {};
        const savedKey = params['productoKey'] ? String(params['productoKey']) : firstProductKey;
        this.form.reset({
          name: tracker.name,
          fetcherType: tracker.fetcherType,
          active: tracker.active,
          municipiosText: this.municipiosToText(params),
          productoKey: savedKey,
        });
      } else {
        this.form.reset({
          name: '',
          fetcherType: types[0]?.type ?? 'GASOIL',
          active: true,
          municipiosText: '',
          productoKey: firstProductKey,
        });
      }
    });
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const municipios = (value.municipiosText ?? '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [municipioId, label] = line.split('|').map((part) => part.trim());
        return label ? { municipioId, label } : { municipioId };
      });

    this.save.emit({
      name: value.name!,
      fetcherType: value.fetcherType!,
      active: value.active ?? true,
      params: {
        productoKey: value.productoKey!,
        ...(municipios.length === 1 ? { municipioId: municipios[0].municipioId } : { municipios }),
      },
    });
  }

  private municipiosToText(params: Record<string, unknown>): string {
    const municipios = params['municipios'];
    if (Array.isArray(municipios)) {
      return municipios
        .map((item) => {
          if (item && typeof item === 'object' && 'municipioId' in item) {
            const municipio = item as { municipioId?: string; label?: string };
            return municipio.label ? `${municipio.municipioId}|${municipio.label}` : municipio.municipioId;
          }
          return String(item);
        })
        .filter(Boolean)
        .join('\n');
    }
    return String(params['municipioId'] ?? '');
  }
}
