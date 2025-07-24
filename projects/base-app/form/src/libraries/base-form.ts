import { inject, signal } from '@angular/core';
import { FormGroup, ValueChangeEvent } from '@angular/forms';
import {
  FormGroupLike,
  FormValueState,
  FormModelValue,
  FormModelRawValue,
} from '../interfaces/form-helpers';
import { ControlsOf } from '../interfaces/typed-form-builder';
import { getFormGroupDirtyValue } from './dirty-utils';
import { TypedFormBuilder } from '../services/typed-form-builder';

/**
 * Abstract class representing a base form structure with reactive value handling.
 * This class is designed to be extended by concrete form classes that define a specific form structure.
 *
 * @template TModel - A type extending FormGroupLike, representing the form's model structure.
 */
export abstract class BaseForm<TModel extends FormGroupLike> {
  /**
   * TypedFormBuilder instance for creating form groups with typed controls.
   */
  protected fb = inject(TypedFormBuilder);

  /**
   * The Angular FormGroup instance representing the form.
   * It is initialized by the concrete implementation of createForm().
   */
  form: FormGroup<ControlsOf<TModel>> = this.createForm();

  /**
   * Signal holding the current value of the form, typed as FormValue.
   */
  value = signal<FormModelValue<TModel>>(this.form.value);

  /**
   * Signal holding the raw value of the form, including disabled controls.
   */
  rawValue = signal<FormModelRawValue<TModel>>(this.raw);

  /**
   * Signal holding the last valid raw value of the form.
   * Updated whenever the form is valid.
   */
  lastValidRawValue = signal<FormModelRawValue<TModel>>(this.raw);

  /**
   * Signal holding the dirty value of the form, typed as FormValue.
   * The dirty value represents the value of the form including only the controls the user has modified
   */
  dirtyValue = signal<FormModelValue<TModel>>(this.form.value);

  /**
   * Constructor that sets up event handling for form value changes.
   * Updates the signals for value, rawValue, and lastValidRawValue based on form changes.
   */
  constructor() {
    this.form.events.subscribe(event => {
      if (event instanceof ValueChangeEvent) {
        this.value.set(event.value);

        this.rawValue.set(this.raw);
        this.dirtyValue.set(getFormGroupDirtyValue(this.form));

        if (this.form.valid) {
          this.lastValidRawValue.set(this.raw);
        }
      }
    });
  }

  private get raw(): FormModelRawValue<TModel> {
    return this.form.getRawValue() as FormModelRawValue<TModel>;
  }

  /**
   * Abstract method that must be implemented by subclasses to define the form structure.
   *
   * @returns A FormGroup instance typed with ControlsOf<TModel>.
   */
  abstract createForm(): FormGroup<ControlsOf<TModel>>;

  /**
   * Resets the form to its initial state, clearing all values and marking all controls as pristine.
   */
  reset() {
    this.form.reset();
  }

  /**
   * Returns true if the form has unsaved changes, false otherwise.
   *
   * The form is considered to have unsaved changes if any of its controls have been touched (i.e. the user has interacted with the form).
   * @returns {boolean} Whether the form has unsaved changes.
   */
  hasUnsavedChanges(): boolean {
    return this.form.touched;
  }

  /**
   * Patches the value of the form with the provided data.
   *
   * @param data - The data to patch the form with.
   * @param options - Optional options for the patchValue call.
   * @returns The patched form.
   *
   * @see https://angular.io/api/forms/FormGroup#patchValue
   */
  patchValue(
    data: Parameters<(typeof this.form)['patchValue']>[0],
    options: { onlySelf?: boolean; emitEvent?: boolean } = {}
  ) {
    this.form.patchValue(data, options);
  }

  getValueState(): FormValueState<TModel> {
    return {
      value: this.value(),
      dirtyValue: this.dirtyValue(),
      rawValue: this.rawValue(),
    } as FormValueState<TModel>;
  }
}
