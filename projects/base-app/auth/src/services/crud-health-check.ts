import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LIBRARY_CONFIG } from '@avalantec/base-app/core';

export interface HealthCheckResponse {
  version?: string;
  status?: string;
}

@Injectable({ providedIn: 'root' })
export class CrudHealthCheck {
  private http = inject(HttpClient);
  private apiURL = inject(LIBRARY_CONFIG).apiURL;

  /**
   * Performs a health check against the backend API.
   * @returns Observable of the health check response
   */
  check(): Observable<HealthCheckResponse> {
    const base = this.apiURL.endsWith('/') ? this.apiURL : `${this.apiURL}/`;
    return this.http.get<HealthCheckResponse>(`${base}health-check`);
  }
}
