export type emailProvider = 'resend' | 'mailgun' | 'ses' | 'sendgrid';

export interface emailSettings {
  _id?: string;
  provider?: emailProvider;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  resendApiKey?: string;
  mailgunApiKey?: string;
  mailgunDomain?: string;
  mailgunRegion?: 'us' | 'eu';
  sesAccessKeyId?: string;
  sesSecretAccessKey?: string;
  sesRegion?: string;
  sendgridApiKey?: string;
  trackOpens?: boolean;
  trackClicks?: boolean;
  footerText?: string;
  unsubscribeText?: string;
  testMode?: boolean;
  testRecipient?: string;
  publicBaseUrl?: string;
}
