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

  /**
   * Imports received electronic invoices from uploaded XML files
   * @param formData - FormData containing uploaded XML invoice files
   * @returns Observable of the import result
   */
  importReceived(formData: FormData): Observable<any> {
    return this._httpClient.post<any>(`${this._apiURL}/cr-einvoice/import-received`, formData);
  }

  /**
   * Submits an acceptance (aceptación) to Hacienda for a received invoice
   * @param invoiceId - The invoice ID to accept
   * @returns Observable of the acceptance submission result
   */
  submitAcceptance(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/submit-acceptance`,
      {}
    );
  }

  /**
   * Polls Hacienda for the acceptance status of a submitted invoice
   * @param invoiceId - The invoice ID to poll acceptance status for
   * @returns Observable of the acceptance polling result
   */
  pollAcceptanceStatus(invoiceId: string): Observable<any> {
    return this._httpClient.get<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/poll-acceptance-status`
    );
  }

  /**
   * Submits an electronic invoice to Hacienda for digital signing
   * @param invoiceId - The invoice ID to submit
   * @returns Observable of the submission result
   */
  submitEinvoice(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/submit-einvoice`,
      {}
    );
  }

  /**
   * Polls Hacienda for the electronic invoice signing status
   * @param invoiceId - The invoice ID to poll signing status for
   * @returns Observable of the signing polling result
   */
  pollEinvoiceStatus(invoiceId: string): Observable<any> {
    return this._httpClient.post<any>(
      `${this._apiURL}/cr-einvoice/${invoiceId}/poll-einvoice-status`,
      {}
    );
  }

  /**
   * Creates a credit note (NC) or debit note (ND) for an invoice
   * @param invoiceId - The invoice ID to create the note for
   * @param data - Note data including noteType, codigo, optional codigoReferenciaOTRO, and razon
   * @returns Observable of the created note
   */
  createNote(
    invoiceId: string,
    data: { noteType: 'NC' | 'ND'; codigo: string; codigoReferenciaOTRO?: string; razon: string }
  ): Observable<any> {
    return this._httpClient.post<any>(`${this._apiURL}/cr-einvoice/${invoiceId}/create-note`, data);
  }
}
