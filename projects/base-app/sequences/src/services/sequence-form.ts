import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SequenceFormModel {
  name: string;
  prefix: string;
  suffix: string;
  number: number;
  step: number;
  size: number;
  nogap: boolean;
  active: boolean;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class SequenceForm extends BaseForm<SequenceFormModel> {
  override createForm() {
    return this.fb.group<SequenceFormModel>({
      name: ['', [Validators.required]],
      prefix: ['', [Validators.required]],
      suffix: [''],
      number: [1, [Validators.required, Validators.min(0)]],
      step: [1, [Validators.required, Validators.min(1)]],
      size: [6, [Validators.required, Validators.min(1)]],
      nogap: [false],
      active: [true],
      description: [''],
    });
  }
}
