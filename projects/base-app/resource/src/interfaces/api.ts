import { Notification } from '../libraries/interceptors/notification/notification.context';

/**
 * Supported base request types for generic API actions.
 */
export type ApiRequestType =
  | 'get'
  | 'getAll'
  | 'getWithPagination'
  | 'create'
  | 'update'
  | 'delete';

export interface ApiActionConfig {
  entityName?: string;
  enableToast?: boolean;
  notificationConfig?: Notification;
}

export type ApiRequestManagerConfig = Partial<Record<ApiRequestType, ApiActionConfig>>;
