import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';
import { LanguageFormModel } from '../interfaces/language';

/**
 * Reactive form service for creating and editing Language records.
 * Extends BaseForm with the LanguageFormModel shape.
 */
@Injectable({
  providedIn: 'root',
})
export class LanguageForm extends BaseForm<LanguageFormModel> {
  override createForm() {
    return this.fb.group<LanguageFormModel>({
      locale: ['', [Validators.required]],
      name: ['', [Validators.required]],
      nativeName: ['', [Validators.required]],
      active: [true],
    });
  }
}
