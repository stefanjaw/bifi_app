import { inject, Injectable } from '@angular/core';
import { Notification, TranslateKey } from '../libraries/interceptors/notification/notification.context';
import { TranslationService } from '@avalantec/base-app/i18n';

const defaultMessages = {
  POST: {
    success: 'notification.create.success',
    error: 'notification.create.error',
    loading: 'notification.create.loading',
  },
  PUT: {
    success: 'notification.update.success',
    error: 'notification.update.error',
    loading: 'notification.update.loading',
  },
  DELETE: {
    success: 'notification.delete.success',
    error: 'notification.delete.error',
    loading: 'notification.delete.loading',
  },
  PATCH: {
    success: 'notification.update.success',
    error: 'notification.update.error',
    loading: 'notification.update.loading',
  },
};

@Injectable({
  providedIn: 'root',
})
export class NotificationMessageResolver {
  private translationService = inject(TranslationService);

  resolveMessages({
    config,
    elementName,
    method,
  }: {
    elementName: string;
    method: string;
    config?: Notification;
  }) {
    let success: string | undefined = undefined;
    let error: string | undefined = undefined;
    let loading: string | undefined = undefined;

    if (config && !(config instanceof TranslateKey)) {
      if (config.successMessage) success = config.successMessage;

      if (config.errorMessage) error = config.errorMessage;

      if (config.loadingMessage) loading = config.loadingMessage;
    }

    if (method in defaultMessages) {
      const keys = defaultMessages[method as keyof typeof defaultMessages];
      if (!success)
        success = this.translationService.translate(keys.success, { element: elementName }, 'base-app/resource');
      if (!error)
        error = this.translationService.translate(keys.error, { element: elementName, message: '{{ message }}' }, 'base-app/resource');
      if (!loading)
        loading = this.translationService.translate(keys.loading, { element: elementName }, 'base-app/resource');
    }

    return { success, error, loading };
  }
}
