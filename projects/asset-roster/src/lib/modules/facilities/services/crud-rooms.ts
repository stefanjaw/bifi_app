import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { room } from '../interfaces/room';

@Injectable({
  providedIn: 'root',
})
export class CrudRooms extends ApiRequestManager<room> {
  constructor() {
    super();
    super.endpoint = 'rooms';
  }
}
