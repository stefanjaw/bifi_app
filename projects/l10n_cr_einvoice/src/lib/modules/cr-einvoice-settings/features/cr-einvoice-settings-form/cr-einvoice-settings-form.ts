import {
  ChangeDetectionStrategy, Component, computed, DestroyRef, effect, inject, signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ProgressBarModule } from 'primeng/progressbar';
import { FileUpload } from 'primeng/fileupload';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CrudCrEinvoiceSettings, crEinvoiceSettings } from '../../services/crud-cr-einvoice-settings';
import { CrEinvoiceSettingsFormService, crEinvoiceSettingsFormModel } from '../../services/cr-einvoice-settings-form';
import { CrudCompanies } from '@avalantec/base-app/companies';

@Component({
  selector: 'bifi-app-cr-einvoice-settings-form',
  imports: [ReactiveFormsModule, FormModule, InputTextModule, SelectModule, ButtonModule, ProgressBarModule, FileUpload],
  templateUrl: './cr-einvoice-settings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrEinvoiceSettingsForm {
  private crud = inject(CrudCrEinvoiceSettings);
  private crudCompanies = inject(CrudCompanies);
  private formService = inject(CrEinvoiceSettingsFormService);
  private destroy$ = inject(DestroyRef);

  protected form = this.formService.form;
  protected isSubmitLoading = signal(false);
  protected settingsResource = this.crud.getSettings();
  protected loading = computed(() => this.settingsResource.isLoading() && !this.settingsResource.error());

  protected companiesResource = this.crudCompanies.get({});

  protected companyOptions = computed(() => {
    const docs = this.companiesResource.value() ?? [];
    return docs.map((c) => ({ label: c.name, value: c._id }));
  });

  protected environmentOptions = [
    { label: 'Sandbox (Pruebas)', value: 'sandbox' },
    { label: 'Producción', value: 'production' },
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
        certificatePassword: s.certificatePassword ?? '',
        haciendaEnvironment: s.haciendaEnvironment ?? 'sandbox',
        codigoEstablecimiento: s.codigoEstablecimiento ?? '001',
        codigoPuntoVenta: s.codigoPuntoVenta ?? '00001',
        feVersion: s.feVersion ?? '4.4',
        emisorCompanyId: (s.emisorCompanyId as any)?._id ?? s.emisorCompanyId ?? '',
      });
    });
  }

  protected handleSubmit(state: FormValueState<crEinvoiceSettingsFormModel>) {
    this.isSubmitLoading.set(true);
    this.crud.putSettings(state.rawValue).pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => { this.isSubmitLoading.set(false); this.settingsResource.reload(); },
      error: () => { this.isSubmitLoading.set(false); },
    });
  }
}
