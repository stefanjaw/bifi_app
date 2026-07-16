import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** An individual result item within an order */
export interface orderResultItem {
  description: string;
}

/** Form model for creating/editing a clinical order */
export interface OrderFormModel {
  _id: string;
  orderSetId: string;
  patientId: string;
  subType: string;
  type: string;
  status: string;
  title: string;
  interventionId: string;
  priority: string;
  results: orderResultItem[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for clinical order create/edit */
@Injectable({ providedIn: 'root' })
export class OrderForm extends BaseForm<OrderFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<OrderFormModel>({
      _id: [''],
      orderSetId: [''],
      patientId: [''],
      subType: [''],
      type: [''],
      status: [''],
      title: [''],
      interventionId: [''],
      priority: [''],
      results: {
        template: {
          description: [''],
        },
        formArrayElements: [],
      },
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
