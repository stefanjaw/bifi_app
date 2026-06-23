import { Component, computed, DestroyRef, effect, inject, Injector, OnDestroy, OnInit, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormModule } from '@avalantec/base-app/form';
import { PLUGIN_CONTEXT } from '@avalantec/base-app/plugin-system';
import { ToastManager } from '@avalantec/base-app/core';
import { InvoiceForm } from '@avalantec/accounting';
import { CrudCondicionVenta } from '../../modules/condicion-venta/services/crud-condicion-venta';
import { CrudMedioPago } from '../../modules/medio-pago/services/crud-medio-pago';
import { CrudCrEinvoiceSettings } from '../../modules/cr-einvoice-settings/services/crud-cr-einvoice-settings';
import { CrudCrEinvoice } from '../../modules/cr-einvoice-settings/services/crud-cr-einvoice';
import { CrudInvoices } from '@avalantec/accounting';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
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
    DatePickerModule,
    ButtonModule,
    TagModule,
    CommonModule,
    DialogModule,
    InputTextModule,
    HaciendaResponseDialogComponent,
  ],
  template: `
    <div class="border-t border-gray-200 mt-4 pt-4">
      <h3 class="text-sm font-semibold text-gray-700 mb-3"
        >Costa Rica E-Invoice (Factura Electrónica)</h3
      >

      @if (crEinvoiceStatus()) {
        <div class="mb-3 flex items-center gap-2">
          <span class="text-sm text-gray-500">E-Invoice Status:</span>
          <p-tag
            [value]="crEinvoiceStatus()!"
            [severity]="
              crEinvoiceStatus() === 'accepted' || crEinvoiceStatus() === 'sent'
                ? 'success'
                : crEinvoiceStatus() === 'rejected' || crEinvoiceStatus() === 'failed'
                  ? 'danger'
                  : 'info'
            "
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

          @if (!isAcceptanceType()) {
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

            @if (isReferenceType()) {
              <div class="md:col-span-2 border-t border-amber-200 bg-amber-50 rounded-lg p-3 mt-1">
                <h4 class="text-sm font-semibold text-amber-800 mb-3">
                  Información de Referencia
                  <span class="font-normal text-amber-600">(FEC: comprobante físico original; NC/ND: factura que se corrige)</span>
                </h4>
                <ng-container formGroupName="crInformacionReferencia">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <bifi-app-form-field>
                      <bifi-app-form-label>Tipo de Documento <span class="text-red-500">*</span></bifi-app-form-label>
                      <p-select
                        formControlName="tipoDocIR"
                        [options]="tipoDocIROptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar tipo"
                        [filter]="true"
                      ></p-select>
                      <bifi-app-form-error></bifi-app-form-error>
                    </bifi-app-form-field>

                    @if (refForm?.get('tipoDocIR')?.value === '99') {
                      <bifi-app-form-field>
                        <bifi-app-form-label>Tipo de Documento OTRO <span class="text-red-500">*</span></bifi-app-form-label>
                        <input
                          pInputText
                          formControlName="tipoDocRefOTRO"
                          maxlength="100"
                          style="width:100%"
                          placeholder="Describa el tipo de documento"
                        />
                        <bifi-app-form-error></bifi-app-form-error>
                      </bifi-app-form-field>
                    }

                    <bifi-app-form-field>
                      <bifi-app-form-label>Número del Comprobante</bifi-app-form-label>
                      <input
                        pInputText
                        formControlName="numero"
                        maxlength="100"
                        style="width:100%"
                        placeholder="Número del comprobante físico"
                      />
                      <bifi-app-form-error></bifi-app-form-error>
                    </bifi-app-form-field>

                    <bifi-app-form-field>
                      <bifi-app-form-label>Fecha de Emisión</bifi-app-form-label>
                      <p-datepicker
                        formControlName="fechaEmisionIR"
                        placeholder="Fecha del comprobante original"
                        [showIcon]="true"
                        dateFormat="yy-mm-dd"
                      ></p-datepicker>
                      <bifi-app-form-error></bifi-app-form-error>
                    </bifi-app-form-field>

                    <bifi-app-form-field>
                      <bifi-app-form-label>Código de Referencia</bifi-app-form-label>
                      <p-select
                        formControlName="codigo"
                        [options]="codigoOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Seleccionar código"
                        [showClear]="true"
                      ></p-select>
                      <bifi-app-form-error></bifi-app-form-error>
                    </bifi-app-form-field>

                    @if (refForm?.get('codigo')?.value === '99') {
                      <bifi-app-form-field>
                        <bifi-app-form-label>Código OTRO <span class="text-red-500">*</span></bifi-app-form-label>
                        <input
                          pInputText
                          formControlName="codigoReferenciaOTRO"
                          maxlength="100"
                          style="width:100%"
                        />
                        <bifi-app-form-error></bifi-app-form-error>
                      </bifi-app-form-field>
                    }

                    <bifi-app-form-field class="md:col-span-2">
                      <bifi-app-form-label>Razón (máx. 180 caracteres)</bifi-app-form-label>
                      <input
                        pInputText
                        formControlName="razon"
                        maxlength="180"
                        style="width:100%"
                        placeholder="Descripción de la referencia"
                      />
                      <bifi-app-form-error></bifi-app-form-error>
                    </bifi-app-form-field>
                  </div>
                </ng-container>
              </div>
            }
          }

          @if (isAcceptanceType()) {
            <bifi-app-form-field>
              <bifi-app-form-label>Condición de Impuesto</bifi-app-form-label>
              <p-select
                formControlName="crCondicionImpuesto"
                [options]="condicionImpuestoOptions"
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccionar condición"
              ></p-select>
              <bifi-app-form-error></bifi-app-form-error>
            </bifi-app-form-field>

            <bifi-app-form-field>
              <bifi-app-form-label>Monto Total Impuesto a Acreditar</bifi-app-form-label>
              <p-inputNumber
                formControlName="crMontoTotalImpuestoAcreditar"
                [min]="0"
                [minFractionDigits]="2"
                [maxFractionDigits]="5"
                placeholder="0.00"
              ></p-inputNumber>
              <bifi-app-form-error></bifi-app-form-error>
            </bifi-app-form-field>

            <bifi-app-form-field>
              <bifi-app-form-label>Monto Total Gasto Aplicable</bifi-app-form-label>
              <p-inputNumber
                formControlName="crMontoTotalGastoAplicable"
                [min]="0"
                [minFractionDigits]="2"
                [maxFractionDigits]="5"
                placeholder="0.00"
              ></p-inputNumber>
              <bifi-app-form-error></bifi-app-form-error>
            </bifi-app-form-field>

            <bifi-app-form-field class="md:col-span-2">
              <bifi-app-form-label>Detalle del Mensaje (opcional)</bifi-app-form-label>
              <input
                pInputText
                formControlName="crDetalleMensaje"
                maxlength="255"
                style="width:100%"
                placeholder="Detalle adicional del mensaje receptor"
              />
              <bifi-app-form-error></bifi-app-form-error>
            </bifi-app-form-field>
          }
        </div>
      </ng-container>

      @if (isAcceptanceType()) {
        <div class="mt-3 border-t border-gray-100 pt-3">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-sm font-semibold text-gray-700">Mensaje Receptor (Acceptance):</span>
            @if (crAcceptanceStatus()) {
              <p-tag
                [value]="crAcceptanceStatus()!"
                [severity]="
                  crAcceptanceStatus() === 'accepted' ? 'success'
                    : crAcceptanceStatus() === 'rejected' ? 'danger'
                    : crAcceptanceStatus() === 'sent' ? 'info'
                    : 'secondary'
                "
              ></p-tag>
            }
          </div>
          <div class="flex gap-2 flex-wrap">
            @if (canSubmitAcceptance()) {
              <p-button
                label="Enviar Mensaje Receptor"
                icon="pi pi-send"
                severity="info"
                [loading]="isSubmittingAcceptance()"
                (onClick)="submitAcceptance()"
              ></p-button>
            }
            @if (canPollAcceptanceStatus()) {
              <p-button
                label="Verificar Estado Aceptación"
                icon="pi pi-refresh"
                severity="secondary"
                [loading]="isPollingAcceptance()"
                (onClick)="pollAcceptanceStatus()"
              ></p-button>
            }
            @if (crAcceptanceHaciendaResponseXml()) {
              <p-button
                label="Respuesta de Aceptación"
                icon="pi pi-file-export"
                severity="secondary"
                (onClick)="acceptanceResponseDialog.openDialog()"
              ></p-button>
            }
          </div>
        </div>
      }

      @if (!isAcceptanceType()) {
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
          @if (canCreateNote()) {
            <p-button
              label="Nota de Crédito"
              icon="pi pi-copy"
              severity="warn"
              [loading]="isCreatingNote()"
              (onClick)="openNoteDialog('NC')"
            ></p-button>
            <p-button
              label="Nota de Débito"
              icon="pi pi-copy"
              severity="warn"
              [loading]="isCreatingNote()"
              (onClick)="openNoteDialog('ND')"
            ></p-button>
          }
        </div>
      }

      <bifi-l10n-hacienda-response-dialog
        [responseXml]="crHaciendaResponseXml()"
        #responseDialog
      ></bifi-l10n-hacienda-response-dialog>

      <bifi-l10n-hacienda-response-dialog
        [responseXml]="crAcceptanceHaciendaResponseXml()"
        #acceptanceResponseDialog
      ></bifi-l10n-hacienda-response-dialog>

      <!-- Note Creation Dialog -->
      <p-dialog
        [header]="pendingNoteType() === 'NC' ? 'Crear Nota de Crédito' : 'Crear Nota de Débito'"
        [(visible)]="noteDialogVisible"
        [modal]="true"
        [style]="{ width: '450px' }"
        [closable]="!isCreatingNote()"
      >
        <ng-container [formGroup]="noteForm">
          <div class="flex flex-col gap-4 pt-2">
            <bifi-app-form-field>
              <bifi-app-form-label>Código de Razón</bifi-app-form-label>
              <p-select
                appendTo="body"
                formControlName="codigo"
                [options]="codigoOptions"
                optionLabel="label"
                optionValue="value"
              ></p-select>
            </bifi-app-form-field>
            @if (noteForm.get('codigo')?.value === '99') {
              <bifi-app-form-field>
                <bifi-app-form-label>Código de Referencia (OTRO)</bifi-app-form-label>
                <input
                  pInputText
                  formControlName="codigoReferenciaOTRO"
                  maxlength="100"
                  style="width:100%"
                />
              </bifi-app-form-field>
            }
            <bifi-app-form-field>
              <bifi-app-form-label>Razón (máx. 180 caracteres)</bifi-app-form-label>
              <input pInputText formControlName="razon" maxlength="180" style="width:100%" />
            </bifi-app-form-field>
          </div>
        </ng-container>
        <ng-template pTemplate="footer">
          <p-button
            label="Cancelar"
            severity="secondary"
            [disabled]="isCreatingNote()"
            (onClick)="noteDialogVisible = false"
          ></p-button>
          <p-button
            label="Crear Nota"
            icon="pi pi-check"
            [loading]="isCreatingNote()"
            (onClick)="confirmCreateNote()"
          ></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `,
})
export class InvoiceCrPluginComponent implements OnInit, OnDestroy {
  host = inject<InvoiceForm>(PLUGIN_CONTEXT);
  private crudInvoices = inject(CrudInvoices);
  private crudCrEinvoice = inject(CrudCrEinvoice);
  private crudCondicionVenta = inject(CrudCondicionVenta);
  private crudMedioPago = inject(CrudMedioPago);
  private crudEinvoiceSettings = inject(CrudCrEinvoiceSettings);
  private destroy$ = inject(DestroyRef);
  private injector = inject(Injector);
  private toastManager = inject(ToastManager);
  private router = inject(Router);

  hostForm = this.host.form as FormGroup<any>;

  condicionVentaResource = this.crudCondicionVenta.get({});
  medioPagoResource = this.crudMedioPago.get({});
  settingsResource = this.crudEinvoiceSettings.getSettings();

  condicionVentas = this.condicionVentaResource.value;
  medioPagos = this.medioPagoResource.value;

  private selectedContactId = signal<string>('');

  isSubmitting = signal(false);
  isPolling = signal(false);
  isCreatingNote = signal(false);
  isSubmittingAcceptance = signal(false);
  isPollingAcceptance = signal(false);

  noteDialogVisible = false;
  pendingNoteType = signal<'NC' | 'ND'>('NC');

  condicionImpuestoOptions = [
    { label: '01 — Crédito del impuesto aplicado', value: '01' },
    { label: '02 — Crédito parcial del impuesto', value: '02' },
    { label: '03 — Bienes y servicios exentos', value: '03' },
    { label: '04 — Bienes y servicios exonerados', value: '04' },
    { label: '05 — Bienes y servicios no sujetos', value: '05' },
  ];

  codigoOptions = [
    { label: '01 — Anula Documento de Referencia', value: '01' },
    { label: '02 — Corrige monto', value: '02' },
    { label: '04 — Referencia a otro documento', value: '04' },
    { label: '05 — Sustituye comprobante provisional por contingencia', value: '05' },
    { label: '06 — Devolución de mercancía', value: '06' },
    { label: '07 — Sustituye comprobante electrónico', value: '07' },
    { label: '08 — Factura Endosada', value: '08' },
    { label: '09 — Nota de crédito financiera', value: '09' },
    { label: '10 — Nota de débito financiera', value: '10' },
    { label: '11 — Proveedor No Domiciliado', value: '11' },
    { label: '12 — Crédito por exoneración posterior a la facturación', value: '12' },
    { label: '99 — Otros', value: '99' },
  ];

  noteForm = new FormGroup({
    codigo: new FormControl('01'),
    codigoReferenciaOTRO: new FormControl(''),
    razon: new FormControl(''),
  });

  einvoiceTypeOptions = [
    { label: 'FE - Factura Electrónica', value: 'FE' },
    { label: 'ND - Nota de Débito', value: 'ND' },
    { label: 'NC - Nota de Crédito', value: 'NC' },
    { label: 'TE - Tiquete Electrónico', value: 'TE' },
    { label: 'FEC - F.E. de Compra', value: 'FEC' },
    { label: 'FEE - F.E. de Exportación', value: 'FEE' },
    { label: 'REP - Recibo Electrónico de Pago', value: 'REP' },
    { label: 'MA - Mensaje Aceptado', value: 'MA' },
    { label: 'MAP - Mensaje Aceptado Parcialmente', value: 'MAP' },
    { label: 'MR - Mensaje Rechazado', value: 'MR' },
  ];

  isAcceptanceType!: Signal<boolean>;
  isReferenceType!: Signal<boolean>;

  get refForm(): FormGroup | null {
    return (this.hostForm.get('crInformacionReferencia') as FormGroup) ?? null;
  }

  private buildRefGroup(): FormGroup {
    return new FormGroup({
      tipoDocIR:            new FormControl(''),
      tipoDocRefOTRO:       new FormControl(''),
      numero:               new FormControl(''),
      fechaEmisionIR:       new FormControl(null),
      codigo:               new FormControl(''),
      codigoReferenciaOTRO: new FormControl(''),
      razon:                new FormControl(''),
    });
  }

  tipoDocIROptions = [
    { label: '01 — Factura Electrónica', value: '01' },
    { label: '02 — Nota de Débito Electrónica', value: '02' },
    { label: '03 — Nota de Crédito Electrónica', value: '03' },
    { label: '04 — Tiquete Electrónico', value: '04' },
    { label: '05 — Nota de Despacho', value: '05' },
    { label: '06 — Contrato', value: '06' },
    { label: '07 — Procedimiento', value: '07' },
    { label: '08 — Comprobante en Contingencia', value: '08' },
    { label: '09 — Devolución de Mercancía', value: '09' },
    { label: '10 — Comprobante rechazado por Hacienda', value: '10' },
    { label: '11 — Comprobante rechazado por Receptor', value: '11' },
    { label: '12 — Sustituye doc. autorización fiscal', value: '12' },
    { label: '13 — Factura física de no contribuyente', value: '13' },
    { label: '14 — Comprobante de Régimen Especial', value: '14' },
    { label: '15 — Recibo de pago', value: '15' },
    { label: '16 — Proveedor No Domiciliado (solo FEC)', value: '16' },
    { label: '99 — Otros', value: '99' },
  ];

  emisorActivityOptions = computed(() => {
    const settings = this.settingsResource.value() as any;
    const activities: any[] = settings?.emisorCompanyId?.contactId?.crEconomicActivityCodes ?? [];
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
    if (this.isAcceptanceType()) return false;
    const s = entry.crEinvoiceStatus;
    return !s || s === 'failed';
  });

  canPollStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || this.isAcceptanceType()) return false;
    const s = entry.crEinvoiceStatus;
    return s === 'sent' || s === 'received';
  });

  canCreateNote = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || this.isAcceptanceType()) return false;
    const s = entry.crEinvoiceStatus;
    return s === 'accepted' || s === 'rejected' || s === 'sent';
  });

  canSubmitAcceptance = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || !this.isAcceptanceType()) return false;
    const s = entry.crAcceptanceStatus;
    return !s || s === 'draft' || s === 'rejected';
  });

  canPollAcceptanceStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    if (!entry || !this.isAcceptanceType()) return false;
    const s = entry.crAcceptanceStatus;
    return s === 'sent';
  });

  crEinvoiceStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crEinvoiceStatus ?? null;
  });

  crAcceptanceStatus = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    return entry?.crAcceptanceStatus ?? null;
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

  crAcceptanceHaciendaResponseXml = computed(() => {
    const entry = this.host.invoiceResource.value() as any;
    const r = entry?.crAcceptanceHaciendaResponse;
    if (!r) return null;
    return r['respuesta-xml'] ?? r['xml_hacienda'] ?? null;
  });

  ngOnInit() {
    if (!this.hostForm.contains('crEinvoiceType')) {
      this.hostForm.addControl('crEinvoiceType', new FormControl('FE'));
    }
    if (!this.hostForm.contains('crCondicionVentaId')) {
      this.hostForm.addControl('crCondicionVentaId', new FormControl(null));
    }
    if (!this.hostForm.contains('crMedioPagoId')) {
      this.hostForm.addControl('crMedioPagoId', new FormControl(null));
    }
    if (!this.hostForm.contains('crPlazoCredito')) {
      this.hostForm.addControl('crPlazoCredito', new FormControl(null));
    }
    if (!this.hostForm.contains('crCodigoActividadEmisor')) {
      this.hostForm.addControl('crCodigoActividadEmisor', new FormControl(null));
    }
    if (!this.hostForm.contains('crCodigoActividadReceptor')) {
      this.hostForm.addControl('crCodigoActividadReceptor', new FormControl(null));
    }
    if (!this.hostForm.contains('crCondicionImpuesto')) {
      this.hostForm.addControl('crCondicionImpuesto', new FormControl(null));
    }
    if (!this.hostForm.contains('crMontoTotalImpuestoAcreditar')) {
      this.hostForm.addControl('crMontoTotalImpuestoAcreditar', new FormControl(null));
    }
    if (!this.hostForm.contains('crMontoTotalGastoAplicable')) {
      this.hostForm.addControl('crMontoTotalGastoAplicable', new FormControl(null));
    }
    if (!this.hostForm.contains('crDetalleMensaje')) {
      this.hostForm.addControl('crDetalleMensaje', new FormControl(''));
    }

    const typeCtrl = this.hostForm.get('crEinvoiceType')!;
    const crEinvoiceType = toSignal(typeCtrl.valueChanges, {
      initialValue: typeCtrl.value ?? 'FE',
      injector: this.injector,
    });
    this.isAcceptanceType = computed(() => {
      const t = crEinvoiceType() ?? '';
      return t === 'MA' || t === 'MAP' || t === 'MR';
    });
    this.isReferenceType = computed(() => {
      const t = crEinvoiceType() ?? '';
      return t === 'FEC' || t === 'NC' || t === 'ND';
    });

    const syncRefGroup = (type: string) => {
      const needed = type === 'FEC' || type === 'NC' || type === 'ND';
      if (needed && !this.hostForm.contains('crInformacionReferencia')) {
        this.hostForm.addControl('crInformacionReferencia', this.buildRefGroup());
      } else if (!needed && this.hostForm.contains('crInformacionReferencia')) {
        this.hostForm.removeControl('crInformacionReferencia');
      }
    };

    syncRefGroup(typeCtrl.value ?? '');
    typeCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe((val: string) => syncRefGroup(val ?? ''));

    const contactCtrl = this.hostForm.get('contactId');
    if (contactCtrl) {
      this.selectedContactId.set(contactCtrl.value ?? '');
      contactCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe((val: string) => this.selectedContactId.set(val ?? ''));
    }
  }

  ngOnDestroy() {
    const controls = [
      'crEinvoiceType', 'crCondicionVentaId', 'crMedioPagoId', 'crPlazoCredito',
      'crCodigoActividadEmisor', 'crCodigoActividadReceptor', 'crCondicionImpuesto',
      'crMontoTotalImpuestoAcreditar', 'crMontoTotalGastoAplicable', 'crDetalleMensaje',
      'crInformacionReferencia',
    ];
    for (const name of controls) {
      if (this.hostForm.contains(name)) {
        this.hostForm.removeControl(name);
      }
    }
  }

  constructor() {
    effect(() => {
      const entry = this.host.invoiceResource.value() as any;
      if (!entry) return;
      this.hostForm.patchValue({
        crEinvoiceType: entry.crEinvoiceType ?? 'FE',
        crCondicionVentaId:
          (entry.crCondicionVentaId as any)?._id ?? entry.crCondicionVentaId ?? null,
        crMedioPagoId: (entry.crMedioPagoId as any)?._id ?? entry.crMedioPagoId ?? null,
        crPlazoCredito: entry.crPlazoCredito ?? null,
        crCodigoActividadEmisor: entry.crCodigoActividadEmisor ?? null,
        crCodigoActividadReceptor: entry.crCodigoActividadReceptor ?? null,
        crCondicionImpuesto: entry.crCondicionImpuesto ?? null,
        crMontoTotalImpuestoAcreditar: entry.crMontoTotalImpuestoAcreditar ?? null,
        crMontoTotalGastoAplicable: entry.crMontoTotalGastoAplicable ?? null,
        crDetalleMensaje: entry.crDetalleMensaje ?? '',
      });
      if (this.hostForm.contains('crInformacionReferencia')) {
        this.hostForm.patchValue({
          crInformacionReferencia: {
            tipoDocIR:            entry.crInformacionReferencia?.tipoDocIR ?? '',
            tipoDocRefOTRO:       entry.crInformacionReferencia?.tipoDocRefOTRO ?? '',
            numero:               entry.crInformacionReferencia?.numero ?? '',
            fechaEmisionIR:       entry.crInformacionReferencia?.fechaEmisionIR
                                    ? new Date(entry.crInformacionReferencia.fechaEmisionIR)
                                    : null,
            codigo:               entry.crInformacionReferencia?.codigo ?? '',
            codigoReferenciaOTRO: entry.crInformacionReferencia?.codigoReferenciaOTRO ?? '',
            razon:                entry.crInformacionReferencia?.razon ?? '',
          },
        });
      }
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
          const detail = err?.error?.message ?? err?.message ?? 'Failed to check e-invoice status.';
          this.toastManager.showError(detail);
        },
      });
  }

  submitAcceptance() {
    if (this.isSubmittingAcceptance()) return;
    this.isSubmittingAcceptance.set(true);
    this.crudCrEinvoice
      .submitAcceptance(this.host.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmittingAcceptance.set(false);
          this.host.invoiceResource.reload();
          this.toastManager.showSuccess('Mensaje receptor enviado a Hacienda exitosamente.');
        },
        error: (err: any) => {
          this.isSubmittingAcceptance.set(false);
          this.host.invoiceResource.reload();
          const detail =
            err?.error?.message ?? err?.message ?? 'Error enviando mensaje receptor.';
          this.toastManager.showError(detail);
        },
      });
  }

  pollAcceptanceStatus() {
    if (this.isPollingAcceptance()) return;
    this.isPollingAcceptance.set(true);
    this.crudCrEinvoice
      .pollAcceptanceStatus(this.host.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isPollingAcceptance.set(false);
          this.host.invoiceResource.reload();
          this.toastManager.showSuccess('Estado de aceptación actualizado.');
        },
        error: (err: any) => {
          this.isPollingAcceptance.set(false);
          const detail = err?.error?.message ?? err?.message ?? 'Error verificando estado de aceptación.';
          this.toastManager.showError(detail);
        },
      });
  }

  openNoteDialog(type: 'NC' | 'ND') {
    this.pendingNoteType.set(type);
    this.noteForm.reset({ codigo: '01', codigoReferenciaOTRO: '', razon: '' });
    this.noteDialogVisible = true;
  }

  confirmCreateNote() {
    if (this.isCreatingNote()) return;
    const { codigo, codigoReferenciaOTRO, razon } = this.noteForm.value;
    if (!razon?.trim()) {
      this.toastManager.showError('Por favor ingrese una razón para la nota.');
      return;
    }
    this.isCreatingNote.set(true);
    this.crudInvoices
      .createNote(this.host.id(), {
        noteType: this.pendingNoteType(),
        codigo: codigo ?? '01',
        ...(codigoReferenciaOTRO?.trim()
          ? { codigoReferenciaOTRO: codigoReferenciaOTRO.trim() }
          : {}),
        razon: razon.trim(),
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (newInvoice: any) => {
          this.isCreatingNote.set(false);
          this.noteDialogVisible = false;
          this.toastManager.showSuccess('Nota creada exitosamente. Redirigiendo...');
          this.router.navigate(['/accounting/invoices/edit', newInvoice._id]);
        },
        error: (err: any) => {
          this.isCreatingNote.set(false);
          const detail = err?.error?.message ?? err?.message ?? 'Error creando la nota.';
          this.toastManager.showError(detail);
        },
      });
  }
}
