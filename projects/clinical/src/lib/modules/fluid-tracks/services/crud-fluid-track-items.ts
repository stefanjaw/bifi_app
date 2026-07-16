import { Injectable } from '@angular/core';
import { ApiRequestManager } from '@avalantec/base-app/resource';
import { fluidTrackItem } from '../interfaces/fluid-tracks';

/** CRUD service for managing fluid track items */
@Injectable({ providedIn: 'root' })
export class CrudFluidTrackItems extends ApiRequestManager<fluidTrackItem> {
  constructor() {
    super();
    this.endpoint = 'fluid-track-items';
  }
}
