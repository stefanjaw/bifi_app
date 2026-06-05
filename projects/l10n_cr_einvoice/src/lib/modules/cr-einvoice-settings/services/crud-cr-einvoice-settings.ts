import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable, catchError, of } from 'rxjs';

export interface crEinvoiceSettings {
  proveedorSistemas?: string;
  haciendaUsername?: string;
  haciendaPassword?: string;
  certificateBase64?: string;
  certificatePassword?: string;
  haciendaEnvironment?: 'production' | 'sandbox';
  codigoEstablecimiento?: string;
  codigoPuntoVenta?: string;
  feVersion?: string;
  emisorCompanyId?: string;
}

@Injectable({ providedIn: 'root' })
export class CrudCrEinvoiceSettings extends ApiRequestManager<crEinvoiceSettings> {
  constructor() {
    super();
    super.endpoint = 'cr-einvoice/settings';
  }

  getSettings() {
    return rxResource<crEinvoiceSettings, void>({
      stream: () =>
        this._httpClient.get<crEinvoiceSettings>(`${this._apiURL}/${this.endpoint}`).pipe(
          catchError(() => of({} as crEinvoiceSettings))
        ),
    });
  }

  putSettings(data: Record<string, any>): Observable<crEinvoiceSettings | undefined> {
    return this._httpClient.put<crEinvoiceSettings>(`${this._apiURL}/${this.endpoint}`, data);
  }
}
