import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

/**
 * Form model for an API key. `expiresAt` is an ISO date string; an empty string
 * means "no expiry" and is stripped before submission.
 */
export interface apiKeyFormModel {
  name: string;
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
      expiresAt: [''],
      active: [true],
    });
  }
}
