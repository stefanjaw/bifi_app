import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface crEinvoiceSettingsFormModel {
  proveedorSistemas: string;
  haciendaUsername: string;
  haciendaPassword: string;
  certificateFile: FormUploaderFile[];
  certificatePassword: string;
  haciendaEnvironment: string;
  codigoEstablecimiento: string;
  codigoPuntoVenta: string;
  feVersion: string;
  emisorCompanyId: string;
}

@Injectable({ providedIn: 'root' })
export class CrEinvoiceSettingsFormService extends BaseForm<crEinvoiceSettingsFormModel> {
  override createForm() {
    return this.fb.group<crEinvoiceSettingsFormModel>({
      proveedorSistemas: ['', [Validators.required]],
      haciendaUsername: ['', [Validators.required]],
      haciendaPassword: ['', [Validators.required]],
      certificateFile: {
        template: {
          id: [undefined],
          file: [null!],
        },
        formArrayElements: [],
      },
      certificatePassword: ['', [Validators.required]],
      haciendaEnvironment: ['sandbox', [Validators.required]],
      codigoEstablecimiento: ['001', [Validators.required]],
      codigoPuntoVenta: ['00001', [Validators.required]],
      feVersion: ['4.4', [Validators.required]],
      emisorCompanyId: ['', [Validators.required]],
    });
  }
}
