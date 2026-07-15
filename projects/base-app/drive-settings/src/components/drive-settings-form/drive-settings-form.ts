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
import { TranslatePipe } from '@avalantec/base-app/i18n';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudDriveSettings } from '../../services/crud-drive-settings';
import { DriveSettingsForm, DriveSettingsFormModel } from '../../services/drive-settings-form';
import { driveSettings } from '../../interfaces/drive-settings';

@Component({
  selector: 'bifi-app-drive-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    TranslatePipe,
    ButtonModule,
    InputTextModule,
    ProgressBarModule,
  ],
  templateUrl: './drive-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DriveSettingsPage {
  private crudSettings = inject(CrudDriveSettings);
  private formService = inject(DriveSettingsForm);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);

  protected settingsResource = this.crudSettings.getSettings();

  protected loading = computed(
    () => this.settingsResource.isLoading() && !this.settingsResource.error()
  );

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as driveSettings;

      this.formService.patchValue({
        serviceAccountKey: settings.serviceAccountKey ?? '',
      });
    });
  }

  protected handleSubmit(state: FormValueState<DriveSettingsFormModel>) {
    this.isSubmitLoading.set(true);

    const rawValue = state.rawValue;
    const payload: Record<string, unknown> = {};

    if (rawValue.serviceAccountKey && !rawValue.serviceAccountKey.includes('••••')) {
      payload['serviceAccountKey'] = rawValue.serviceAccountKey;
    }

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
