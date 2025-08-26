import { Injectable } from '@angular/core';
import {
  Notification,
  TranslateKey,
} from '../libraries/interceptors/notification/notification.context';

const defaultMessages = {
  POST: {
    success: 'The {{ element }} was created successfully!',
    error: 'Error creating the {{ element }}. {{ message }}',
    loading: 'Creating {{ element }}...',
  },
  PUT: {
    success: 'The {{ element }} was updated successfully!',
    error: 'Error updating the {{ element }}. {{ message }}',
    loading: 'Updating {{ element }}...',
  },
  DELETE: {
    success: 'The {{ element }} was deleted successfully!',
    error: 'Error deleting the {{ element }}. {{ message }}',
    loading: 'Deleting {{ element }}...',
  },
  PATCH: {
    success: 'The {{ element }} was updated successfully!',
    error: 'Error updating the {{ element }}. {{ message }}',
    loading: 'Updating {{ element }}...',
  },
};

@Injectable({
  providedIn: 'root',
})
export class NotificationMessageResolver {
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

    if (config instanceof TranslateKey) {
      // const data = transloco.translateObject(config.key, config.params, config.scope);
      // console.log('translated object notifications', data);
      // if (typeof data === 'object') {
      //   if (data.success) success = data.success;
      //   if (data.error) error = data.error;
      //   if (data.loading) loading = data.loading;
      // } else {
      //   console.log('Could not find translation for key', config);
      // }
    } else {
      if (config?.successMessage) success = config.successMessage;

      if (config?.errorMessage) error = config.errorMessage;

      if (config?.loadingMessage) loading = config.loadingMessage;
    }

    if (method in defaultMessages) {
      if (!success)
        success = defaultMessages[method as keyof typeof defaultMessages].success.replace(
          '{{ element }}',
          elementName
        );
      if (!error)
        error = defaultMessages[method as keyof typeof defaultMessages].error.replace(
          '{{ element }}',
          elementName
        );
      if (!loading)
        loading = defaultMessages[method as keyof typeof defaultMessages].loading.replace(
          '{{ element }}',
          elementName
        );
    }

    return { success, error, loading };
  }
}
