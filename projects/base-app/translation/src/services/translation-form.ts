import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';
import { TranslationFormModel } from '../interfaces/translation';

/**
 * Reactive form service for creating and editing Translation records.
 * Extends BaseForm with the TranslationFormModel shape.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationForm extends BaseForm<TranslationFormModel> {
  override createForm() {
    return this.fb.group<TranslationFormModel>({
      locale: ['', [Validators.required]],
      scope: ['', [Validators.required]],
      key: ['', [Validators.required]],
      value: ['', [Validators.required]],
      active: [true],
    });
  }
}
