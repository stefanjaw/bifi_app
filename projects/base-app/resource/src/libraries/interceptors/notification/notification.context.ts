import { HttpContextToken } from '@angular/common/http';

export const HTTP_NOTIFICATION_CONFIG_TOKEN = new HttpContextToken<NotificationConfig | null>(
  () => null
);

export class TranslateKey {
  public key!: string;
  public params?: Record<string, string>;
  public scope?: string;

  constructor(params: Pick<TranslateKey, 'key' | 'params' | 'scope'>) {
    Object.assign(this, params);
  }
}

// Tipos para la configuración
export type NotificationConfig =
  | TranslateKey
  | {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
    };
