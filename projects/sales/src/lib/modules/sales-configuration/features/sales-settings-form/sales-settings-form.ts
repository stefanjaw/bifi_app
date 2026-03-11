import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudSalesSettings } from '../../services/crud-sales-settings';
import { SalesSettingsForm, SalesSettingsFormModel } from '../../services/sales-settings-form';
import { salesSettings } from '../../interfaces/sales-settings';
import { CrudSequences, sequence } from '@avalantec/base-app/sequences';

@Component({
  selector: 'bifi-app-sales-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    TextareaModule,
    ProgressBarModule,
  ],
  templateUrl: './sales-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesSettingsFormComponent {
  private crudSalesSettings = inject(CrudSalesSettings);
  private formService = inject(SalesSettingsForm);
  private crudSequences = inject(CrudSequences);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);

  protected settingsResource = this.crudSalesSettings.getSettings();

  protected sequencesResource = this.crudSequences.get({
    id: signal(''),
    getInactive: signal(false),
  });

  protected sequenceOptions = computed<sequence[]>(() => {
    const data = this.sequencesResource.value();
    return Array.isArray(data) ? data : [];
  });

  protected loading = computed(() => this.settingsResource.isLoading() && !this.settingsResource.error());

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as salesSettings;

      this.formService.patchValue({
        orderSequence: this.resolveId(settings.orderSequence),
        description: settings.description ?? '',
      });
    });
  }

  private resolveId(value: sequence | string | undefined): string {
    if (!value) return '';
    if (typeof value === 'object') return (value as sequence)._id;
    return value;
  }

  protected handleSubmit(state: FormValueState<SalesSettingsFormModel>) {
    this.isSubmitLoading.set(true);

    const rawValue = state.rawValue;
    const payload: Record<string, any> = {};
    if (rawValue.orderSequence) payload['orderSequence'] = rawValue.orderSequence;
    if (rawValue.description) payload['description'] = rawValue.description;

    this.crudSalesSettings
      .putSettings(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.settingsResource.reload();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
