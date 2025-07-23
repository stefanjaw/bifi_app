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
    const payload = this.parseFormInput(data);
    // TODO handle form arrays!
    console.log('form group built payload', payload);
    return this.fb.group<ControlsOf<T>>(payload);
  }

  private parseFormInput(data: any) {
    if (typeof data === 'object') {
      const clone: any = {};

      for (const key in data) {
        if (Array.isArray(data[key])) {
          clone[key] = data[key];
        } else if (typeof data[key] === 'object') {
          console.log('key is object', key);
          const payload = this.parseFormInput(data[key]);
          console.log('payload', payload);
          clone[key] = this.fb.group(payload);
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
