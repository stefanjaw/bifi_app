import { effect, Injectable } from '@angular/core';
import { injectAuthService } from '@avalantec/base-app/auth';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProfileFormModel {
  username: string;
  email: string;
  contactEmail?: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  website?: string;
}

@Injectable({
  providedIn: 'root',
})
//Validators can be added later if needed
export class ProfileForm extends BaseForm<ProfileFormModel> {
  private auth = injectAuthService();

  constructor() {
    super();
    effect(() => {
      const user = this.auth.user();

      if (!user) return;

      super.patchValue({
        username: user.username,
        email: user.email,
        name: user.contactId?.name,
        lastName: user.contactId?.lastName,
        phoneNumber: user.contactId?.phoneNumber,
        contactEmail: user.contactId?.email,
        website: user.contactId?.website,
      });

      if (user.contactId?.type === 'company') {
        this.form.controls.lastName.setValue('', { emitEvent: false });
        this.form.controls.lastName.disable({ emitEvent: false });
      } else {
        this.form.controls.lastName.enable({ emitEvent: false });
      }
    });
  }
  override createForm() {
    return this.fb.group<ProfileFormModel>({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      name: [''],
      lastName: [''],
      phoneNumber: [''],
      contactEmail: [''],
      website: [''],
    });
  }
}
