import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for creating/editing an order maintenance type */
export interface OrderMaintenanceFormModel {
  _id: string;
  name: string;
  color: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for order maintenance type create/edit */
@Injectable({ providedIn: 'root' })
export class OrderMaintenanceForm extends BaseForm<OrderMaintenanceFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<OrderMaintenanceFormModel>({
      _id: [''],
      name: [''],
      color: [''],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
