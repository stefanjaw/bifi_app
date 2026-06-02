import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface EmailSettingsFormModel {
  provider: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
  resendApiKey: string;
  mailgunApiKey: string;
  mailgunDomain: string;
  mailgunRegion: string;
  sesAccessKeyId: string;
  sesSecretAccessKey: string;
  sesRegion: string;
  sendgridApiKey: string;
  trackOpens: boolean;
  trackClicks: boolean;
  footerText: string;
  unsubscribeText: string;
  testMode: boolean;
  testRecipient: string;
  publicBaseUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailSettingsForm extends BaseForm<EmailSettingsFormModel> {
  override createForm() {
    return this.fb.group<EmailSettingsFormModel>({
      provider: ['resend', [Validators.required]],
      fromName: [''],
      fromEmail: ['', [Validators.email]],
      replyTo: [''],
      resendApiKey: [''],
      mailgunApiKey: [''],
      mailgunDomain: [''],
      mailgunRegion: ['us'],
      sesAccessKeyId: [''],
      sesSecretAccessKey: [''],
      sesRegion: ['us-east-1'],
      sendgridApiKey: [''],
      trackOpens: [true],
      trackClicks: [true],
      footerText: [''],
      unsubscribeText: ['Unsubscribe'],
      testMode: [false],
      testRecipient: [''],
      publicBaseUrl: [''],
    });
  }
}
