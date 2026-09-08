import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface InventorySettingsFormModel {
  defaultWarehouseId: string | null;
  defaultLocationId: string | null;
  /** Inventory costing method used for valuation (WEIGHTED_AVERAGE in this release; FIFO reserved) */
  valuationMethod: 'WEIGHTED_AVERAGE' | 'FIFO';
}

@Injectable({
  providedIn: 'root',
})
export class InventorySettingsForm extends BaseForm<InventorySettingsFormModel> {
  override createForm() {
    return this.fb.group<InventorySettingsFormModel>({
      defaultWarehouseId: [null],
      defaultLocationId: [null],
      valuationMethod: ['WEIGHTED_AVERAGE'],
    });
  }
}
