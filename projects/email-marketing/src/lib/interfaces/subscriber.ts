import { mailingList } from './mailing-list';

export type subscriberStatus =
  | 'subscribed'
  | 'unsubscribed'
  | 'bounced'
  | 'complained';

export interface subscriberContactRef {
  _id: string;
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
}

export interface subscriber {
  _id: string;
  email: string;
  name?: string;
  listId?: string | mailingList;
  contactId?: string | subscriberContactRef;
  status: subscriberStatus;
  tags?: string[];
  customFields?: Record<string, any>;
  subscribedAt?: string;
  unsubscribedAt?: string;
  bouncedAt?: string;
  active: boolean;
}
