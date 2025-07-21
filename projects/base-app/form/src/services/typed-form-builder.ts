import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { FormGroupLike } from '../interfaces/form-helpers';
import { InputControls, ControlsOf } from '../interfaces/typed-form-builder';

@Injectable({
  providedIn: 'root',
})
export class TypedFormBuilder {
  private fb = inject(NonNullableFormBuilder);

  group<T extends FormGroupLike>(data: InputControls<T>) {
    return this.fb.group<ControlsOf<T>>(this.parseFormInput(data));
  }

  private parseFormInput(data: any) {
    if (typeof data === 'object') {
      const clone: any = {};

      for (const key in data) {
        if (typeof data[key] === 'object') {
          clone[key] = this.parseFormInput(data[key]);
        } else {
          clone[key] = data[key];
        }
      }

      return clone;
    } else {
      return data;
    }
  }
}
