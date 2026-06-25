import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { assetRoster } from '../interfaces/asset-roster';
import { Observable } from 'rxjs';
import { FormUploaderFile } from '@avalantec/base-app/form';

@Injectable({
  providedIn: 'root',
})
export class CrudAssetRoster extends ApiRequestManager<assetRoster> {
  constructor() {
    super();
    super.endpoint = 'asset-rosters';
  }

  /**
   * Sends documents and an optional AI question for document analysis
   * @param files - The document files to analyze
   * @param question - Optional AI question to ask about the documents
   * @returns Observable of the document analysis result
   */
  readDocuments(files: FormUploaderFile[], question?: string): Observable<any> {
    return this.post({
      data: {
        attachments: files,
        question,
      },
      specificEndpoint: 'read-documents',
      fileFields: ['attachments'],
    }) as any;
  }
}
