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
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudEmailSettings } from '../../../../services/crud-email-settings';
import {
  EmailSettingsForm,
  EmailSettingsFormModel,
} from '../../../../services/email-settings-form';
import { emailSettings } from '../../../../interfaces/email-settings';

@Component({
  selector: 'bifi-app-email-settings-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    ProgressBarModule,
    MessageModule,
  ],
  templateUrl: './email-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSettingsFormComponent {
  private crudSettings = inject(CrudEmailSettings);
  private formService = inject(EmailSettingsForm);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected testLoading = signal(false);
  protected testResult = signal<{ ok: boolean; message: string } | null>(null);

  protected providerOptions = [
    { label: 'Resend', value: 'resend' },
    { label: 'Mailgun', value: 'mailgun' },
    { label: 'Amazon SES', value: 'ses' },
    { label: 'SendGrid', value: 'sendgrid' },
  ];

  protected mailgunRegionOptions = [
    { label: 'US', value: 'us' },
    { label: 'EU', value: 'eu' },
  ];

  protected settingsResource = this.crudSettings.getSettings();

  protected loading = computed(
    () => this.settingsResource.isLoading() && !this.settingsResource.error()
  );

  protected selectedProvider = signal<string>('resend');

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const settings = raw as emailSettings;

      this.formService.patchValue({
        provider: settings.provider ?? 'resend',
        fromName: settings.fromName ?? '',
        fromEmail: settings.fromEmail ?? '',
        replyTo: settings.replyTo ?? '',
        resendApiKey: settings.resendApiKey ?? '',
        mailgunApiKey: settings.mailgunApiKey ?? '',
        mailgunDomain: settings.mailgunDomain ?? '',
        mailgunRegion: settings.mailgunRegion ?? 'us',
        sesAccessKeyId: settings.sesAccessKeyId ?? '',
        sesSecretAccessKey: settings.sesSecretAccessKey ?? '',
        sesRegion: settings.sesRegion ?? 'us-east-1',
        sendgridApiKey: settings.sendgridApiKey ?? '',
        trackOpens: settings.trackOpens ?? true,
        trackClicks: settings.trackClicks ?? true,
        footerText: settings.footerText ?? '',
        unsubscribeText: settings.unsubscribeText ?? 'Unsubscribe',
        testMode: settings.testMode ?? false,
        testRecipient: settings.testRecipient ?? '',
        publicBaseUrl: settings.publicBaseUrl ?? '',
      });
      this.selectedProvider.set(settings.provider ?? 'resend');
      this.formService.resetDirtyState();
    });
  }

  onProviderChange(value: string) {
    this.selectedProvider.set(value);
  }

  handleSubmit(state: FormValueState<EmailSettingsFormModel>) {
    this.isSubmitLoading.set(true);
    const raw = state.rawValue;
    const payload: Record<string, any> = {};

    Object.entries(raw).forEach(([key, value]) => {
      if (key.toLowerCase().includes('apikey') || key === 'sesSecretAccessKey') {
        if (value && !String(value).includes('•')) {
          payload[key] = value;
        }
      } else {
        payload[key] = value;
      }
    });

    this.crudSettings
      .putSettings(payload)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.settingsResource.reload();
        },
        error: () => this.isSubmitLoading.set(false),
      });
  }

  testConnection() {
    this.testLoading.set(true);
    this.testResult.set(null);
    this.crudSettings
      .testConnection()
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: res => {
          this.testLoading.set(false);
          this.testResult.set(res);
        },
        error: err => {
          this.testLoading.set(false);
          this.testResult.set({
            ok: false,
            message: err?.error?.message ?? 'Connection test failed',
          });
        },
      });
  }
}
