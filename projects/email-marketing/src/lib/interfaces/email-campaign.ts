import { mailingList } from './mailing-list';
import { emailTemplate } from './email-template';

export type campaignStatus =
  | 'draft'
  | 'scheduled'
  | 'sending'
  | 'sent'
  | 'cancelled'
  | 'failed';

export interface campaignStats {
  recipients?: number;
  sent?: number;
  delivered?: number;
  opened?: number;
  clicked?: number;
  bounced?: number;
  complained?: number;
  unsubscribed?: number;
  failed?: number;
}

export interface emailCampaign {
  _id: string;
  name: string;
  subject: string;
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  replyTo?: string;
  templateId?: string | emailTemplate;
  designJson?: any;
  mjml?: string;
  html?: string;
  listIds?: (string | mailingList)[];
  status: campaignStatus;
  scheduledAt?: string;
  sentAt?: string;
  stats?: campaignStats;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
