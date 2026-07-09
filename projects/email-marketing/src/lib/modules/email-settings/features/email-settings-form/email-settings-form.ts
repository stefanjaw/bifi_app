import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
} from '@angular/core';
import { TranslatePipe, TranslationService } from '@avalantec/base-app/i18n';
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
    TranslatePipe,
  ],
  templateUrl: './email-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailSettingsPage {
  private translationService = inject(TranslationService);
  private crudSettings = inject(CrudEmailSettings);
  private formService = inject(EmailSettingsForm);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected testLoading = signal(false);
  protected testResult = signal<{ ok: boolean; message: string } | null>(null);

  protected providerOptions = [
    {
      label: this.translationService.translate('provider.resend', {}, 'email-marketing'),
      value: 'resend',
    },
    {
      label: this.translationService.translate('provider.mailgun', {}, 'email-marketing'),
      value: 'mailgun',
    },
    {
      label: this.translationService.translate('provider.amazonSes', {}, 'email-marketing'),
      value: 'ses',
    },
    {
      label: this.translationService.translate('provider.sendgrid', {}, 'email-marketing'),
      value: 'sendgrid',
    },
  ];

  protected mailgunRegionOptions = [
    {
      label: this.translationService.translate('provider.regionUs', {}, 'email-marketing'),
      value: 'us',
    },
    {
      label: this.translationService.translate('provider.regionEu', {}, 'email-marketing'),
      value: 'eu',
    },
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
            message:
              err?.error?.message ??
              this.translationService.translate(
                'notification.connectionTestFailed',
                {},
                'email-marketing'
              ),
          });
        },
      });
  }
}
