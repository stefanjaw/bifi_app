import { CommonModule, formatCurrency, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DEFAULT_CURRENCY_CODE,
  effect,
  inject,
  input,
  LOCALE_ID,
  signal,
  TemplateRef,
} from '@angular/core';
import { FormPreviewContainer } from '@avalantec/base-app/form/src/components/form-preview/form-preview-container/form-preview-container';
import {
  previewValueType,
  previewVariant,
} from '@avalantec/base-app/form/src/components/form-preview/form-preview.model';
import { FormFieldContext } from '@avalantec/base-app/form/src/services/form-field-context';
import { startWith } from 'rxjs';

@Component({
  selector: 'bifi-app-form-preview',
  imports: [CommonModule, FormPreviewContainer],
  templateUrl: './form-preview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormPreview {
  private fieldContext = inject(FormFieldContext);
  private localeId = inject(LOCALE_ID);
  private currencyCode = inject(DEFAULT_CURRENCY_CODE);

  variant = input<previewVariant>('text');
  valueType = input<previewValueType>('text');

  previewTemplate = contentChild('preview', {
    read: TemplateRef,
  });

  control = this.fieldContext.abstractControl;
  hasControlAttached = this.fieldContext.hasControlAttached;
  value = signal<any>(null);
  formattedValue = computed<string | null>(() => {
    const value = this.value();
    const valueType = this.valueType();

    switch (valueType) {
      case 'text':
        return value;
      case 'date':
        return formatDate(value, 'MMM dd, yyyy', this.localeId);
      case 'currency':
        return formatCurrency(value, this.localeId, '$', this.currencyCode);
      default:
        return value;
    }
  });

  constructor() {
    effect(onCleanup => {
      const control = this.control();
      if (!control || !control.valueChanges) return;

      // Update the formatted value when the control value changes
      const subscription = control.valueChanges.pipe(startWith(control.value)).subscribe(value => {
        this.value.set(value);
      });

      onCleanup(() => subscription.unsubscribe());
    });
  }
}
