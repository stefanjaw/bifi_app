import { ApiRequestManager } from '@avalantec/base-app/resource';
import { Injectable } from '@angular/core';
import { customsChapter } from '../interfaces/customs-chapter';

@Injectable({
  providedIn: 'root',
})
export class CrudCustomsChapters extends ApiRequestManager<customsChapter> {
  constructor() {
    super();
    super.endpoint = 'customs-chapters';
  }
}
