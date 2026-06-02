import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface EmailCampaignFormModel {
  name: string;
  subject: string;
  previewText: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  listIds: any;
  templateId: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailCampaignForm extends BaseForm<EmailCampaignFormModel> {
  override createForm() {
    return this.fb.group<EmailCampaignFormModel>({
      name: ['', [Validators.required]],
      subject: ['', [Validators.required]],
      previewText: [''],
      fromName: [''],
      fromEmail: ['', [Validators.email]],
      replyTo: [''],
      listIds: [[] as string[]],
      templateId: [''],
    });
  }
}
