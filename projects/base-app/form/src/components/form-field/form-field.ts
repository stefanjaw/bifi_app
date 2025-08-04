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
import { ControlContainer, NgControl } from '@angular/forms';
import { FormError } from '../form-error/form-error';
import { FormFieldContext } from '../../services/form-field-context';
import { FormControlExtension } from '../../directives/form-control-extension';
import { FormContext } from '@avalantec/base-app/form/src/services/form-context';
import { FormPreview } from '@avalantec/base-app/form/src/components/form-preview/form-preview';
import {
  previewValueType,
  previewVariant,
} from '@avalantec/base-app/form/src/components/form-preview/form-preview.model';

@Component({
  selector: 'bifi-app-form-field',
  imports: [FormPreview],
  providers: [FormFieldContext],
  templateUrl: './form-field.html',
  host: {
    '[class]': '_computedClass()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  /** The form context if this field is inside a form */
  private readonly formContext = inject(FormContext, { optional: true });

  /** The form field context, used locally in this component and children */
  private readonly fieldContext = inject(FormFieldContext, { self: true });

  protected readonly destroyRef = inject(DestroyRef);
  protected readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  // The user can provide a custom class
  userClass = input<string>('', { alias: 'class' });

  // If this form field should be in preview mode
  previewVariant = input<previewVariant>('text');
  previewValueType = input<previewValueType>('text');
  isPreviewMode = input<boolean | undefined>(undefined);

  // The text will change to red if the form control is invalid
  // A form control is invalid when it is dirty (has been touched) and its value is invalid
  _computedClass = computed(() => {
    const baseClass =
      '[&:has(.app-control.ng-invalid.ng-dirty)]:text-red-400 flex flex-col gap-2 text-base';
    const userClass = this.userClass();

    // Return an array of classes
    return `${baseClass} ${userClass}`;
  });

  // Child NgControl (form control)
  public readonly ngControl = contentChild(NgControl, { descendants: true });

  // Child ControlContainer (Form Group or Form Array)
  public readonly controlContainer = contentChild(ControlContainer, { descendants: false });

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

  protected readonly hasDisplayedPreview = computed<'preview' | 'none'>(() => {
    // Get the form preview mode value, if it is undefined, default to false
    const formPreviewMode =
      this.formContext?.isPreviewMode() === undefined ? false : this.formContext?.isPreviewMode();

    // Prioritize this field's preview mode
    // If this field's preview mode is undefined, use the form preview mode
    const inPreview = this.isPreviewMode() === undefined ? formPreviewMode : this.isPreviewMode();

    if (inPreview) {
      return 'preview';
    } else {
      return 'none';
    }
  });

  constructor() {
    effect(() => {
      const extensionDirective = this.extensionDirective();

      // Only proceed if there is an extension directive attached
      if (!extensionDirective) {
        return;
      }

      const ngControl = this.ngControl();
      const controlContainer = this.controlContainer();
      if (!ngControl && !controlContainer) {
        console.log('Could not find NgControl or ControlContainer');
        console.log(this.element.nativeElement);
        return;
      }

      // Update the context -> Set the NgControl and the controlId to the extension directive id
      this.fieldContext.abstractControl.set(controlContainer! || ngControl!);
      this.fieldContext.controlId.set(extensionDirective.id());
    });
  }
}
