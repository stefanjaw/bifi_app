import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SearchDestinationFormModel {
  key: string;
  label: string;
  route: string;
  group: string;
  icon: string;
  description: string;
  resource: string;
  keywordsInput: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class SearchDestinationForm extends BaseForm<SearchDestinationFormModel> {
  override createForm() {
    return this.fb.group<SearchDestinationFormModel>({
      key: ['', [Validators.required]],
      label: ['', [Validators.required]],
      route: ['', [Validators.required]],
      group: [''],
      icon: [''],
      description: [''],
      resource: [''],
      keywordsInput: [''],
      active: [true],
    });
  }
}
