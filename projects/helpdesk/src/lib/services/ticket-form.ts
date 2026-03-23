import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TicketFormModel {
  name: string;
  description: string;
  internalNotes: string;
  priority: string;
  type: string;
  stage: string;
  assigned: string;
  senderUser: string;
  followers: string[];
  tagsInput: string;
  category: string;
  appModule: string;
}

@Injectable({
  providedIn: 'root',
})
export class TicketForm extends BaseForm<TicketFormModel> {
  override createForm() {
    return this.fb.group<TicketFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      internalNotes: [''],
      priority: ['medium'],
      type: ['helpdesk'],
      stage: [''],
      assigned: [''],
      senderUser: [''],
      followers: { template: [''], formArrayElements: [] },
      tagsInput: [''],
      category: [''],
      appModule: [''],
    });
  }
}
