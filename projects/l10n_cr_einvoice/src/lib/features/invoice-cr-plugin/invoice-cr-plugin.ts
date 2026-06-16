import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ToastManager } from '@avalantec/base-app/core';
import { InvoiceForm } from '@avalantec/accounting';
import { CrudCondicionVenta } from '../../modules/condicion-venta/services/crud-condicion-venta';
import { CrudMedioPago } from '../../modules/medio-pago/services/crud-medio-pago';
import { CrudCrEinvoiceSettings } from '../../modules/cr-einvoice-settings/services/crud-cr-einvoice-settings';
import { CrudInvoices } from '@avalantec/accounting';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { HaciendaResponseDialogComponent } from './hacienda-response-dialog';

@Component({
  selector: 'bifi-l10n-invoice-cr-plugin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    InputNumberModule,
    ButtonModule,
    TagModule,
    CommonModule,
    HaciendaResponseDialogComponent,
  ],
  template: `
    <div class="border-t border-gray-200 mt-4 pt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-3">Costa Rica E-Invoice (Factura Electrónica)</h3>

      @if (crEinvoiceStatus()) {
        <div class="mb-3 flex items-center gap-2">
          <span class="text-sm text-gray-500">E-Invoice Status:</span>
          <p-tag
            [value]="crEinvoiceStatus()!"
            [severity]="crEinvoiceStatus() === 'accepted' || crEinvoiceStatus() === 'sent' ? 'success' : crEinvoiceStatus() === 'rejected' || crEinvoiceStatus() === 'failed' ? 'danger' : 'info'"
          ></p-tag>
          @if (crClave()) {
            <span class="text-xs text-gray-400 font-mono">{{ crClave() }}</span>
          }
        </div>
      }

      <ng-container [formGroup]="hostForm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <bifi-app-form-field>
            <bifi-app-form-label>Tipo Comprobante</bifi-app-form-label>
            <p-select
              formControlName="crEinvoiceType"
              [options]="einvoiceTypeOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select type"
            ></p-select>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>

          <bifi-app-form-field>
            <bifi-app-form-label>Condición de Venta</bifi-app-form-label>
            <p-select
              formControlName="crCondicionVentaId"
              [options]="condicionVentas() || []"
              optionLabel="description"
              optionValue="_id"
              placeholder="Select condición"
              [filter]="true"
              [showClear]="true"
            ></p-select>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>

          <bifi-app-form-field>
            <bifi-app-form-label>Medio de Pago</bifi-app-form-label>
            <p-select
              formControlName="crMedioPagoId"
              [options]="medioPagos() || []"
              optionLabel="description"
              optionValue="_id"
              placeholder="Select medio de pago"
              [filter]="true"
              [showClear]="true"
            ></p-select>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>

          <bifi-app-form-field>
            <bifi-app-form-label>Plazo Crédito (días)</bifi-app-form-label>
            <p-inputNumber
              formControlName="crPlazoCredito"
              [min]="0"
              placeholder="0"
            ></p-inputNumber>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>

          <bifi-app-form-field>
            <bifi-app-form-label>Actividad Económica Emisor</bifi-app-form-label>
            <p-select
              formControlName="crCodigoActividadEmisor"
              [options]="emisorActivityOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar actividad emisor"
              [showClear]="true"
            ></p-select>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>

          <bifi-app-form-field>
            <bifi-app-form-label>Actividad Económica Receptor</bifi-app-form-label>
            <p-select
              formControlName="crCodigoActividadReceptor"
              [options]="receptorActivityOptions()"
              optionLabel="label"
              optionValue="value"
              placeholder="Seleccionar actividad receptor"
              [showClear]="true"
            ></p-select>
            <bifi-app-form-error></bifi-app-form-error>
          </bifi-app-form-field>
        </div>
      </ng-container>

      <div class="mt-3 flex gap-2 flex-wrap">
        @if (canSubmitToHacienda()) {
          <p-button
            label="Submit to Hacienda"
            icon="pi pi-send"
            severity="info"
            [loading]="isSubmitting()"
            (onClick)="submitToHacienda()"
          ></p-button>
        }
        @if (canPollStatus()) {
          <p-button
            label="Check Status"
            icon="pi pi-refresh"
            severity="secondary"
            [loading]="isPolling()"
            (onClick)="checkStatus()"
          ></p-button>
        }
        @if (crHaciendaResponseXml()) {
          <p-button
            label="Respuesta de Hacienda"
            icon="pi pi-file-export"
            severity="secondary"
            (onClick)="responseDialog.openDialog()"
          ></p-button>
        }
      </div>

      <bifi-l10n-hacienda-response-dialog
        [responseXml]="crHaciendaResponseXml()"
        #responseDialog
      ></bifi-l10n-hacienda-response-dialog>
    </div>
  `,
})
export class InvoiceCrPluginComponent implements OnInit {
  host = inject<InvoiceForm>(PLUGIN_CONTEXT);
  private crudInvoices = inject(CrudInvoices);
  private crudCondicionVenta = inject(CrudCondicionVenta);
  private crudMedioPago = inject(CrudMedioPago);
  private crudEinvoiceSettings = inject(CrudCrEinvoiceSettings);
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);

  hostForm = this.host.form as FormGroup<any>;

  condicionVentaResource = this.crudCondicionVenta.get({});
  medioPagoResource = this.crudMedioPago.get({});
  settingsResource = this.crudEinvoiceSettings.getSettings();

  condicionVentas = this.condicionVentaResource.value;
  medioPagos = this.medioPagoResource.value;

  private selectedContactId = signal<string>('');

  isSubmitting = signal(false);
  isPolling = signal(false);

  einvoiceTypeOptions = [
    { label: 'FE - Factura Electrónica', value: 'FE' },
    { label: 'ND - Nota de Débito', value: 'ND' },
    { label: 'NC - Nota de Crédito', value: 'NC' },
    { label: 'TE - Tiquete Electrónico', value: 'TE' },
    { label: 'FEC - F.E. de Compra', value: 'FEC' },
    { label: 'FEE - F.E. de Exportación', value: 'FEE' },
    { label: 'REP - Recibo Electrónico de Pago', value: 'REP' },
  ];

  emisorActivityOptions = computed(() => {
    const settings = this.settingsResource.value() as any;
    const activities: any[] =
      settings?.emisorCompanyId?.contactId?.crEconomicActivityCodes ?? [];
    return activities.map((a: any) => ({
      label: a.description ? `${a.code} — ${a.description}` : a.code,
      value: a.code,
    }));
  });

  receptorActivityOptions = computed(() => {
    const contactId = this.selectedContactId();
    const contacts = (this.host.contacts() ?? []) as any[];
    const contact = contacts.find((c: any) => c._id === contactId);
    const activities: any[] = contact?.crEconomicActivityCodes ?? [];
    return activities.map((a: any) => ({
      label: a.description ? `${a.code} — ${a.description}` : a.code,
      value: a.code,
    }));
  });

  canSubmitToHacienda = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || entry.status !== 'posted') return false;
    const s = entry.crEinvoiceStatus;
    return !s || s === 'failed';
  });

  canPollStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry) return false;
    const s = entry.crEinvoiceStatus;
    return s === 'sent' || s === 'received';
  });

  crEinvoiceStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crEinvoiceStatus ?? null;
  });

  crClave = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crClave ?? null;
  });

  crHaciendaResponseXml = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    const r = entry?.crHaciendaResponse;
    if (!r) return null;
    return r['respuesta-xml'] ?? r['xml_hacienda'] ?? null;
  });

  ngOnInit() {
    if (!this.hostForm.contains('crEinvoiceType')) {
      this.hostForm.addControl('crEinvoiceType', new FormControl('FE'));
    }
    if (!this.hostForm.contains('crCondicionVentaId')) {
      this.hostForm.addControl('crCondicionVentaId', new FormControl(''));
    }
    if (!this.hostForm.contains('crMedioPagoId')) {
      this.hostForm.addControl('crMedioPagoId', new FormControl(''));
    }
    if (!this.hostForm.contains('crPlazoCredito')) {
      this.hostForm.addControl('crPlazoCredito', new FormControl(null));
    }
    if (!this.hostForm.contains('crCodigoActividadEmisor')) {
      this.hostForm.addControl('crCodigoActividadEmisor', new FormControl(''));
    }
    if (!this.hostForm.contains('crCodigoActividadReceptor')) {
      this.hostForm.addControl('crCodigoActividadReceptor', new FormControl(''));
    }

    const contactCtrl = this.hostForm.get('contactId');
    if (contactCtrl) {
      this.selectedContactId.set(contactCtrl.value ?? '');
      contactCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe((val: string) => this.selectedContactId.set(val ?? ''));
    }
  }

  constructor() {
    effect(() => {
      const entry = this.host.invoiceResource.value() as any;
      if (!entry) return;
      this.hostForm.patchValue({
        crEinvoiceType: entry.crEinvoiceType ?? 'FE',
        crCondicionVentaId:
          (entry.crCondicionVentaId as any)?._id ?? entry.crCondicionVentaId ?? '',
        crMedioPagoId:
          (entry.crMedioPagoId as any)?._id ?? entry.crMedioPagoId ?? '',
        crPlazoCredito: entry.crPlazoCredito ?? null,
        crCodigoActividadEmisor: entry.crCodigoActividadEmisor ?? '',
        crCodigoActividadReceptor: entry.crCodigoActividadReceptor ?? '',
      });
    });
  }

  submitToHacienda() {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);
    this.crudInvoices
      .submitEinvoice(this.host.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.host.invoiceResource.reload();
          this.toastManager.showSuccess('Invoice submitted to Hacienda successfully.');
        },
        error: (err: any) => {
          this.isSubmitting.set(false);
          this.host.invoiceResource.reload();
          const detail =
            err?.error?.message ??
            err?.error?.error_description ??
            err?.message ??
            'An error occurred while submitting to Hacienda.';
          this.toastManager.showError(`Hacienda submission failed: ${detail}`);
        },
      });
  }

  checkStatus() {
    if (this.isPolling()) return;
    this.isPolling.set(true);
    this.crudInvoices
      .pollEinvoiceStatus(this.host.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isPolling.set(false);
          this.host.invoiceResource.reload();
          this.toastManager.showSuccess('E-Invoice status updated.');
        },
        error: (err: any) => {
          this.isPolling.set(false);
          const detail =
            err?.error?.message ?? err?.message ?? 'Failed to check e-invoice status.';
          this.toastManager.showError(detail);
        },
      });
  }
}
