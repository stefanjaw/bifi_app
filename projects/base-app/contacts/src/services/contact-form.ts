import { effect, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface ContactFormModel {
  name: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  parentId?: string;
  type: 'individual' | 'company';
  childIds?: string[];
  photo?: FormUploaderFile[];
  countryId?: string;
  state?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
  streetAddress2?: string;
  vat?: string;
}

function atLeastOneContactMethod(control: AbstractControl): ValidationErrors | null {
  const phone = control.get('phoneNumber')?.value;
  const email = control.get('email')?.value;
  const website = control.get('website')?.value;
  const type = control.get('type')?.value;

  const hasWebsite = type === 'company' && !!website;

  return phone || email || hasWebsite ? null : { atLeastOneContactMethod: true };
}

@Injectable({
  providedIn: 'root',
})
export class ContactForm extends BaseForm<ContactFormModel> {
  type = toSignal(this.form.controls.type.valueChanges, {
    initialValue: this.form.controls.type.value,
  });

  constructor() {
    super();

    effect(() => {
      const type = this.type();

      if (type === 'company') {
        this.form.controls.lastName.setValue('', { emitEvent: false });
        this.form.controls.lastName.disable({ emitEvent: false });
        this.form.controls.childIds.enable({ emitEvent: false });
      } else {
        this.form.controls.lastName.enable({ emitEvent: false });
        this.form.controls.childIds.disable({ emitEvent: false });
      }
    });

    const syncContactErrors = () => {
      const hasError = this.form.hasError('atLeastOneContactMethod');
      const controls = [
        this.form.controls.email,
        this.form.controls.phoneNumber,
        this.form.controls.website,
      ];

      controls.forEach(ctrl => {
        if (hasError) {
          if (!ctrl.hasError('atLeastOneContactMethod')) {
            ctrl.setErrors({ ...ctrl.errors, atLeastOneContactMethod: true });
          }
        } else {
          if (ctrl.hasError('atLeastOneContactMethod')) {
            const errs = { ...ctrl.errors };
            delete errs['atLeastOneContactMethod'];
            ctrl.setErrors(Object.keys(errs).length ? errs : null);
          }
        }
      });
    };

    this.form.valueChanges.subscribe(() => {
      setTimeout(syncContactErrors);
    });

    // Run once on init to set initial errors
    setTimeout(syncContactErrors);
  }

  override createForm() {
    return this.fb.group<ContactFormModel>(
      {
        name: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phoneNumber: [''],
        email: ['', [Validators.email]],
        website: [
          '',
          // [Validators.pattern(/^(https?:\/\/)?([\w-])+\.{1}([a-zA-Z]{2,63})([/\w\-.]*)*\/?$/)],
        ],
        parentId: [''],
        type: ['individual', [Validators.required]],
        childIds: {
          template: [''],
          formArrayElements: [],
        },
        photo: {
          template: {
            id: [''],
            file: [null!],
          },
          formArrayElements: [],
        },
        countryId: [''],
        state: [''],
        city: [''],
        zipCode: [''],
        streetAddress: [''],
        streetAddress2: [''],
        vat: [''],
      },
      { validators: atLeastOneContactMethod }
    );
  }
}
