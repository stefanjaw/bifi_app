import { pagination } from './../interfaces/pagination';
import { inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { LIBRARY_CONFIG } from '../libraries/library-config-token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { paginationOptions } from '../interfaces/pagination-options';
import { orderByQuery } from '../interfaces/order-by';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestManager<T> {
  private readonly _apiURL = inject(LIBRARY_CONFIG).apiURL;
  private _endpoint = '';
  private _httpClient = inject(HttpClient);
  private _defaultPaginateOptions = signal<paginationOptions>({
    page: 1,
    limit: 5,
    paginate: true,
  });

  constructor() {}

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
   * @param formData The form data to be sent.
   * @param specificEndpoint The specific endpoint to be used. If not provided, the default endpoint of the service will be used.
   * @returns A resource ref that resolves to the response of the request, or undefined if the request fails.
   */
  post({
    formData,
    specificEndpoint = '',
  }: {
    formData: FormData;
    specificEndpoint?: string;
  }): ResourceRef<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      stream: () =>
        this._httpClient.post<T | undefined>(fullURL, formData).pipe(
          catchError((err: any) => {
            this.manageError(fullURL, err.message);
            return throwError(() => err);
          })
        ),
      defaultValue: undefined,
    });
  }

  /**
   * Sends a PUT request to the API with the given _id and form data.
   *
   * @param {string} _id The id of the document to be updated.
   * @param {FormData} formData The form data to be sent in the request.
   * @param {string} [specificEndpoint] An optional specific endpoint to be used.
   * @returns {ResourceRef<T | undefined>} A resource ref that resolves to the updated entity or undefined if the request fails.
   */

  put({
    _id,
    formData,
    specificEndpoint = '',
  }: {
    _id: string;
    formData: FormData;
    specificEndpoint?: string;
  }): ResourceRef<T | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    // set id to the formData
    formData.append('_id', _id);

    return rxResource({
      stream: () =>
        this._httpClient.put<T | undefined>(fullURL, formData).pipe(
          catchError((err: any) => {
            this.manageError(fullURL, err.message);
            return throwError(() => err);
          })
        ),
      defaultValue: undefined,
    });
  }

  /**
   * Get data from the api.
   *
   * @param searchParams The search params as a signal. If not provided, the default search params will be used.
   * @param specificEndpoint The specific endpoint to be used. If not provided, the default endpoint of the service will be used.
   * @returns A resource ref that resolves to an array of T or an empty array if the request fails.
   */
  get({
    searchParams,
    sort,
    specificEndpoint = '',
  }: {
    searchParams?: Signal<Record<string, any>>;
    sort?: Signal<orderByQuery<T>>;
    specificEndpoint?: string;
  }): ResourceRef<T[]> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const params = searchParams?.();
        const sorts = sort?.();

        return { params, sorts };
      },
      stream: ({ params: { params, sorts } }) => {
        const query = new URLSearchParams({
          ...(params && { searchParams: JSON.stringify(params) }),
          ...(sorts && { orderBy: JSON.stringify(sorts) }),
        });

        return this._httpClient
          .get<T[]>(fullURL, {
            params: new HttpParams({ fromString: query.toString() }),
          })
          .pipe(
            catchError((err: any) => {
              this.manageError(fullURL, err.message);
              return throwError(() => err);
            })
          );
      },
      defaultValue: [],
    });
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
  }: {
    paginateOptions?: Signal<paginationOptions>;
    searchParams?: Signal<Record<string, any>>;
    sort?: Signal<orderByQuery<T>>;
    specificEndpoint?: string;
  }): ResourceRef<pagination<T> | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const pagination = paginateOptions();
        const params = searchParams?.();
        const sorts = sort?.();

        return { pagination, params, sorts };
      },
      stream: ({ params: { params, pagination, sorts } }) => {
        const query = new URLSearchParams({
          paginationOptions: JSON.stringify(pagination),
          ...(params && { searchParams: JSON.stringify(params) }),
          ...(sorts && { orderBy: JSON.stringify(sorts) }),
        });

        return this._httpClient
          .get<pagination<T> | undefined>(fullURL, {
            params: new HttpParams({ fromString: query.toString() }),
          })
          .pipe(
            catchError((err: any) => {
              this.manageError(fullURL, err.message);
              return throwError(() => err);
            })
          );
      },
      defaultValue: undefined,
    });
  }

  /**
   * Send a DELETE request to the API with the given _id and specific endpoint.
   *
   * @param {string} _id The id of the document to be deleted.
   * @param {string} [specificEndpoint=''] The specific endpoint to be used.
   * @returns {ResourceRef<boolean>} A resource ref that resolves to true if the deletion was successful, or false if it failed.
   */
  delete({
    _id,
    specificEndpoint = '',
  }: {
    _id: string;
    specificEndpoint: string;
  }): ResourceRef<boolean> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;
    const params = new URLSearchParams({
      _id: _id,
    });

    return rxResource({
      stream: () =>
        this._httpClient
          .delete<boolean>(fullURL, {
            params: new HttpParams({ fromString: params.toString() }),
          })
          .pipe(
            catchError((err: any) => {
              this.manageError(fullURL, err.message);
              return throwError(() => err);
            })
          ),
      defaultValue: false,
    });
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
  private formatFullURL() {
    return `${this._apiURL}${this._apiURL[this._apiURL.length - 1] === '/' ? '' : '/'}${this.endpoint}`;
  }

  /**
   * Logs and throws an error with a formatted message indicating
   * a failed POST request to the specified URL.
   *
   * @param fullURL - The full URL of the API endpoint.
   * @param message - The error message detailing the failure.
   * @throws Error - Throws an Error with the formatted message.
   */

  private manageError(fullURL: string, message: string) {
    const error = new Error(`POST ${fullURL} failed: ${message}`);

    console.error(error);
    throw error;
  }
  //#endregion
}
