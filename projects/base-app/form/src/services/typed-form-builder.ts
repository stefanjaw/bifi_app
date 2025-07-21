import { inject, Injectable } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { FormGroupLike, InputControls, ControlsOf } from '../interfaces';
import { BaseForm } from '../libraries';

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

/** Example form model */
interface ExampleFormModel {
  name: string;
  exampleNullableField: string | null;
  age: number;
  exampleNestedForm: {
    name: string;
    age: number;
  };
  productIds: number[];
  productArray: {
    id: number;
    name: string;
  }[];
}

/** Inject the TypedFormBuilder */
const typedFb = inject(TypedFormBuilder);

/** Example on how to create a typed form */
const testForm = typedFb.group<ExampleFormModel>({
  name: ['', [Validators.required]],
  exampleNullableField: [null],
  age: [0],
  exampleNestedForm: {
    name: [''],
    age: [0],
  },
  productIds: [],
  productArray: [
    {
      id: 0,
      name: '',
    },
  ],
});

/** Example Form Service that uses the BaseForm */
@Injectable()
class ExampleForm extends BaseForm<ExampleFormModel> {
  override createForm() {
    return this.fb.group<ExampleFormModel>({
      name: ['', [Validators.required]],
      exampleNullableField: [null],
      age: [null!], // We use null! to start with a null value (instead of showing a 0)
      exampleNestedForm: {
        name: [''],
        age: [null!], // We use null! to start with a null value (instead of showing a 0)
      },
      productIds: [],
      productArray: [
        {
          id: 0,
          name: '',
        },
      ],
    });
  }
}
