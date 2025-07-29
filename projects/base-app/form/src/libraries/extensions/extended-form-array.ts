import { AbstractControl, FormArray } from '@angular/forms';

type ControlTemplate<TControl extends AbstractControl> = () => TControl;

export class TypedFormArrayExtension<
  TControl extends AbstractControl<any> = any,
> extends FormArray<TControl> {
  private _controlTemplate!: ControlTemplate<TControl>;

  get controlTemplate(): ControlTemplate<TControl> {
    return this._controlTemplate;
  }

  set controlTemplate(value: ControlTemplate<TControl>) {
    this._controlTemplate = value;
  }

  override patchValue(
    value: Parameters<FormArray<TControl>['patchValue']>[0],
    options?: { createOrRemoveControls?: boolean } & Parameters<
      FormArray<TControl>['patchValue']
    >[1]
  ): void {
    console.log('xd');
    // Create the necessary controls to match the required length
    // Only execute if no options received, if no createOrRemoveControls option is set, or if createOrRemoveControls is true (by default true)
    if (
      !options ||
      options?.createOrRemoveControls === undefined ||
      options?.createOrRemoveControls === true
    ) {
      for (let i = this.length; i < value.length; i++) {
        this.push(this.createControl());
      }

      // Remove controls that are not needed
      if (value.length < this.length) {
        for (let i = this.length - 1; i >= value.length; i--) {
          this.removeAt(i);
        }
      }
    }

    super.patchValue(value, options);
  }

  createControl() {
    return this.controlTemplate();
  }
}
