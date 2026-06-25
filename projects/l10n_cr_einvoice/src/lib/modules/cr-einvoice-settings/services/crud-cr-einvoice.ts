import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudCrEinvoice extends ApiRequestManager<any> {
  constructor() {
    super();
    this.endpoint = 'cr-einvoice';
  }

  importReceived(formData: FormData): Observable<any> {
    return this._httpClient.post<any>(`${this._apiURL}/cr-einvoice/import-received`, formData);
  }

  submitAcceptance(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/submit-acceptance`,
      {}
    );
  }

  pollAcceptanceStatus(invoiceId: string): Observable<any> {
    return this._httpClient.get<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/poll-acceptance-status`
    );
  }

  submitEinvoice(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/submit-einvoice`,
      {}
    );
  }

  pollEinvoiceStatus(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/poll-einvoice-status`,
      {}
    );
  }

  createNote(
    invoiceId: string,
    data: { noteType: 'NC' | 'ND'; codigo: string; codigoReferenciaOTRO?: string; razon: string }
  ): Observable<any> {
    return this._httpClient.post<any>(`${this._apiURL}/cr-einvoice/${invoiceId}/create-note`, data);
  }
}
