import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

/**
 * Form model for an API key. `expires` toggles whether the key expires; when true,
 * `expiresAt` is an ISO date string (defaulted to 30 days from now). When false,
 * the key never expires and `expiresAt` is omitted before submission.
 */
export interface apiKeyFormModel {
  name: string;
  expires: boolean;
  expiresAt: string;
  active: boolean;
}

/**
 * Form service for creating/editing an API key. The raw key is never part of the
 * form — it is only surfaced once on create via CrudApiKeys.post().
 */
@Injectable({
  providedIn: 'root',
})
export class ApiKeyForm extends BaseForm<apiKeyFormModel> {
  override createForm() {
    return this.fb.group<apiKeyFormModel>({
      name: ['', [Validators.required]],
      expires: [true],
      expiresAt: [''],
      active: [true],
    });
  }
}
