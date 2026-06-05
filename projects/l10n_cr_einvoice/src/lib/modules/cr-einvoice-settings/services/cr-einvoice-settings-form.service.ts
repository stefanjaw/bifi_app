import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface CrEinvoiceSettingsFormModel {
  proveedorSistemas: string;
  haciendaUsername: string;
  haciendaPassword: string;
  certificateBase64: string;
  economicActivityCode: string;
  haciendaEnvironment: string;
  codigoEstablecimiento: string;
  codigoPuntoVenta: string;
}

@Injectable({ providedIn: 'root' })
export class CrEinvoiceSettingsFormService extends BaseForm<CrEinvoiceSettingsFormModel> {
  override createForm() {
    return this.fb.group<CrEinvoiceSettingsFormModel>({
      proveedorSistemas: [''],
      haciendaUsername: [''],
      haciendaPassword: [''],
      certificateBase64: [''],
      economicActivityCode: [''],
      haciendaEnvironment: ['sandbox'],
      codigoEstablecimiento: ['001'],
      codigoPuntoVenta: ['00001'],
    });
  }
}
