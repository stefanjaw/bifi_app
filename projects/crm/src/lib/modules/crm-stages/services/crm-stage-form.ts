import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface CrmStageFormModel {
  name: string;
  description: string;
  color: string;
  order: number;
  probability: number;
  isWon: boolean;
  isLost: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CrmStageForm extends BaseForm<CrmStageFormModel> {
  override createForm() {
    return this.fb.group<CrmStageFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      color: ['#6366f1'],
      order: [0],
      probability: [0, [Validators.min(0), Validators.max(100)]],
      isWon: [false],
      isLost: [false],
    });
  }
}
