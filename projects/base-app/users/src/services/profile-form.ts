import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

export interface ProfileFormModel {
  username: string;
  email: string;
  contactEmail?: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  website?: string;
  uploadedPictureId?: string;
}

@Injectable({
  providedIn: 'root',
})
//Validators can be added later if needed
export class ProfileForm extends BaseForm<ProfileFormModel> {
  override createForm() {
    return this.fb.group<ProfileFormModel>({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      name: [''],
      lastName: [''],
      phoneNumber: [''],
      contactEmail: [''],
      website: [''],
      uploadedPictureId: [''],
    });
  }
}
