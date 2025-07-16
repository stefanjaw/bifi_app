import { pagination } from './../interfaces/pagination';
import { inject, Injectable, ResourceRef, Signal, signal } from '@angular/core';
import { LIBRARY_CONFIG } from '../libraries/library-config-token';
import { HttpClient, HttpParams } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, throwError } from 'rxjs';
import { paginationOptions } from '../interfaces/pagination-options';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestManager<T> {
  private readonly _apiURL = inject(LIBRARY_CONFIG).apiURL;
  private _endpoint = '';
  private _httpClient = inject(HttpClient);
  private _defaultSearchParams = signal<Record<string, any>>({});
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

  set endpoint(endpoint: string) {
    if (endpoint.includes('/'))
      throw new Error('Endpoint cannot have the / symbol');

    this._endpoint = endpoint;
  }

  //#region Functions to call api
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
          }),
        ),
      defaultValue: undefined,
    });
  }

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
          }),
        ),
      defaultValue: undefined,
    });
  }

  get({
    searchParams = this._defaultSearchParams,
    specificEndpoint = '',
  }: {
    searchParams?: Signal<Record<string, any>>;
    specificEndpoint?: string;
  }): ResourceRef<T[]> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const params = searchParams();

        return { params };
      },
      stream: ({ params: { params } }) => {
        const query = new URLSearchParams({
          searchParams: JSON.stringify(params),
        });

        return this._httpClient
          .get<T[]>(fullURL, {
            params: new HttpParams({ fromString: query.toString() }),
          })
          .pipe(
            catchError((err: any) => {
              this.manageError(fullURL, err.message);
              return throwError(() => err);
            }),
          );
      },
      defaultValue: [],
    });
  }

  getWithPagination({
    paginateOptions = this._defaultPaginateOptions,
    searchParams = this._defaultSearchParams,
    specificEndpoint = '',
  }: {
    paginateOptions?: Signal<paginationOptions>;
    searchParams?: Signal<Record<string, any>>;
    specificEndpoint?: string;
  }): ResourceRef<pagination<T> | undefined> {
    const fullURL = `${this.formatFullURL()}${specificEndpoint ? '/' + specificEndpoint : ''}`;

    return rxResource({
      params: () => {
        const pagination = paginateOptions();
        const params = searchParams();

        return { pagination, params };
      },
      stream: ({ params: { params, pagination } }) => {
        const query = new URLSearchParams({
          searchParams: JSON.stringify(params),
          paginationOptions: JSON.stringify(pagination),
        });

        return this._httpClient
          .get<pagination<T> | undefined>(fullURL, {
            params: new HttpParams({ fromString: query.toString() }),
          })
          .pipe(
            catchError((err: any) => {
              this.manageError(fullURL, err.message);
              return throwError(() => err);
            }),
          );
      },
      defaultValue: undefined,
    });
  }

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
            }),
          ),
      defaultValue: false,
    });
  }
  //#endregion

  //#region UTILS
  private formatFullURL() {
    return `${this._apiURL}${this._apiURL[this._apiURL.length - 1] === '/' ? '' : '/'}${this.endpoint}`;
  }

  private manageError(fullURL: string, message: string) {
    const error = new Error(`POST ${fullURL} failed: ${message}`);

    console.error(error);
    throw error;
  }
  //#endregion
}
