export interface NotificationEventConfig {
  type: string;
  enabled: boolean;
  recipients: string[];
}

export interface NotificationSettings {
  events: NotificationEventConfig[];
}

export interface RecipientOption {
  id: string;
  label: string;
}

export interface NotificationCatalogEntry {
  type: string;
  label: string;
  description: string;
  module: string;
  icon: string;
  iconBg: string;
  recipientOptions: RecipientOption[];
  defaultRecipients: string[];
}
