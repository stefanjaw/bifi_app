import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastManager } from '@avalantec/base-app/core';
import { CrudCrEinvoice } from '../../modules/cr-einvoice-settings/services/crud-cr-einvoice';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-l10n-invoice-import-plugin',
  standalone: true,
  imports: [ButtonModule, DialogModule, CommonModule],
  template: `
    <p-button
      label="Import Received Invoice"
      icon="pi pi-upload"
      severity="secondary"
      (onClick)="dialogVisible = true"
    ></p-button>

    <p-dialog
      header="Import Received Invoice (Factura Recibida)"
      [(visible)]="dialogVisible"
      [modal]="true"
      [style]="{ width: '500px' }"
      [closable]="!isImporting()"
    >
      <div class="flex flex-col gap-4 pt-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            XML Firmado <span class="text-red-500">*</span>
          </label>
          <p class="text-xs text-gray-500 mb-2">El archivo XML de la factura firmado electrónicamente.</p>
          <input
            type="file"
            accept=".xml"
            (change)="onFirmadoXmlChange($event)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          @if (firmadoXmlFile()) {
            <p class="text-xs text-green-600 mt-1">✓ {{ firmadoXmlFile()!.name }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            XML Hacienda (opcional)
          </label>
          <p class="text-xs text-gray-500 mb-2">El XML de respuesta de Hacienda, si disponible.</p>
          <input
            type="file"
            accept=".xml"
            (change)="onHaciendaXmlChange($event)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          @if (haciendaXmlFile()) {
            <p class="text-xs text-green-600 mt-1">✓ {{ haciendaXmlFile()!.name }}</p>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            PDF (opcional)
          </label>
          <p class="text-xs text-gray-500 mb-2">El PDF de la factura para referencia.</p>
          <input
            type="file"
            accept=".pdf"
            (change)="onPdfChange($event)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          @if (pdfFile()) {
            <p class="text-xs text-green-600 mt-1">✓ {{ pdfFile()!.name }}</p>
          }
        </div>
      </div>

      <ng-template pTemplate="footer">
        <p-button
          label="Cancelar"
          severity="secondary"
          [disabled]="isImporting()"
          (onClick)="closeDialog()"
        ></p-button>
        <p-button
          label="Importar"
          icon="pi pi-upload"
          [loading]="isImporting()"
          [disabled]="!firmadoXmlFile()"
          (onClick)="importInvoice()"
        ></p-button>
      </ng-template>
    </p-dialog>
  `,
})
export class InvoiceImportPluginComponent {
  private crudCrEinvoice = inject(CrudCrEinvoice);
  private destroy$ = inject(DestroyRef);
  private toastManager = inject(ToastManager);
  private router = inject(Router);

  dialogVisible = false;
  isImporting = signal(false);
  firmadoXmlFile = signal<File | null>(null);
  haciendaXmlFile = signal<File | null>(null);
  pdfFile = signal<File | null>(null);

  onFirmadoXmlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.firmadoXmlFile.set(input.files?.[0] ?? null);
  }

  onHaciendaXmlChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.haciendaXmlFile.set(input.files?.[0] ?? null);
  }

  onPdfChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.pdfFile.set(input.files?.[0] ?? null);
  }

  closeDialog() {
    this.dialogVisible = false;
    this.firmadoXmlFile.set(null);
    this.haciendaXmlFile.set(null);
    this.pdfFile.set(null);
  }

  importInvoice() {
    const xmlFile = this.firmadoXmlFile();
    if (!xmlFile) {
      this.toastManager.showError('El archivo XML firmado es obligatorio.');
      return;
    }
    if (this.isImporting()) return;

    const formData = new FormData();
    formData.append('firmadoXml', xmlFile);
    const haciendaXml = this.haciendaXmlFile();
    if (haciendaXml) formData.append('haciendaXml', haciendaXml);
    const pdf = this.pdfFile();
    if (pdf) formData.append('pdf', pdf);

    this.isImporting.set(true);
    this.crudCrEinvoice
      .importReceived(formData)
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.isImporting.set(false);
          this.closeDialog();
          const id = res?._id ?? res?.data?._id;
          this.toastManager.showSuccess('Factura importada exitosamente. Redirigiendo...');
          if (id) {
            this.router.navigate(['/accounting/invoices/edit', id]);
          }
        },
        error: (err: any) => {
          this.isImporting.set(false);
          const detail = err?.error?.message ?? err?.message ?? 'Error al importar la factura.';
          this.toastManager.showError(detail);
        },
      });
  }
}
