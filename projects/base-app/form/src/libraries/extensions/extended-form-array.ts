import { AbstractControl, FormArray } from '@angular/forms';

type ControlTemplate<TControl extends AbstractControl> = () => TControl;

export class TypedFormArrayExtension<
  TControl extends AbstractControl<any> = any,
  TControlValueItem = ReturnType<TControl['getRawValue']>,
> extends FormArray<TControl> {
  private _controlTemplate!: ControlTemplate<TControl>;

  /**
   * Returns the control template that is used to create new controls.
   * The control template is a function that returns a new control of type TControl.
   * The returned control is used as the template for all new controls created by the form array.
   * This property is used by the `pushItem`, `insertItem`, and `setItem` methods to create new controls.
   * @returns The control template.
   */
  get controlTemplate(): ControlTemplate<TControl> {
    return this._controlTemplate;
  }

  /**
   * A function that returns a new control of type TControl.
   * The returned control is used as the template for all new controls created by the form array.
   * This property is used by the `pushItem`, `insertItem`, and `setItem` methods to create new controls.
   */
  set controlTemplate(value: ControlTemplate<TControl>) {
    this._controlTemplate = value;
  }

  /**
   * Pushes a new item to the end of the form array.
   * It creates a new control with the given data and then calls the `push` method of the form array.
   * @param data The data to use to create the new control.
   */
  pushItem(data?: TControlValueItem) {
    this.push(this.createControl(data));
  }

  /**
   * Pushes a new item to the end of the form array.
   * It creates a new control with the given data and then calls the `push` method of the form array.
   * Marks the form array as dirty.
   * @param control The control to add to the form array.
   * @param options An options object that can be used to turn off the emitEvent trigger.
   */
  override push(control: TControl, options?: { emitEvent?: boolean }): void {
    super.push(control, options);
    this.markAsDirty();
  }

  /**
   * Removes the control at the specified index from the form array.
   * Calls the `removeAt` method of the form array and then marks the form array as dirty.
   * @param index The position of the control to remove.
   * @param options An options object that can be used to turn off the emitEvent trigger.
   */
  override removeAt(index: number, options?: { emitEvent?: boolean }): void {
    super.removeAt(index, options);
    this.markAsDirty();
  }

  /**
   * Inserts a new item into the form array at the specified index.
   * It creates a new control with the given data and then calls the `insert` method of the form array.
   * @param index The position where the new control should be inserted.
   * @param data The data to use to create the new control.
   */
  insertItem(index: number, data: TControlValueItem) {
    this.insert(index, this.createControl(data));
  }

  /**
   * Replaces the control at the specified index with a new control created with the given data.
   * @param index The position of the control to replace.
   * @param data The data to use to create the new control.
   */
  setItem(index: number, data: TControlValueItem) {
    this.setControl(index, this.createControl(data));
  }

  /**
   * Patches the value of the form array.
   * It creates or removes controls to match the required length.
   * If the `createOrRemoveControls` option is set to `false`, it will not create or remove controls and will only update the values of the existing controls.
   * @param value The new value of the form array.
   * @param options The options to use when patching the value. It is an object with a single property `createOrRemoveControls` of type `boolean`.
   * If `createOrRemoveControls` is set to `false`, the method will not create or remove controls and will only update the values of the existing controls.
   * If `createOrRemoveControls` is not set or is set to `true` (by default true), the method will create or remove controls to match the required length.
   */
  override patchValue(
    value: Parameters<FormArray<TControl>['patchValue']>[0],
    options?: { createOrRemoveControls?: boolean } & Parameters<
      FormArray<TControl>['patchValue']
    >[1]
  ): void {
    // Create the necessary controls to match the required length
    // Only execute if no options received, if no createOrRemoveControls option is set, or if createOrRemoveControls is true (by default true)
    if (
      !options ||
      options?.createOrRemoveControls === undefined ||
      options?.createOrRemoveControls === true
    ) {
      for (let i = this.length; i < value.length; i++) {
        this.push(this.createControl(), { emitEvent: false });
      }

      // Remove controls that are not needed
      if (value.length < this.length) {
        for (let i = this.length - 1; i >= value.length; i--) {
          this.removeAt(i, { emitEvent: false });
        }
      }
    }

    super.patchValue(value, options);
  }

  /**
   * Creates a new control and returns it.
   * If data is provided, it calls patchValue on the new control with the given data.
   * @param data The data to use to create the new control.
   * @returns The new control.
   */
  createControl(data?: TControlValueItem): TControl {
    const control = this.controlTemplate();

    if (data) {
      control.patchValue(data);
    }

    return control;
  }
}
