import { inject, Injectable } from '@angular/core';
import { LIBRARY_CONFIG } from '../libraries/library-config-token';

@Injectable({
  providedIn: 'root',
})
export class ApiRequestManager {
  private readonly apiURL = inject(LIBRARY_CONFIG).apiURL;

  constructor() {}
}
