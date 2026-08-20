import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiKey } from '@avalantec/base-app/interfaces';
import { ApiRequestManager } from '@avalantec/base-app/resource';

/**
 * Create response payload: the created API key plus the one-time `key`.
 * The raw key is ONLY present here — the backend persists only its hash.
 */
export type ApiKeyCreateResponse = apiKey & { key: string };

/**
 * Frontend CRUD client for self-service API keys (endpoint `/api-keys`).
 * Each user's keys are self-scoped on the backend, so reads/revokes only ever
 * touch the caller's own keys.
 */
@Injectable({
  providedIn: 'root',
})
export class CrudApiKeys extends ApiRequestManager<apiKey> {
  constructor() {
    super({
      endpoint: 'api-keys',
      elementName: 'api key',
      config: {},
    });
  }

  /**
   * Override create to surface the one-time raw `key` returned by the backend
   * (persisted only as a hash, so it is shown exactly once).
   * @param options - Same options as the base post method.
   * @returns An observable of the created key including the raw `key` string.
   */
  override post({
    data,
    specificEndpoint = '',
    fileFields = [],
    notificationConfig,
  }: {
    data: Record<string, any>;
    specificEndpoint?: string;
    fileFields?: string[];
    notificationConfig?: { enable?: boolean; successMessage?: string };
  }): Observable<ApiKeyCreateResponse | undefined> {
    return super.post({
      data,
      specificEndpoint,
      fileFields,
      notificationConfig,
    }) as Observable<ApiKeyCreateResponse | undefined>;
  }
}
