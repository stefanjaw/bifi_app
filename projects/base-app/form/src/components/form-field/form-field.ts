import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormError } from '../form-error/form-error';
import { FormFieldContext } from '../../services/form-field-context';
import { FormControlExtension } from '../../directives/form-control-extension';

@Component({
  selector: 'bifi-app-form-field',
  imports: [],
  providers: [FormFieldContext],
  templateUrl: './form-field.html',
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly contextService = inject(FormFieldContext);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  // The user can provide a custom class
  userClass = input<string>('', { alias: 'class' });

  // The text will change to red if the form control is invalid
  // A form control is invalid when it is dirty (has been touched) and its value is invalid
  _computedClass = computed(() => {
    const baseClass =
      '[&:has(.app-control.ng-invalid.ng-dirty)]:text-red-400 flex flex-col gap-2 text-base';
    const userClass = this.userClass();

    // Return an array of classes
    return `${baseClass} ${userClass}`;
  });

  // The child NgControl (form control)
  public readonly ngControl = contentChild(NgControl);

  // The child FormControlExtensionDirective, which contains a error state tracker
  public readonly extensionDirective = contentChild(FormControlExtension);

  // The child FormErrorComponent
  public readonly errorChildren = contentChildren(FormError);

  protected readonly hasDisplayedMessage = computed<'error' | 'hint'>(() =>
    this.errorChildren() &&
    this.errorChildren().length > 0 &&
    this.extensionDirective()?.errorState()
      ? 'error'
      : 'hint'
  );

  constructor() {
    effect(() => {
      const extensionDirective = this.extensionDirective();
      if (!extensionDirective) {
        return;
      }

      const ngControl = this.ngControl();
      if (!ngControl) {
        return;
      }

      // Update the context -> Set the NgControl and the controlId to the extension directive id
      this.contextService.ngControl.set(ngControl);
      this.contextService.controlId.set(extensionDirective.id());
    });
  }
}
