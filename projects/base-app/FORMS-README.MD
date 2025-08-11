# Form Architecture Guidelines

This document defines the standards and implementation patterns for building forms in applications that use the `@avalantec/base-app` library. All consuming applications **must** adhere to these guidelines.

---

## 1. Overview

Forms in `@avalantec/base-app/form` are built using a consistent architecture based on:

- A generic form layout structure.
- Standalone Angular components.
- Angular Signals (`signal`, `computed`, `effect`, `input`, `output`, `viewChild`, etc).
- A form service pattern based on `BaseForm<T>` and `TypedFormBuilder`.
- A set of shared components, directives, and helpers imported via `AppFormExtensionsImports`.

### Importing

```ts
import { AppFormExtensionsImports } from '@avalantec/base-app/forms';
```

Do **not** import from internal paths.

---

## 2. Shared Form Components

Import the full set of visual components for form rendering from `@avalantec/base-app/form`:

```ts
export const AppFormExtensionsImports = [
  FormLayoutComponent,
  FormNavigatorComponent,
  FormSectionComponent,
  FormErrorComponent,
  FormFieldComponent,
  FormLabelComponent,
  HintComponent,
  FormControlExtensionDirective,
  TranslatedErrorsDirective,
  FormActionsComponent,
  FormActionsHandlerDirective,
];
```

### Component Descriptions

- **FormLayoutComponent**: A generic wrapper for any form.
- **FormNavigatorComponent**: Displays a section-based navigator (automatically included in layout).
- **FormSectionComponent**: Defines a semantic form section.
- **FormFieldComponent**: Wraps a control, must contain a field with `formControlName`, `formControl`, or similar.
- **FormLabelComponent**: Label for a form field. Supports a `tooltip` input.
- **FormErrorComponent**: Displays errors associated with the field.
- **HintComponent**: Renders helper hint text.
- **FormControlExtensionDirective**: For extending behavior in controls.
- **TranslatedErrorsDirective**: For translating error messages (i18n).
- **FormActionsComponent**: Contains Submit / Cancel buttons (already included in layout).
- **FormActionsHandlerDirective**: Directive that handles submit behavior with additional logic.

---

## 3. Base Form Service Pattern

### Structure

Each form is powered by a strongly-typed service that extends `BaseForm<TModel>`.

```ts
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

/** Example Form Service that uses the BaseForm */
@Injectable()
class ExampleForm extends BaseForm<ExampleFormModel> {
  override createForm() {
    // This uses an underlying custom form group build
    return this.fb.group<ExampleFormModel>({
      name: ['', [Validators.required]],
      exampleNullableField: [null],
      age: [null!], // We use null! to start with a null value (instead of showing a 0)
      exampleNestedForm: {
        name: [''],
        age: [null!], // We use null! to start with a null value (instead of showing a 0)
      },
      productIds: [],
      productArray: {
        // Template is used for automatically creating new controls with a template and validators
        template: {
          id: [''],
          name: [null!],
        },
        // Initial value elements that match the model type
        formArrayElements: [],
      },
    });
  }
}
```

### Signals Exposed

- `value`: Signal representing current value (all optional because only enabled controls are included) (less used).
- `rawValue`: Includes disabled controls. Useful for create actions.
- `dirtyValue`: Changed values only. Ideal for update operations.
- `lastValidRawValue`: Useful for rollback or debugging.

### Helpers

- `patchValue()`
- `reset()`
- `hasUnsavedChanges()`
- `getValueState()`: Returns an object containing form's value, dirtyValue and rawValue

---

## 4. Form Layout Example

The app-form-layout and app-form-section are not mandatory, they depend on the form layout to use.

```ts
@Component({
  selector: 'app-test-form',
  imports: [ReactiveFormsModule, AppFormExtensionsImports],
  template: `
    <app-form-layout title="Example form">
      <form
        [formGroup]="form"
        bifiAppFormActionsHandler
        (appSubmit)="handleSubmit.emit()"
        class="flex flex-col gap-3 md:gap-6 lg:gap-10 md:mr-6"
      >
        <app-form-section title="General information" id="form-general" [ordinal]="1">
          <section class="max-w-xl grid gap-3 sm:grid-cols-2">
            <!-- Name field -->
            <app-form-field>
              <app-form-label>Name</app-form-label>
              <input pInputText formControlName="name" type="text" placeholder="Example name" />
              <app-form-error></app-form-error>
            </app-form-field>
          </section>
        </app-form-section>
      </form>
    </app-form-layout>
  `,
})
export class ExampleForm {
  handleSubmit = output<FormValueState<ExampleFormModel>>();
}
```

---

## 5. Submit Handling

Submit handling is always done from the smart component via `(appSubmit)`:

```ts
handleSubmit(state: FormValueState<ExampleFormModel>) {
  const raw = state.rawValue; // for create
  const changes = state.dirtyValue; // for update
}
```

The smart component should listen to the dumb component event and execute backend logic.

---
