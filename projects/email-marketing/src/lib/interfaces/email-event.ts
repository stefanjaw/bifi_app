export type emailEventType =
  | 'sent'
  | 'delivered'
  | 'open'
  | 'click'
  | 'bounce'
  | 'complaint'
  | 'unsubscribe'
  | 'failed';

export interface emailEvent {
  _id: string;
  campaignId?: any;
  subscriberId?: any;
  email?: string;
  type: emailEventType;
  providerMessageId?: string;
  url?: string;
  meta?: any;
  active: boolean;
  createdAt?: string;
}

export interface emailDashboard {
  totals: {
    campaigns: number;
    subscribers: number;
    lists: number;
    templates: number;
  };
  aggregateStats: campaignStatsSummary;
  recentCampaigns: any[];
}

export interface campaignStatsSummary {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}
