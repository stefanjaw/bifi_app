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
