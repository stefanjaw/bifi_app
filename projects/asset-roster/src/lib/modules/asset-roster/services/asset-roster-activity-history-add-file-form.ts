import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface AssetRosterActivityHistoryAddFileFormModel {
  file: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class AssetRosterActivityHistoryAddFileForm extends BaseForm<AssetRosterActivityHistoryAddFileFormModel> {
  override createForm() {
    return this.fb.group<AssetRosterActivityHistoryAddFileFormModel>({
      file: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }
}
