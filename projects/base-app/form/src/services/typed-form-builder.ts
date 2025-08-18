/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { inject, Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormGroup,
  NonNullableFormBuilder,
  ValidatorFn,
} from '@angular/forms';
import { FormGroupLike } from '../interfaces/form-helpers';
import {
  InputControls,
  ControlsOf,
  IFArray,
  PermissiveControlConfig,
  GroupReturn,
} from '../interfaces/typed-form-builder';
import { TypedFormArrayExtension } from '../libraries/extensions/extended-form-array';

@Injectable({
  providedIn: 'root',
})
export class TypedFormBuilder {
  private fb = inject(NonNullableFormBuilder);

  group<T extends FormGroupLike>(
    data: InputControls<T>,
    options?: {
      validators?: ValidatorFn | ValidatorFn[];
      asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
    }
  ): GroupReturn<T> {
    const group = this.buildFormTree(data) as FormGroup<ControlsOf<T, true>>;

    if (options?.validators) {
      group.setValidators(options.validators);
    }
    if (options?.asyncValidators) {
      group.setAsyncValidators(options.asyncValidators);
    }

    return group;
  }

  control<T>(value: PermissiveControlConfig<T>) {
    return this.fb.control(value);
  }

  /**
   * Recursively builds a form tree from the given data object.
   *
   * This function handles the following cases:
   * - If data is an array, it is assumed to be a control with a value and validators.
   * - If data is an object, it is assumed to be a form group, and each key will be processed recursively.
   * - If data is a form array input, it is processed using the `formArrayElements` property.
   * - If data is a primitive value, a form control is created with the given value.
   *
   * @param data - The data object to build the form tree from.
   * @returns - The built form tree.
   */
  private buildFormTree(data: any): any {
    if (Array.isArray(data)) {
      // [value, validators]
      return data;
    }

    if (typeof data === 'object' && data !== null) {
      if (this.isFormArrayInput(data)) {
        // Create an extended form array
        const formArray = new TypedFormArrayExtension<any>([]);

        // Set the control template
        formArray.controlTemplate = () => this.buildFormTree(data.template);

        // Patch the array value to generate the required controls
        formArray.patchValue(data.formArrayElements);

        return formArray;
      }

      // Regular FormGroup: recurse each key
      const group: Record<string, AbstractControl> = {};
      for (const key in data) {
        group[key] = this.buildFormTree(data[key]);
      }

      return this.fb.group(group);
    }

    // Primitive fallback
    return this.fb.control(data);
  }

  isFormArrayInput(data: any): data is IFArray<any> {
    return (
      typeof data === 'object' &&
      'formArrayElements' in data &&
      Array.isArray(data.formArrayElements)
    );
  }
}

type TestObject = {
  name: string | null;
  age: number;
};

type TestFormModel = {
  string: string | null;
  arrayNumber: number[];
  arrayObject: TestObject[];
  singleObject: TestObject;
};

type InputTest = InputControls<TestFormModel>;
type FormTest = ControlsOf<TestFormModel, true>;

// const testBuilder = new TypedFormBuilder();
// const form = testBuilder.group<TestFormModel>({
//   string: [''],
//   arrayNumber: {
//     template: [],
//     formArrayElements: [],
//   },
//   arrayObject: {
//     template: {
//       name: [''],
//       age: [0],
//     },
//     formArrayElements: [],
//   },
//   singleObject: {
//     name: [''],
//     age: [0],
//   },
// });
