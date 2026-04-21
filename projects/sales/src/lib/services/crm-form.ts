import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CrmFormModel {
  title: string;
  amount: number;
  currency: string;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  contact: string;
  company: string;
  owner: string;
  salesperson: string;
  tagsInput: string;
  description: string;
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class CrmForm extends BaseForm<CrmFormModel> {
  override createForm() {
    return this.fb.group<CrmFormModel>({
      title: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(0)]],
      currency: [''],
      stage: [''],
      probability: [10, [Validators.min(0), Validators.max(100), Validators.required]],
      expectedCloseDate: [''],
      contact: ['', [Validators.required]],
      company: [''],
      owner: [''],
      salesperson: [''],
      tagsInput: [''],
      description: [''],
      notes: [''],
    });
  }
}
