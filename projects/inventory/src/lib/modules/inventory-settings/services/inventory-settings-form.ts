import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface InventorySettingsFormModel {
  defaultWarehouseId: string | null;
  defaultLocationId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class InventorySettingsForm extends BaseForm<InventorySettingsFormModel> {
  override createForm() {
    return this.fb.group<InventorySettingsFormModel>({
      defaultWarehouseId: [null],
      defaultLocationId: [null],
    });
  }
}
