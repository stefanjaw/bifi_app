import {
  ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { TextareaModule } from 'primeng/textarea';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudCrEinvoiceSettings, crEinvoiceSettings } from '../../services/crud-cr-einvoice-settings';
import { CrEinvoiceSettingsFormService, CrEinvoiceSettingsFormModel } from '../../services/cr-einvoice-settings-form.service';

@Component({
  selector: 'bifi-l10n-cr-einvoice-settings-form',
  imports: [ReactiveFormsModule, FormModule, InputTextModule, SelectModule, ButtonModule, ProgressBarModule, TextareaModule],
  templateUrl: './cr-einvoice-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrEinvoiceSettingsFormComponent {
  private crud = inject(CrudCrEinvoiceSettings);
  private formService = inject(CrEinvoiceSettingsFormService);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected settingsResource = this.crud.getSettings();
  protected loading = computed(() => this.settingsResource.isLoading() && !this.settingsResource.error());

  protected environmentOptions = [
    { label: 'Sandbox (Testing)', value: 'sandbox' },
    { label: 'Production', value: 'production' },
  ];

  constructor() {
    effect(() => {
      const raw = this.settingsResource.value();
      if (!raw) return;
      const s = raw as crEinvoiceSettings;
      this.formService.patchValue({
        proveedorSistemas: s.proveedorSistemas ?? '',
        haciendaUsername: s.haciendaUsername ?? '',
        haciendaPassword: s.haciendaPassword ?? '',
        certificateBase64: s.certificateBase64 ?? '',
        economicActivityCode: s.economicActivityCode ?? '',
        haciendaEnvironment: s.haciendaEnvironment ?? 'sandbox',
        codigoEstablecimiento: s.codigoEstablecimiento ?? '001',
        codigoPuntoVenta: s.codigoPuntoVenta ?? '00001',
      });
    });
  }

  protected handleSubmit(state: FormValueState<CrEinvoiceSettingsFormModel>) {
    this.isSubmitLoading.set(true);
    this.crud.putSettings(state.rawValue).pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => { this.isSubmitLoading.set(false); this.settingsResource.reload(); },
      error: () => { this.isSubmitLoading.set(false); },
    });
  }
}
