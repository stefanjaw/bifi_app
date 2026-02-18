import { pagination } from '../interfaces/pagination';
import { inject, ResourceRef, Signal, signal } from '@angular/core';
import { HttpClient, HttpContext, HttpParams, httpResource } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { paginationOptions } from '../interfaces/pagination-options';
import { orderByQuery } from '../interfaces/order-by';
import {
  LIBRARY_CONFIG,
  maybeSignal,
  mayBeSignalValue,
  ToastManager,
} from '@avalantec/base-app/core';
import { isFormUploaderFile, isFormUploaderFileArray } from '@avalantec/base-app/form';
import { ApiRequestManagerConfig, ApiRequestType } from '../interfaces/api';
import { HTTP_NOTIFICATION_CONFIG_TOKEN } from '../libraries/interceptors/notification/notification.context';
import { FileResolver } from './file-resolver';

export class ApiRequestManager<T> {
  protected readonly _httpClient = inject(HttpClient);
  protected readonly _apiURL = inject(LIBRARY_CONFIG).apiURL;
  protected readonly _toastManager = inject(ToastManager);
  protected readonly _fileResolver = inject(FileResolver);

  private _endpoint = '';
  private _config: ApiRequestManagerConfig = {};
  private _elementName = 'element';
  protected readonly _defaultPaginateOptions = signal<paginationOptions>({
    page: 1,
    limit: 5,
    paginate: true,
  });

  constructor(params?: Pick<ApiRequestManager<T>, 'endpoint' | 'config' | 'elementName'>) {
    if (params) Object.assign(this, params);
  }

  // get and set element name
  get elementName() {
    return this._elementName;
  }
  set elementName(elementName: string) {
    this._elementName = elementName.toLowerCase();
  }

  // get and set config

  get config() {
    return this._config;
  }

  set config(config: ApiRequestManagerConfig) {
    this._config = config;
  }

  // set and get endpoint
  get endpoint() {
    return this._endpoint;
  }
  /**
   * Sets the endpoint for this api request manager.
   * @param endpoint The endpoint to set.
   * @throws {Error} If the endpoint contains a / symbol.
   */
  set endpoint(endpoint: string) {
    if (endpoint.includes('/')) throw new Error('Endpoint cannot have the / symbol');

    this._endpoint = endpoint;
  }

  //#region Functions to call api

  /**
   * Post data to the api.
   *
   * @param data The data to be sent.
   * @param specificEndpoint The specific endpoint to be used. If not provided, the default endpoint of the service will be used.
   * @returns An observable that resolves to the response of the request, or undefined if the request fails.
   */
  post({
    data,
    specificEndpoint = '',
    fileFields = [],
  }: {
    data: Record<string, any>;
    specificEndpoint?: string;
    fileFields?: string[];
  }): Observable<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;
    const formData = this.createFormDataFromObject(data, fileFields);

    return this._httpClient.post<T | undefined>(fullURL, formData);
  }

  /**
   * Puts data to the api.
   *
   * @param _id The id of the document to be updated.
   * @param data The data to be sent.
   * @param specificEndpoint The specific endpoint to be used. If not provided, the default endpoint of the service will be used.
   * @returns An observable that resolves to the response of the request, or undefined if the request fails.
   */
  put({
    _id,
    data,
    fileFields = [],
    specificEndpoint = '',
  }: {
    _id?: string;
    data: Record<string, any>;
    fileFields?: string[];
    specificEndpoint?: string;
  }): Observable<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    // set id to the formData
    data = { ...data, _id };
    const formData = this.createFormDataFromObject(data, fileFields);

    return this._httpClient.put<T | undefined>(fullURL, formData, {
      context: this.createHttpContext('update'),
    });
  }

  get<TRequestReturnType extends T = T>({
    id,
    searchParams,
    sort,
    triggerRequest,
    specificEndpoint,
    getInactive,
  }: {
    id: maybeSignal<string>;
    searchParams?: Signal<Record<string, any>>;
    sort?: Signal<orderByQuery<T>>;
    triggerRequest?: Signal<boolean>;
    specificEndpoint?: maybeSignal<string>;
    getInactive?: maybeSignal<boolean | null>;
  }): ResourceRef<TRequestReturnType | undefined>;

  get<TRequestReturnType extends T = T>({
    searchParams,
    sort,
    triggerRequest,
    specificEndpoint,
    getInactive,
  }: {
    searchParams?: maybeSignal<Record<string, any>>;
    sort?: maybeSignal<orderByQuery<T>>;
    triggerRequest?: maybeSignal<boolean>;
    specificEndpoint?: maybeSignal<string>;
    getInactive?: maybeSignal<boolean | null>;
  }): ResourceRef<TRequestReturnType[]>;

  /**
   * Get data from the api.
   *
   * @param searchParams The search params as a signal. If not provided, the default search params will be used.
   * @param specificEndpoint The specific endpoint to be used. If not provided, the default endpoint of the service will be used.
   * @returns A resource ref that resolves to an array of T or an empty array if the request fails.
   */
  get<TRequestReturnType extends T = T>({
    id,
    searchParams,
    sort,
    triggerRequest,
    specificEndpoint = '',
    getInactive = false,
  }: {
    id?: maybeSignal<string>;
    searchParams?: maybeSignal<Record<string, any>>;
    sort?: maybeSignal<orderByQuery<T>>;
    triggerRequest?: maybeSignal<boolean>;
    specificEndpoint?: maybeSignal<string>;
    getInactive?: maybeSignal<boolean | null>;
  }): ResourceRef<TRequestReturnType | TRequestReturnType[] | undefined> {
    const isGetById = id !== undefined;
    return httpResource(
      () => {
        const _id = mayBeSignalValue(id);
        const _path = mayBeSignalValue(specificEndpoint);
        const _trigger = mayBeSignalValue(triggerRequest);

        if (_trigger === false) {
          return undefined;
        }

        const params = mayBeSignalValue(searchParams);
        const sorts = mayBeSignalValue(sort);
        const inactive = mayBeSignalValue(getInactive);

        const query = new URLSearchParams({
          ...((params || !inactive) && {
            searchParams: JSON.stringify({
              ...params,
              ...(typeof inactive === 'boolean' && !inactive && { active: true }),
              ...(typeof inactive === 'boolean' && inactive && { active: false }),
            }),
          }),
          ...(sorts && { orderBy: JSON.stringify(sorts) }),
        });

        return {
          url: `${this.formatFullURL()}${_path ? '/' + _path : ''}${_id ? `/${_id}` : ''}`,
          params: new HttpParams({ fromString: query.toString() }),
          context: this.createHttpContext(isGetById ? 'get' : 'getAll'),
        };
      },
      {
        defaultValue: isGetById ? undefined : [],
      }
    );
  }

  /**
   * Fetches paginated data from the API using the provided search parameters and pagination options.
   *
   * @param {Signal<paginationOptions>} [paginateOptions=this._defaultPaginateOptions] - Signal for pagination options, including page number, limit, and whether to paginate.
   * @param {Signal<Record<string, any>>} [searchParams=this._defaultSearchParams] - Signal for search parameters to filter the data.
   * @param {string} [specificEndpoint=''] - Optional specific endpoint to append to the base URL.
   * @returns {ResourceRef<pagination<T> | undefined>} A resource reference that resolves to the paginated data or undefined if an error occurs.
   */

  getWithPagination({
    paginateOptions = this._defaultPaginateOptions,
    searchParams,
    sort,
    specificEndpoint = '',
    getInactive = false,
  }: {
    paginateOptions?: maybeSignal<paginationOptions>;
    searchParams?: maybeSignal<Record<string, any>>;
    sort?: maybeSignal<orderByQuery<T>>;
    specificEndpoint?: string;
    getInactive?: maybeSignal<boolean | null>;
  }): ResourceRef<pagination<T> | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const pagination = mayBeSignalValue(paginateOptions);
        const params = mayBeSignalValue(searchParams);
        const sorts = mayBeSignalValue(sort);
        const inactive = mayBeSignalValue(getInactive);

        return { pagination, params, sorts, inactive };
      },
      stream: ({ params: { params, pagination, sorts, inactive } }) => {
        const query = new URLSearchParams({
          paginationOptions: JSON.stringify(pagination),
          ...((params || !inactive) && {
            searchParams: JSON.stringify({
              ...params,
              ...(typeof inactive === 'boolean' && !inactive && { active: true }),
              ...(typeof inactive === 'boolean' && inactive && { active: false }),
            }),
          }),
          ...(sorts && { orderBy: JSON.stringify(sorts) }),
        });

        return this._httpClient.get<pagination<T> | undefined>(fullURL, {
          params: new HttpParams({ fromString: query.toString() }),
          context: this.createHttpContext('getWithPagination'),
        });
      },
      defaultValue: undefined,
    });
  }

  getCount({
    searchParams,
    specificEndpoint = '',
    getInactive = false,
  }: {
    searchParams?: maybeSignal<Record<string, any>>;
    specificEndpoint?: string;
    getInactive?: maybeSignal<boolean | null>;
  }): ResourceRef<number> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const params = mayBeSignalValue(searchParams);
        const inactive = mayBeSignalValue(getInactive);

        return { params, inactive };
      },
      stream: ({ params: { params, inactive } }) => {
        const query = new URLSearchParams({
          count: 'true',
          ...((params || !inactive) && {
            searchParams: JSON.stringify({
              ...params,
              ...(typeof inactive === 'boolean' && !inactive && { active: true }),
              ...(typeof inactive === 'boolean' && inactive && { active: false }),
            }),
          }),
        });

        return this._httpClient.get<number>(fullURL, {
          params: new HttpParams({ fromString: query.toString() }),
        });
      },
      defaultValue: 0,
    });
  }

  /**
   * Send a DELETE request to the API with the given _id and specific endpoint.
   *
   * @param {string} _id The id of the document to be deleted.
   * @param {string} [specificEndpoint=''] The specific endpoint to be used.
   * @returns {Observable<boolean>} A httpCLient that resolves to true if the deletion was successful, or false if it failed.
   */
  delete({
    _id,
    specificEndpoint = '',
  }: {
    _id: string;
    specificEndpoint?: string;
  }): Observable<boolean> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;
    const params = new URLSearchParams({
      _id: _id,
    });

    return this._httpClient.delete<boolean>(fullURL, {
      params: new HttpParams({ fromString: params.toString() }),
      context: this.createHttpContext('delete'),
    });
  }

  /**
   * Exports all documents of the collection in CSV format to a file.
   *
   * Sends a GET request to the API endpoint with the "export" suffix and uses the
   * FileResolver to download the file in the browser. The file is named "export.csv".
   */
  exportCSV() {
    const fullURL = `${this.formatFullURL()}/export`;
    this._fileResolver.downloadFileInBrowser({ url: fullURL }, 'download');
  }
  //#endregion

  //#region UTILS
  /**
   * Returns the full URL for the API endpoint, including the
   * {@link ApiRequestManager#endpoint} property and the {@link ApiRequestManager#_apiURL}
   * property. If the `_apiURL` ends with a slash, it is removed to prevent
   * double slashes in the URL.
   *
   * @returns The full URL for the API endpoint.
   */
  protected formatFullURL() {
    return `${this._apiURL}${this._apiURL[this._apiURL.length - 1] === '/' ? '' : '/'}${this.endpoint}`;
  }

  protected createFormDataFromObject(
    data: Record<string, any>,
    fileFields: string[] = []
  ): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (isFormUploaderFileArray(value)) {
        value.forEach(file => formData.append(`${key}`, file.file));
      } else if (isFormUploaderFile(value)) {
        formData.append(key, value.file);
      } else if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else if (
        (fileFields.includes(key) && Array.isArray(value) && value.length === 0) ||
        value === null
      ) {
        formData.append(key, null!);
      } else {
        formData.append(key, value);
      }
    }

    return formData;
  }
  //#endregion

  /**
   * Creates an HTTP context for the given request type.
   *
   * This function creates a new HTTP context and sets the
   * {@link HTTP_NOTIFICATION_CONFIG_TOKEN} context token to the
   * notification configuration for the given request type.
   *
   * @param request - The type of request to create the context for.
   * @returns The created HTTP context.
   */
  private createHttpContext(request: ApiRequestType): HttpContext {
    const httpContext = new HttpContext();

    const actionConfig = this.config[request];

    httpContext.set(HTTP_NOTIFICATION_CONFIG_TOKEN, {
      elementName: this.elementName,
      notification: actionConfig?.notificationConfig,
    });

    return httpContext;
  }
}
