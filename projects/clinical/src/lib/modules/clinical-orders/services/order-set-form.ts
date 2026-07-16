import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for creating/editing an order set */
export interface OrderSetFormModel {
  _id: string;
  careContinuumId: string;
  patientId: string;
  byName: string;
  type: string;
  priority: string;
  state: string;
  orders: string[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for order set create/edit */
@Injectable({ providedIn: 'root' })
export class OrderSetForm extends BaseForm<OrderSetFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<OrderSetFormModel>({
      _id: [''],
      careContinuumId: [''],
      patientId: [''],
      byName: [''],
      type: [''],
      priority: ['Routine'],
      state: [''],
      orders: { template: [''], formArrayElements: [] },
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
