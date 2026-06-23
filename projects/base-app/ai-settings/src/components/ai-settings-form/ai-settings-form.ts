import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudAiSettings } from '../../services/crud-ai-settings';
import {
  AiSettingsForm,
  AiSettingsFormModel,
} from '../../services/ai-settings-form';
import { aiSettings, promptVersion } from '../../interfaces/ai-settings';

@Component({
  selector: 'bifi-app-ai-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    InputNumberModule,
    ProgressBarModule,
  ],
  templateUrl: './ai-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiSettingsPage {
  private crudSettings = inject(CrudAiSettings);
  private formService = inject(AiSettingsForm);
  private fb = inject(FormBuilder);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);

  protected settingsResource = this.crudSettings.getSettings();

  protected loading = computed(
    () => this.settingsResource.isLoading() && !this.settingsResource.error()
  );

  protected promptVersions = signal<promptVersion[]>([]);

  protected promptForms = signal<FormGroup[]>([]);

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as aiSettings;

      this.formService.patchValue({
        aiProvider: settings.aiProvider ?? 'google-gems',
        apiKey: settings.apiKey ?? '',
        model: settings.model ?? 'gemini-2.5-flash',
        embeddingModel: settings.embeddingModel ?? 'text-embedding-004',
        maxTokenLimit: String(settings.maxTokenLimit ?? 10000),
      });

      const versions = settings.promptVersions ?? [];
      this.promptVersions.set(versions);
      this.promptForms.set(
        versions.map((v) =>
          this.fb.group({
            name: [v.name],
            prompt: [v.prompt],
            version: [v.version],
            _id: [v._id ?? ''],
          })
        )
      );
    });
  }

  protected addPromptVersion() {
    const newForm = this.fb.group({
      name: [''],
      prompt: [''],
      version: [1],
      _id: [''],
    });
    this.promptForms.update((forms) => [...forms, newForm]);
  }

  protected removePromptVersion(index: number) {
    this.promptForms.update((forms) => forms.filter((_, i) => i !== index));
  }

  protected handleSubmit(state: FormValueState<AiSettingsFormModel>) {
    this.isSubmitLoading.set(true);

    const rawValue = state.rawValue;
    const payload: Record<string, unknown> = {};

    if (rawValue.aiProvider) payload['aiProvider'] = rawValue.aiProvider;
    if (rawValue.apiKey) payload['apiKey'] = rawValue.apiKey;
    if (rawValue.model) payload['model'] = rawValue.model;
    if (rawValue.embeddingModel) payload['embeddingModel'] = rawValue.embeddingModel;
    if (rawValue.maxTokenLimit)
      payload['maxTokenLimit'] = Number(rawValue.maxTokenLimit);

    const versions = this.promptForms().map((fg) => {
      const val = fg.getRawValue();
      const entry: Record<string, unknown> = {
        name: val.name,
        prompt: val.prompt,
        version: Number(val.version),
      };
      if (val._id) entry['_id'] = val._id;
      return entry;
    });
    payload['promptVersions'] = versions;

    this.crudSettings
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
