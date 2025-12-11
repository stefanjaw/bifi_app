import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface AssetTypeFormModel {
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssetTypeForm extends BaseForm<AssetTypeFormModel> {
  override createForm() {
    return this.fb.group<AssetTypeFormModel>({
      name: ['', [Validators.required]],
      description: [''],
    });
  }
}
