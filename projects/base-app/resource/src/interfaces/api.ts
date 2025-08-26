import { NotificationConfig } from '../libraries/interceptors/notification/notification.context';

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
  notificationConfig?: NotificationConfig | null;
}

export type ApiRequestManagerConfig = Partial<Record<ApiRequestType, ApiActionConfig>>;
