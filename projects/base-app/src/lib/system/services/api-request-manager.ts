import { inject, Injectable, resource, ResourceRef } from '@angular/core';
import { LIBRARY_CONFIG } from '../libraries/library-config-token';
import { pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestManager<T> {
  private readonly _apiURL = inject(LIBRARY_CONFIG).apiURL;
  private _endpoint = '';

  constructor() {}

  // set and get endpoint
  get endpoint() {
    return this._endpoint;
  }

  set endpoint(endpoint: string) {
    if (endpoint.includes('/'))
      throw new Error('Endpoint cannot have the / symbol');

    this._endpoint = endpoint;
  }

  //#region Functions to call api
  post(
    formData: FormData,
    specificEndpoint: string = '',
  ): ResourceRef<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return resource({
      loader: async () => {
        const response = await fetch(fullURL, {
          body: formData,
          method: 'POST',
        });

        if (!response.ok) this.manageError(fullURL, response.status);

        return (await response.json()) as T;
      },
      defaultValue: undefined,
    });
  }

  put(
    _id: string,
    formData: FormData,
    specificEndpoint: string = '',
  ): ResourceRef<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    // set id to the formData
    formData.append('_id', _id);

    return resource({
      loader: async () => {
        const response = await fetch(fullURL, {
          body: formData,
          method: 'PUT',
        });

        if (!response.ok) this.manageError(fullURL, response.status);

        return (await response.json()) as T;
      },
      defaultValue: undefined,
    });
  }

  get(
    params: URLSearchParams,
    specificEndpoint: string = '',
  ): ResourceRef<T[]> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return resource({
      loader: async () => {
        const response = await fetch(fullURL + params.toString(), {
          method: 'GET',
        });

        if (!response.ok) this.manageError(fullURL, response.status);

        return (await response.json()) as T[];
      },
      defaultValue: [],
    });
  }

  getWithPagination(
    params: URLSearchParams,
    specificEndpoint: string = '',
  ): ResourceRef<pagination<T> | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return resource({
      loader: async () => {
        const response = await fetch(fullURL + params.toString(), {
          method: 'GET',
        });

        if (!response.ok) this.manageError(fullURL, response.status);

        return (await response.json()) as pagination<T>;
      },
      defaultValue: undefined,
    });
  }

  delete(_id: string, endpoint: string = ''): ResourceRef<boolean> {
    const fullURL = `${this.formatFullURL()}${endpoint ? '/' + endpoint : ''}`;
    const params = new URLSearchParams({
      _id: _id,
    });

    return resource({
      loader: async () => {
        const response = await fetch(fullURL + params.toString(), {
          method: 'DELETE',
        });

        if (!response.ok) this.manageError(fullURL, response.status);

        return (await response.json()) as boolean;
      },
      defaultValue: false,
    });
  }
  //#endregion

  //#region UTILS
  private formatFullURL() {
    return `${this._apiURL}${this._apiURL[this._apiURL.length - 1] === '/' ? '' : '/'}${this.endpoint}`;
  }

  private manageError(fullURL: string, status: number) {
    const error = new Error(`POST ${fullURL} failed with status ${status}`);

    console.error(error);
    throw error;
  }
  //#endregion
}
