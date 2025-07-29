import { inject, Injectable } from '@angular/core';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class PlainObjectFormBuilder {
  private fb = inject(NonNullableFormBuilder);

  createControlTemplate<T>(data: T): FormGroup | FormControl | FormArray {
    if (typeof data === 'object') {
      if (Array.isArray(data)) {
        return this.fb.array(data.map(el => this.createControlTemplate(el)));
      } else {
        const groupKeys: any = {};
        for (const key in data) {
          groupKeys[key as any] = this.createControlTemplate(data[key]);
        }

        return this.fb.group(groupKeys);
      }
    } else {
      return this.fb.control(data);
    }
  }
}
