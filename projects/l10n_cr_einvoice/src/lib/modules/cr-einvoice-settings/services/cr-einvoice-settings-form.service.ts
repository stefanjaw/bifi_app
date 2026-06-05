import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CrEinvoiceSettingsFormModel {
  proveedorSistemas: string;
  haciendaUsername: string;
  haciendaPassword: string;
  certificateBase64: string;
  certificatePassword: string;
  haciendaEnvironment: string;
  codigoEstablecimiento: string;
  codigoPuntoVenta: string;
  feVersion: string;
  emisorCompanyId: string;
}

@Injectable({ providedIn: 'root' })
export class CrEinvoiceSettingsFormService extends BaseForm<CrEinvoiceSettingsFormModel> {
  override createForm() {
    return this.fb.group<CrEinvoiceSettingsFormModel>({
      proveedorSistemas: ['', [Validators.required]],
      haciendaUsername: ['', [Validators.required]],
      haciendaPassword: ['', [Validators.required]],
      certificateBase64: ['', [Validators.required]],
      certificatePassword: ['', [Validators.required]],
      haciendaEnvironment: ['sandbox', [Validators.required]],
      codigoEstablecimiento: ['001', [Validators.required]],
      codigoPuntoVenta: ['00001', [Validators.required]],
      feVersion: ['4.4', [Validators.required]],
      emisorCompanyId: ['', [Validators.required]],
    });
  }
}
