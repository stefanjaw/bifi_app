import { effect, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ContactFormModel {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  parentId?: string;
  type: 'individual' | 'company';
  childIds?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ContactForm extends BaseForm<ContactFormModel> {
  type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  constructor() {
    super();

    effect(() => {
      const type = this.type();

      if (type === 'company') {
        this.form.controls.lastName.setValue('', { emitEvent: false });
        this.form.controls.lastName.disable({ emitEvent: false });
      } else {
        this.form.controls.lastName.enable({ emitEvent: false });
      }
    });
  }

  override createForm() {
    return this.fb.group<ContactFormModel>({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      parentId: [''],
      type: ['individual', [Validators.required]],
      childIds: {
        template: [''],
        formArrayElements: [],
      },
    });
  }
}
