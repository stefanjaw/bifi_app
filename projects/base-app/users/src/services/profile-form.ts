import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface ProfileFormModel {
  username: string;
  email: string;
  contactEmail?: string;
  name?: string;
  lastName?: string;
  phoneNumber?: string;
  website?: string;
  uploadedPictureId?: FormUploaderFile[];
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
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [''],
      contactEmail: ['', Validators.required],
      website: [''],
      uploadedPictureId: {
        template: {
          file: [null!],
          id: [''],
        },
        formArrayElements: [],
      },
    });
  }
}
