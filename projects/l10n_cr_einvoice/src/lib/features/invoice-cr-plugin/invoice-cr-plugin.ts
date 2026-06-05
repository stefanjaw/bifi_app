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
import { CrudInvoices } from '@avalantec/accounting';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

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
        </div>
      </ng-container>

      @if (canSubmitToHacienda()) {
        <div class="mt-3">
          <p-button
            label="Submit to Hacienda"
            icon="pi pi-send"
            severity="info"
            [loading]="isSubmitting()"
            (onClick)="submitToHacienda()"
          ></p-button>
        </div>
      }
    </div>
  `,
})
export class InvoiceCrPluginComponent implements OnInit {
  host = inject<InvoiceForm>(PLUGIN_CONTEXT);
  private crudInvoices = inject(CrudInvoices);
  private crudCondicionVenta = inject(CrudCondicionVenta);
  private crudMedioPago = inject(CrudMedioPago);
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);

  hostForm = this.host.form as FormGroup<any>;

  condicionVentaResource = this.crudCondicionVenta.get({});
  medioPagoResource = this.crudMedioPago.get({});

  condicionVentas = this.condicionVentaResource.value;
  medioPagos = this.medioPagoResource.value;

  isSubmitting = signal(false);

  einvoiceTypeOptions = [
    { label: 'FE - Factura Electrónica', value: 'FE' },
    { label: 'ND - Nota de Débito', value: 'ND' },
    { label: 'NC - Nota de Crédito', value: 'NC' },
    { label: 'TE - Tiquete Electrónico', value: 'TE' },
    { label: 'FEC - F.E. de Compra', value: 'FEC' },
    { label: 'FEE - F.E. de Exportación', value: 'FEE' },
    { label: 'REP - Recibo Electrónico de Pago', value: 'REP' },
  ];

  canSubmitToHacienda = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || entry.status !== 'posted') return false;
    const s = entry.crEinvoiceStatus;
    return !s || s === 'failed';
  });

  crEinvoiceStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crEinvoiceStatus ?? null;
  });

  crClave = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crClave ?? null;
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
}
